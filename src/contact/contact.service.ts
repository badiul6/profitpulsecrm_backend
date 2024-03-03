import { Injectable } from '@nestjs/common';
import { ContactFileDto } from './dto';
import * as xlsx from 'xlsx';

@Injectable()
export class ContactService {
    importFile(fileDto: ContactFileDto){
        const workbook = xlsx.read(fileDto.spreadsheet.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Assuming you're interested in the first sheet
        console.log(sheetName);

    }
}
