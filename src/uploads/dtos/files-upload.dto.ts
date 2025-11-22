import { ApiProperty } from "@nestjs/swagger";

export class FilesUploadDto {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
        name: 'files',
    })
    files: Array<Express.Multer.File>;
}