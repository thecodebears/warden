import { Controller, Get, Body, Put, Post, Head, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { verify } from 'jsonwebtoken';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Put()
    async putHello(@Body() { name }: { name: string }): Promise<string> {
        try {
			await this.appService.setHello(name);
			return `Name ${name} was successfully set`;
        } catch (err) {
          	return err;
        }
    }

    @Get()
    getHello(): Promise<string> {
        return this.appService.getHello();
    }

    @Post('/connect/request')
    public async requestConnection(@Body() { host, permissions }: { host: string, permissions: string[] }): Promise<string> {
        return await this.appService.createVerificationToken(host, permissions)
    }

    // @Post('/connect')
    // public async verifyConnection(@Req() request: Request): Promise<{token: string, hmacSecret: string}> {
    //     let { id, hmacSecret } = request.body;
    //     let { host, permissions } = await verify(request.headers['Verify']).payload;
    // }
}
