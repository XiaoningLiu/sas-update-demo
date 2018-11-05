const Azure = require("@azure/storage-blob");

class BrowserPolicyFactory {
  constructor(nextPolicy, options) {
    this.counter = 0;
  }
  create(nextPolicy, options) {
    return new SasUpdatePolicy(nextPolicy, options, this.counter++);
  }
}

class SasUpdatePolicy extends Azure.BaseRequestPolicy {
  constructor(nextPolicy, options, counter) {
    super(nextPolicy, options);
    this.counter = counter;
  }

  async sendRequest(request) {
    console.log(
      `\n[SAS Update Policy #${this.counter}]: Current URL is: ${request.url}`
    );

    // Check SAS is expiry or not, if not, acquire a new SAS token and update it to blobService
    // You may want to cache a valid SAS for a blob, and acquire a new SAS from cache first,
    // because request.url = "" is a one time SAS updating operation
    //
    // In JSv10 SDK, the proper way to update a SAS is to create a new URL object with a new SAS URL
    // We cannot update StorageURL internal url property inside a policy, because we make a URL object to be immutable
    //
    // Create a new StorageURL object with a updated URL.
    // In this sample, update SAS after 1st call and before 2nd call
    if (this.counter > 0) {
      request.url = "https://jsv10.blob.core.windows.net?updatedSAS";
    }

    console.log(
      `[SAS Update Filter #${this.counter}]: Updated URL is: ${request.url}`
    );

    return this._nextPolicy.sendRequest(request);
  }
}

exports.BrowserPolicyFactory = BrowserPolicyFactory;
exports.SasUpdatePolicy = SasUpdatePolicy;
