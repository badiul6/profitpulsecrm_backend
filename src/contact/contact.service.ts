import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ContactDto, ContactFileDto } from './dto';
import * as xlsx from 'xlsx';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schema';
import { Model } from 'mongoose';
import { ReqUser } from 'src/auth/dto';
import { Contact } from './schema';
import { Website } from 'src/website/schema';

@Injectable()
export class ContactService {
    constructor(
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Website.name) private websiteModel: Model<Website>) {}

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
        }).select('-_id -__v').exec();
        return {
            data:contacts
        };

    }

    async addContact(code:string, contactDto:ContactDto){
        const connection=  await this.websiteModel.findOne({code:code}).exec();
        if(!connection){
            throw new NotFoundException("Connection Not found");
        }
        try{            
            await this.contactModel.create({
                email: contactDto.email,
                fullname: contactDto.fullname,
                phone: contactDto.phone,
                companyname: contactDto.companyname,
                jobtitle: contactDto.jobtitle,
                company: connection.company
            });
        }
        catch(error){
            if (error.code === 11000) {
                // Handle duplicate key error (E11000)
                throw new ConflictException('Contact already exists');
            }
        }
    }

    async createContact(user: ReqUser, contactDto: ContactDto){
        const userinDb=  await this.userModel.findById(user.id).exec();
        try{            
            await this.contactModel.create({
                email: contactDto.email,
                fullname: contactDto.fullname,
                phone: contactDto.phone,
                companyname: contactDto.companyname,
                jobtitle: contactDto.jobtitle,
                company: userinDb.company
            });
            return;
        }
        catch(error){
            if (error.code === 11000) {
                throw new ConflictException('Contact already exists');
            }
        }
    }

}
