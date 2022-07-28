import {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewaySimpleAuthorizerWithContextResult,
} from 'aws-lambda';
import {contextAuth2 } from './IAuthorizerContext'

// format simple authorizer must be https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html
interface IResponseAuthSimplePayloadv2 {
  isAuthorized: boolean
  context: contextAuth2
}

const authorizerHandler = async (
  authorizerEventV2: APIGatewayRequestAuthorizerEventV2,
): Promise<APIGatewaySimpleAuthorizerWithContextResult<contextAuth2>> => {

// We set the template of the response. IsAuthorized is mandatory 
// while context is option and up to us to implement there whatever values we want to pass to our service lambda
  const response : IResponseAuthSimplePayloadv2= {
    isAuthorized: false,
    context: {
      userId: '',
      // if add another field here we will get an error 
    },
  };

  const authToken = authorizerEventV2.identitySource[0];
  // will assume the token is valid for the purpose of the demo, but here's where you implement your validation on the authToken
  if(authToken){
      response.isAuthorized = true
      response.context.userId = "userIdExtractedFromAuthToken"
            // if add another field here on context we will also get an error too since is not defined in the context interface 
            // example : response.context.unexpectedField = 1
  }

  return response;
};

module.exports = { authorizerHandler };
