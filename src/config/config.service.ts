import * as dotenv from 'dotenv';

export class ConfigService{

    private readonly envConfig :Record<string, string>;
    constructor(){
        const result = dotenv.config();

        if(result.error){
            this.envConfig = process.env;
        }else{
            this.envConfig = result.parsed;
        }
    }

    public get(key : string):string {
        return this.envConfig[key];
    }

    public async getPortConfig() {
        return this.get('PORT');
    }

    public async getMongoConfig(){
        return {
            url:'mongodb+srv://dbotestuser:testuser@cluster0.wwh7q.mongodb.net/rankmath?retryWrites=true&w=majority',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    }
}