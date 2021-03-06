# vista-novo-generated-fhir

This project is the node.js web application that is generated by the vista-novo-fhir project. It is a web application that serves FHIR. Currently it implements the JSON aspects of FHIR.

## Installing

    npm install

## Running

    node app.js

## Testing

    mocha

## Architecture

This application is built using the [express](http://expressjs.com/) web framework and [mongoose](http://mongoosejs.com/) for interaction with MongoDB. The controllers in the app/controllers folder are automatically generated to provide a FHIR interface. The Mongoose models are also automatically generated to be an exact replica of the JSON FHIR representation of a resource.

## Service Invokers

This application contains two service invokers. These are express middleware that will intercept requests to patient and observation. They will then invoke a RESTful web service to retrieve information. In the creation of this application the services were created to work with the [VistA Novo Test Stub](https://github.com/OSEHRA/vista-novo-test-stub). The intention is that these services could be replaced with VistA based services, such as those generated by the VA's VSA tool suite. The services are configured in the config/external_services.js file.

If you don't want to use these service invokers, you can just remove them in the config/express.js file.
