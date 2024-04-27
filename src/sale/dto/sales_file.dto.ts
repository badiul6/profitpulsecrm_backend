import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class SalesFileDto{
    @IsFile()
    @MaxFileSize(5e6) // Adjust the maximum file size as needed
    @HasMimeType(['application/json']) // Mime type for JSON files
    file: MemoryStoredFile

}