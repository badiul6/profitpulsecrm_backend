import { Injectable } from '@nestjs/common';
import { ContactFileDto } from './dto';
import * as xlsx from 'xlsx';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schema';
import { Model } from 'mongoose';
import { ReqUser } from 'src/auth/dto';
import { Contact } from './schema';

@Injectable()
export class ContactService {
    constructor(@InjectModel(Contact.name) private contactModel: Model<Contact>,
        @InjectModel(User.name) private userModel: Model<User>) {

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
            await this.contactModel.insertMany(contacts, {ordered: false});
        }
        finally{
            return;
        }
    }


    
}
