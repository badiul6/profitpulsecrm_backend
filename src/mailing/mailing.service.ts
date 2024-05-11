import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema';
import { Contact } from 'src/contact/schema';
import { Gmail } from './schema';
import { ConfigService } from '@nestjs/config';
import {
  ConnectGmailDto,
  InReplyToDto,
  MarketingEmailsDto,
  ReadMsgDto,
  SendEmailDto,
} from './dto';
import { ReqUser } from 'src/auth/dto';
import { google } from 'googleapis';
import Handlebars from 'handlebars';
import { Campaign } from 'src/campaign/schema';
var Batchelor = require('batchelor');
var parseMessage = require('gmail-api-parse-message');

@Injectable()
export class MailingService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Gmail.name) private gmailModel: Model<Gmail>,
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    private config: ConfigService,
  ) {}

  async connectGmail(user: ReqUser, connectionDto: ConnectGmailDto) {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        this.config.get('CLIENT_ID'),
        this.config.get('CLIENT_SECRET'),
        this.config.get('REDIRECT_URI'),
      );

      const { tokens } = await oAuth2Client.getToken(
        connectionDto.authorization_code,
      );
      oAuth2Client.setCredentials(tokens);
      await this.gmailModel.findOneAndUpdate(
        { user: user.id },
        {
          refresh_token: tokens.refresh_token,
          user: user.id,
        },
        { upsert: true, new: true },
      );
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async disconnectGmail(user: ReqUser) {
    const gmailConnection = await this.gmailModel
      .findOneAndDelete({ user: user.id })
      .exec();
    if (gmailConnection == null) {
      throw new NotFoundException('Connection Not Found');
    }
  }
  async getConnection(user: ReqUser) {
    const gmailConnection = await this.gmailModel
      .findOne({ user: user.id })
      .exec();

    return { connected: gmailConnection !== null };
  }

  async getEmailMessages(user: ReqUser) {
    const connection = await this.gmailModel
      .findOne({
        user: user.id,
      })
      .exec();

    if (!connection) {
      throw new NotFoundException('Connection to gmail Not Found');
    }
    const refresh_token = connection.refresh_token;

    try {
      const oAuth2Client = new google.auth.OAuth2(
        this.config.get('CLIENT_ID'),
        this.config.get('CLIENT_SECRET'),
        this.config.get('REDIRECT_URI'),
      );

      oAuth2Client.setCredentials({ refresh_token: refresh_token });
      const gmail = google.gmail({
        version: 'v1',
        auth: oAuth2Client,
      });

      const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 50,
      });
      const msgs = res.data.messages;
      if (!msgs) {
        return {};
      }
      const at = await oAuth2Client.getAccessToken();

      var batch = new Batchelor({
        uri: 'https://www.googleapis.com/batch/gmail/v1/',
        method: 'POST',
        auth: {
          bearer: [at.token],
        },
        headers: {
          'Content-Type': 'multipart/mixed',
        },
      });

      for (const msg of msgs) {
        batch.add({
          method: 'GET',
          path: `/gmail/v1/users/me/messages/${msg.id}?format=full`,
        });
      }
      const messages = [];
      await new Promise<void>((resolve, reject) => {
        batch.run(function (err, response) {
          if (err) {
            console.log('Error: ' + err.toString());
          } else {
            for (const msg of response.parts) {
              if (msg.statusCode == 200) {
                const parse = parseMessage(msg.body);
                messages.push(parse);
              }
            }
            resolve(); // Resolve the Promise once batch processing is complete
          }
        });
      });
      const response: { [key: string]: {}[] } = {};
      for (const message of messages) {
        const threadId = message.threadId;
        if (!response.hasOwnProperty(threadId)) {
          response[threadId] = [message];
        } else {
          response[threadId].push(message);
        }
      }
      return response;
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }
  async sendMarketingEmails(user: ReqUser, emailDto: MarketingEmailsDto) {
    const userinDB = await this.userModel.findById(user.id).exec();
    if (!userinDB) {
      throw new NotFoundException('User Not Found');
    }

    const campaign = await this.campaignModel
      .findOne({ name: emailDto.campaign_name })
      .exec();
    if (
      !campaign ||
      userinDB.company.toString() != campaign.company.toString()
    ) {
      throw new NotFoundException('No campaign found with this name');
    }

    const connection = await this.gmailModel
      .findOne({
        user: user.id,
      })
      .exec();

    if (!connection) {
      throw new NotFoundException('Connection to gmail Not Found');
    }

    try {
      const oAuth2Client = new google.auth.OAuth2(
        this.config.get('CLIENT_ID'),
        this.config.get('CLIENT_SECRET'),
        this.config.get('REDIRECT_URI'),
      );

      oAuth2Client.setCredentials({ refresh_token: connection.refresh_token });
      const gmail = google.gmail({
        version: 'v1',
        auth: oAuth2Client,
      });

      const emailAddress = (await gmail.users.getProfile({ userId: 'me' })).data
        .emailAddress;

      const userDetails = await this.contactModel
        .find(
          { company: userinDB.company, email: { $in: emailDto.mailing_list } },
          'fullname email',
        )
        .exec();
      if (userDetails.length == 0) {
        throw new NotFoundException('No contact exists');
      }
      const foundEmails = userDetails.map((user) => user.email);
      emailDto.mailing_list = emailDto.mailing_list.filter((email) =>
        foundEmails.includes(email),
      );

      const template = Handlebars.compile(emailDto.html_template);
      const backend_url= this.config.get('BACKEND_SERVER_URL');
      for (var i = 0; i < emailDto.mailing_list.length; i++) {
        const html = template({
          name: userDetails[i].fullname,
          trackinglink: `${backend_url}/campaign/click?campaign=${campaign.id}&url=${emailDto.url}&email=${userDetails[i].email}`,
        });
        const raw = [
          `From: ${userinDB.fullname}< ${emailAddress}>`,
          `To: ${userDetails[i].email}`,
          'Content-Type: text/html; charset=utf-8',
          'MIME-Version: 1.0',
          `Subject: ${emailDto.subject}`,
          '',
          html,
        ].join('\n');
        await gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: Buffer.from(raw).toString('base64'),
          },
        });
      }
      campaign.totalEmailsSent += emailDto.mailing_list.length;
      await campaign.save();
    } catch (error) {
      if (
        error.response.status == 400 &&
        error.response.data.error_description.toString() ==
          'Token has been expired or revoked.'
      ) {
        throw new BadRequestException('Reconnect Gmail');
      }
      throw new NotFoundException(error.response.message);
    }
  }

  async sendMessage(user: ReqUser, dto: SendEmailDto) {
    const userinDB = await this.userModel.findById(user.id).exec();
    const connection = await this.gmailModel
      .findOne({
        user: user.id,
      })
      .exec();

    if (!connection) {
      throw new NotFoundException('Connection to gmail Not Found');
    }
    try {
      const oAuth2Client = new google.auth.OAuth2(
        this.config.get('CLIENT_ID'),
        this.config.get('CLIENT_SECRET'),
        this.config.get('REDIRECT_URI'),
      );

      oAuth2Client.setCredentials({ refresh_token: connection.refresh_token });
      const gmail = google.gmail({
        version: 'v1',
        auth: oAuth2Client,
      });

      const emailAddress = (await gmail.users.getProfile({ userId: 'me' })).data
        .emailAddress;

      const raw = [
        `From:${userinDB.fullname}<${emailAddress}>`,
        `To:${dto.to}`,
        `Subject:${dto.subject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',

        '',
        dto.body,
      ];
      if (dto.cc) {
        raw.splice(3, 0, `Cc:${dto.cc}`); // Inserts at index 3, adjust index based on where Cc should appear
      }

      // Conditionally add 'Bcc' if provided
      if (dto.bcc) {
        const bccIndex = dto.cc ? 4 : 3; // Adjusts index based on whether Cc was added
        raw.splice(bccIndex, 0, `Bcc:${dto.bcc}`);
      }
      const emailContent = raw.join('\n');

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: Buffer.from(emailContent).toString('base64url'),
        },
      });
      return;
    } catch (error) {
      console.log(error.response.data);
      throw new NotAcceptableException();
    }
  }

  async inReplyTo(user: ReqUser, dto: InReplyToDto) {
    const userinDB = await this.userModel.findById(user.id).exec();
    const connection = await this.gmailModel
      .findOne({
        user: user.id,
      })
      .exec();

    if (!connection) {
      throw new NotFoundException('Connection to gmail Not Found');
    }
    try {
      const oAuth2Client = new google.auth.OAuth2(
        this.config.get('CLIENT_ID'),
        this.config.get('CLIENT_SECRET'),
        this.config.get('REDIRECT_URI'),
      );

      oAuth2Client.setCredentials({ refresh_token: connection.refresh_token });
      const gmail = google.gmail({
        version: 'v1',
        auth: oAuth2Client,
      });
      const response = await gmail.users.messages.get({
        userId: 'me',
        id: dto.thread_id,
        format: 'metadata',
        metadataHeaders: ['References', 'Message-ID'],
      });
      const headers = response.data.payload.headers;

      const messageIdHeader = headers.find(
        (header) =>
          header.name === 'Message-ID' || header.name === 'Message-Id',
      );
      const emailAddress = (await gmail.users.getProfile({ userId: 'me' })).data
        .emailAddress;

      const raw = [
        `From:${userinDB.fullname}<${emailAddress}>`,
        `To:${dto.to}`,
        `Subject:RE: ${dto.subject}`,
        `In-Reply-To:${messageIdHeader.value}`,
        `References:${messageIdHeader.value}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',

        '',
        dto.body,
      ].join('\n');
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: Buffer.from(raw).toString('base64url'),
          threadId: dto.thread_id,
        },
      });
      return;
    } catch (error) {
      throw new NotAcceptableException();
    }
  }

  async read(user: ReqUser, dto: ReadMsgDto) {
    const connection = await this.gmailModel
      .findOne({
        user: user.id,
      })
      .exec();

    if (!connection) {
      throw new NotFoundException('Connection to gmail Not Found');
    }
    try {
      const oAuth2Client = new google.auth.OAuth2(
        this.config.get('CLIENT_ID'),
        this.config.get('CLIENT_SECRET'),
        this.config.get('REDIRECT_URI'),
      );

      oAuth2Client.setCredentials({ refresh_token: connection.refresh_token });
      const gmail = google.gmail({
        version: 'v1',
        auth: oAuth2Client,
      });

      await gmail.users.threads.modify({
        userId: 'me',
        id: dto.msg_id,
        requestBody: {
          removeLabelIds: ['UNREAD'], // Command to remove the 'UNREAD' label from the message
        },
      });
      return;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
