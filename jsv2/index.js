const Azure = require("azure-storage");
const newSASUpdateFilter = require("./sas.update.filter");

const sasCredentialContainer = { credential: null };
const blobService = Azure.createBlobServiceWithSas(
  "https://jsv10.blob.core.windows.net",
  "?sas"
).withFilter(newSASUpdateFilter(sasCredentialContainer));
sasCredentialContainer.credential = blobService.storageCredentials;

// A demo to show how to update SAS after 1st call and before 2nd call
blobService.listContainersSegmented(undefined, (err, res, resp) => {
  if (!err) {
    console.log("List containers successfully #0");
    blobService.listContainersSegmented(undefined, (err, res, resp) => {
      if (!err) {
        console.log("List containers successfully #1");
      } else {
        console.error("List containers failed #1");
      }
    });
  } else {
    console.error("List containers failed #0");
  }
});
