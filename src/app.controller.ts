import { Controller, Get, Body, Put } from '@nestjs/common';
import { AppService } from './app.service';

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
}
