import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class ContactFileDto{
    @IsFile()
    @MaxFileSize(5e6) // Adjust the maximum file size as needed
    @HasMimeType(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']) // Mime type for xlsx files
    spreadsheet: MemoryStoredFile

}