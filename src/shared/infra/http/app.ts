import path from 'path';
import cors from 'cors';
import express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import { config as dotenvConfig } from 'dotenv';

//TBD //import '@shared/infra/mongoose/connection';
import TokenError from '@shared/errors/TokenError';
import routes from './api/v1';

class App {

  public Express: Application;

  private _IsNotProductionEnvironment: boolean;

  constructor(){
    this.Express = express();
    this._IsNotProductionEnvironment = process.env.NODE_ENV !== 'production';

    this._EnvironmentVariables();
    this._Middlewares();
    this._Security();
    this._Routes();
    this._Exception();
  }

  private _EnvironmentVariables(){
    const envfilePath = path.resolve(__dirname, '..', '..', '..', '..', '.env');
      dotenvConfig({ path: envfilePath });
  }

  private _Middlewares()
  {
    this.Express.use(express.json());
    this.Express.use(cors());
  }

  private _Security()
  {
    this.Express.disable('x-powered-by');
    this.Express.disable('etag');
  }

  private _Routes()
  {
    this.Express.use('/api', routes);
  }

  private _Exception()
  {
    this.Express.use(
      (err: Error, req: Request, res: Response, _: NextFunction) => {
        if (this._IsNotProductionEnvironment) {
          console.log(err);
        }

        if (err instanceof TokenError) {
          return res.status(401).json({ message: err.message });
        }

        return res.status(500).json({ message: 'Internal server error.' });
      }
    )
  }
}

export default new App().Express;
