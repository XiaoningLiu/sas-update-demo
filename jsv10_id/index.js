const Azure = require("@azure/storage-blob");

// Create a policy factory with create() method provided
// In TypeScript, following factory class needs to implement Azure.RequestPolicyFactory type
class RequestIDPolicyFactory {
  // Constructor to accept parameters
  constructor(prefix) {
    this.prefix = prefix;
  }

  // create() method needs to create a new RequestIDPolicy object
  create(nextPolicy, options) {
    return new RequestIDPolicy(nextPolicy, options, this.prefix);
  }
}

// Create a policy by extending from Azure.BaseRequestPolicy
class RequestIDPolicy extends Azure.BaseRequestPolicy {
  constructor(nextPolicy, options, prefix) {
    super(nextPolicy, options);
    this.prefix = prefix;
  }

  // Customize HTTP requests and responses by overriding sendRequest
  // Parameter request is Azure.WebResource type
  async sendRequest(request) {
    // Customize client request ID header
    request.headers.set(
      "x-ms-client-request-id",
      `${this.prefix}_SOME_PATTERN_${new Date().getTime()}`
    );

    // response is Azure.HttpOperationResponse type
    const response = await this._nextPolicy.sendRequest(request);

    // Modify response here if needed

    return response;
  }
}

// Main function
async function main() {
  // Create a default pipeline with Azure.StorageURL.newPipeline
  const pipeline = Azure.StorageURL.newPipeline(
    new Azure.AnonymousCredential()
  );

  // Inject customized factory into default pipeline
  pipeline.factories.unshift(new RequestIDPolicyFactory("Prefix"));

  // Following URL needs include a valid SAS token
  let serviceURL = new Azure.ServiceURL(
    "https://account.blob.core.windows.net?sas",
    pipeline
  );

  const response = await serviceURL.listContainersSegment(
    Azure.Aborter.none,
    undefined
  );

  // Check customized client request ID
  console.log(response._response.request.headers.get("x-ms-client-request-id"));
}

main()
  .then(() => {
    "Successfully executed sample";
  })
  .catch(console.error);
