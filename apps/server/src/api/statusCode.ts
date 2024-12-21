// src/utils/statusCodes.ts

export enum StatusCode {
    OK = 200,                         // Request succeeded
    CREATED = 201,                    // Resource created successfully
    ACCEPTED = 202,                   // Request accepted but not yet processed
    NO_CONTENT = 204,                 // Successful request but no content to return
    BAD_REQUEST = 400,                // Invalid request due to malformed syntax or missing parameters
    UNAUTHORIZED = 401,               // Authentication required or failed
    FORBIDDEN = 403,                  // Server understood the request, but refuses to authorize
    NOT_FOUND = 404,                  // Resource not found
    METHOD_NOT_ALLOWED = 405,         // HTTP method is not allowed for the requested resource
    CONFLICT = 409,                   // Request conflicts with current state of the server
    GONE = 410,                       // Requested resource is no longer available
    INTERNAL_SERVER_ERROR = 500,      // Server encountered an error
    NOT_IMPLEMENTED = 501,            // Server does not support the functionality required to fulfill the request
    BAD_GATEWAY = 502,                // Server received an invalid response from the upstream server
    SERVICE_UNAVAILABLE = 503,        // Server is temporarily unable to handle the request due to maintenance or overload
    GATEWAY_TIMEOUT = 504,            // Server did not receive a timely response from an upstream server
    HTTP_VERSION_NOT_SUPPORTED = 505, // HTTP version not supported by the server
    NETWORK_AUTHENTICATION_REQUIRED = 511 // Client needs to authenticate to gain network access
  }
  