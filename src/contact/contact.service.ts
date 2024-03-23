import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConnectGmailDto, ContactFileDto } from './dto';
import * as xlsx from 'xlsx';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schema';
import { Model } from 'mongoose';
import { ReqUser } from 'src/auth/dto';
import { Connection, Contact } from './schema';
import * as nodeMailer from 'nodemailer';
import { GoogleApis, gmail_v1, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
var parseMessage = require('gmail-api-parse-message');
var Batchelor = require('batchelor');

@Injectable()
export class ContactService {
    constructor(
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Connection.name) private connectionModel: Model<Connection>,
        private config: ConfigService) {


    }

    async importFile(user: ReqUser, fileDto: ContactFileDto) {
        //for getting the companyID
        const userinDB = await this.userModel.findById(user.id);
        //reading excelfile(csv or xlsx)
        const workbook = xlsx.read(fileDto.spreadsheet.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Assuming you're interested in the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const contacts = xlsx.utils.sheet_to_json(worksheet);
        //adding companyID to each contact
        for (const obj of contacts) {
            obj['company'] = userinDB.company;
        }
        try {
            //uploading contacts ignoring duplicates
            await this.contactModel.insertMany(contacts, { ordered: false });
        }
        finally {
            return;
        }
    }
    async getContacts(user: ReqUser) {
        const userinDB = await this.userModel.findById(user.id);
        const contacts = await this.contactModel.find({
            company: userinDB.company
        }).exec();
        return contacts;

    }
    async connectGmail(user: ReqUser, connectionDto: ConnectGmailDto) {
        try {
            const oAuth2Client = new google.auth.OAuth2(
                this.config.get('CLIENT_ID'),
                this.config.get('CLIENT_SECRET'),
                this.config.get('REDIRECT_URI'));

            const { tokens } = await oAuth2Client.getToken(connectionDto.authorization_code);
            oAuth2Client.setCredentials(tokens);
            await this.connectionModel.findOneAndUpdate(
                { user: user.id },
                {
                    refresh_token: tokens.refresh_token,
                    user: user.id
                },
                { upsert: true, new: true }
            );
        }
        catch (error) {
            console.log(error)
            throw new UnauthorizedException();
        }
    }

    async getEmailMessages(user: ReqUser) {
        const connection = await this.connectionModel.findOne({
            user: user.id
        }).exec();

        if (!connection) {
            throw new NotFoundException('Connection to gmail Not Found');
        }
        const refresh_token = connection.refresh_token;

        try{
            const oAuth2Client = new google.auth.OAuth2(
                this.config.get('ClIENT_ID'),
                this.config.get('CLIENT_SECRET'),
                this.config.get('REDIRECT_URI'));
    
            oAuth2Client.setCredentials({ refresh_token: refresh_token });
            const gmail = google.gmail({
                version: 'v1',
                auth: oAuth2Client
            });
    
            const res = await gmail.users.messages.list({ userId: 'me', maxResults: 50 });
            const msgs = res.data.messages;
    
            const at = await oAuth2Client.getAccessToken();
    
            var batch = new Batchelor({
                'uri': 'https://www.googleapis.com/batch/gmail/v1/',
                'method': 'POST',
                'auth': {
                    'bearer': [at.token]
                },
                'headers': {
                    'Content-Type': 'multipart/mixed'
                }
            });
    
    
            for (const msg of msgs) {
                batch.add({
    
                    'method': 'GET',
                    'path': `/gmail/v1/users/me/messages/${msg.id}?format=full`
                });
            }
            const messages = [];
            await new Promise<void>((resolve, reject) => {
                batch.run(function (err, response) {
                    if (err) {
                        console.log("Error: " + err.toString());
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
                }
                else {
                    response[threadId].push(message);
                }
            }
            return response;
        }
        catch(error){
            throw new NotFoundException();
        }
       
    }
   


}
