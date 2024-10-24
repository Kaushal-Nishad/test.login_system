import { ExceptionFilter, Catch, ArgumentsHost, HttpException, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';



@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    getMessage(resData) {
        if (Array.isArray(resData)) {
            return resData[0];
        } else {
            return resData;
        }

    }
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        try{
        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                errorName: exception?.name,
                message: exception?.getResponse()['response'] != null ? exception?.message : this.getMessage(exception?.getResponse()['message']),
            });
            let responsemessage = {
                statuscode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                errorName: exception?.name,
                message: exception?.message,
                exception: exception,
            };

            //console.log(response);
            let ErrorText = `**********${responsemessage.timestamp}**********` + '\n';
            ErrorText += `Path = ${responsemessage.path}` + '\n';
            ErrorText += JSON.stringify(exception) + '\n';
            const fs = require('fs');
            const filePath = `./Log`;
            // const fileName = `Error.txt`;
            const dir = `${filePath}`;

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            var fileName = mm + '' + dd + '' + yyyy + '.txt';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {
                    recursive: true,
                });
            }
            if (!fs.existsSync(`${filePath}/${fileName}`)) {
                fs.writeFile(`${filePath}/${fileName}`, ErrorText, function (err) {
                    if (err) throw new ForbiddenException(err);
                    console.log('Saved!');
                });
            } else {
                fs.appendFile(`${filePath}/${fileName}`, ErrorText, function (err) {
                    if (err) throw new ForbiddenException(err);
                    console.log('Saved!');
                });
            }
        } catch (error) {
            const data = response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                errorName: exception?.name,
                message: exception?.message,
            });
        }
    }
}