import { Injectable } from '@nestjs/common';
import {CreateUserEvent} from "./create-user.event";

@Injectable()
export class AppService {
  private readonly analytics: any[] = [];

  getHello(): string {
    return 'Hello World!';
  }

  handleUserCreated(data: CreateUserEvent){
    console.log('handleUserCreated - Analytics', data)
    this.analytics.push(
      {
        email: data.email,
        timeStamp: new Date()
      }
    )
  }

  getAnalytics(){
    return this.analytics
  }
}
