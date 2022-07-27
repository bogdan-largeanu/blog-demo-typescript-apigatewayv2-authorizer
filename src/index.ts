import {
  APIGatewayProxyHandlerV2WithLambdaAuthorizer,
  APIGatewayAuthorizerResultContext,
} from 'aws-lambda';
import { contextAuth2 } from "./IAuthorizerContext"

interface requestBody {
  file_no: string;
}
// We build a type that combines both the expected Event types and our custom context passed inside the lambda
type CustomAuth = APIGatewayAuthorizerResultContext & contextAuth2


const handler: APIGatewayProxyHandlerV2WithLambdaAuthorizer<CustomAuth> = async (
  event
) => {

  const extractUserIdFromAuth = () => {
    // if lambda is run locally authorization lambda won't run the provide the trintId
    if (process.env.IS_OFFLINE) return 'offline-lambda-trint-id';

    // This is not automatically typescript checked. If I tried to access a property on lambda. that dose not exist we will get a type error as we should
    // example : `event.requestContext.authorizer.lambda.banana`. This also mean if we change our interface in authorizer, any lambda importing this interface will throw a type error to warn us we need to refactor the code 
    const userId  = event.requestContext.authorizer.lambda.userId;
    return userId;
  };

  const unmarshelledBody: requestBody = JSON.parse(event.body || '');

  const userId = extractUserIdFromAuth();
  const {
    file_no: fileNo,
  } = unmarshelledBody;  

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'lambda-version': `1.1` },
    body: JSON.stringify({
      userIdFromAuthorizerLambda: userId, 
      fileNo
    }),
  };
};

module.exports = { handler };
