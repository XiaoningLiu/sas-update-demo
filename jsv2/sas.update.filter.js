// See http://azure.github.io/azure-storage-node/StorageServiceClient.html#withFilter

function newSASUpdateFilter(sasCredentialContainer) {
  let counter = 0;

  return {
    handle: (requestOptions, next) => {
      console.log(`\n[SAS Update Filter #${counter}]: Current SAS is:`);
      console.log(sasCredentialContainer.credential.sasToken);

      // Check SAS is expiry or not, if not, acquire a new SAS token and update it to blobService
      // In this sample, update SAS after 1st call and before 2nd call
      if (counter > 0) {
        sasCredentialContainer.credential.sasToken = "?updatedSAS";
      }

      console.log(`[SAS Update Filter #${counter++}]: Updated SAS is:`);
      console.log(sasCredentialContainer.credential.sasToken);

      // Call next filter
      if (next) {
        next(requestOptions, function(
          returnObject,
          finalCallback,
          nextPostCallback
        ) {
          if (nextPostCallback) {
            nextPostCallback(returnObject);
          } else if (finalCallback) {
            finalCallback(returnObject);
          }
        });
      }
    }
  };
}

module.exports = newSASUpdateFilter;
