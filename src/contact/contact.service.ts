import { Injectable } from '@nestjs/common';
import { ContactFileDto } from './dto';

@Injectable()
export class ContactService {
    importFile(fileDto: ContactFileDto){
        console.log(fileDto);

    }
}
