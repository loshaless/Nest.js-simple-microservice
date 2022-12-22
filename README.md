## Installation

```bash
# in sample-analytics folder
$ npm install
```
```bash
# in sample-backend folder
$ npm install
```
```bash
# in sample-communication folder
$ npm install
```

## Running the app

```bash
# in sample-analytics folder
$ npm run start
```
```bash
# in sample-backend folder
$ npm run start
```
```bash
# in sample-communication folder
$ npm run start
```

## Short Explanation

```bash
http://localhost:3000/ (sample-backend) is the gateway.
All of the request from user will be sent to other service using API
sample-analytics : http://localhost:3001/
sample-communication: http://localhost:3002/
```

## Microservice flow for POST: http://localhost:3000/ 
contract for body
```bash
{
  email: profile@mail.id,
  password: Brandal17,
}
```
<br />

1. Repo sample-backend is gateway a gateway that will listen at port 3000
```bash
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();.
```

2. User hit Post localhost:3000 will received by controller at sample-backend folder
```bash
@Post()
createUser(@Body() createUserRequest: CreateUserRequest) {
  this.appService.createUser(createUserRequest);
}
```

3. Request will be sent to service in sample-backend folder
```bash
# service that will recevied request
constructor(
      @Inject('COMMUNICATION')
      private readonly communicationClient: ClientProxy,

      @Inject('ANALYTICS')
      private readonly analyticsClient: ClientProxy
 ) {}


createUser(createUserRequest: CreateUserRequest){
  this.users.push(createUserRequest)

  # panggil microservice COMMUNICATION yang memanggil port 3002
  this.communicationClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email)
  )

  # panggil microservice ANALYTICS yang memanggil port 3001
  this.analyticsClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email)
  )
}
```

```bash
# you can find this code below at app.module.ts in sample-backend folder
@Module({
  imports: [
      ClientsModule.register([
        {
          name: 'COMMUNICATION',
          transport: Transport.TCP,
            options: {
              port:3002
            }
        },
        {
          name: 'ANALYTICS',
          transport: Transport.TCP,
          options: {
              port:3001
          }
        }
      ])
  ],
)}
```

4. Request will be received by the controller sample-communication folder
```bash
@EventPattern('user_created')
handleUserCreated(data: CreateUserEvent){
  this.appService.handleUserCreated(data)
}
```

5. Constroller will sent this request to service in sample-communication folder
```bash
// ini ibarat database
private readonly analytics: any[] = [];

handleUserCreated(data: CreateUserEvent){
  console.log('handleUserCreated - COMMUNICATIONS', data)
}
```