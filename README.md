# API Gateway

The API Gateway is responsible for receiving all backend requests from the client, and routing it to the correct service. It is also responsible for handling authentication and authorization.

## Run it Locally

The ideal way to run this project is using docker compose. In the `development-setup` repository, there is a docker compose that will run all services needed for the basic functionality of the application, including the API Gateway. For this, clone or pull the `development-setup` repository, and run the following command:

`docker compose up --build`.

That will start the api gateway at port 3000, and the other services at their respective ports wired by service name, as well as the postgres database.

## How does it work

As said, this project routes requests to the proper service. At the moment, we have 2 services to route: User service, and Training service.

Route of requests to the user service have to start with `/user-service`, and for training service, with `/training-service`. After that, you use the endpoint of the service itself, and this project sends the requests and wait for the response, returning the same thing.

It also does some authentication. Your request must have a header called `Authorization`, with a valid JWT token. If it doesn't, the request will be rejected. If it does, the token will be validated, and if it is valid, the request will be sent to the service. If it is not, the request will be rejected.

Good Luck!
