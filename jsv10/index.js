const Azure = require("@azure/storage-blob");

const { BrowserPolicyFactory } = require("./sas.update.policy");

async function main() {
  const pipeline = Azure.StorageURL.newPipeline(
    new Azure.AnonymousCredential()
  );

  pipeline.factories.unshift(new BrowserPolicyFactory());

  let serviceURL = new Azure.ServiceURL(
    "https://jsv10.blob.core.windows.net?sas",
    pipeline
  );

  await serviceURL.listContainersSegment(Azure.Aborter.none, undefined);
  console.log("List containers successfully #0");

  await serviceURL.listContainersSegment(Azure.Aborter.none, undefined);
  console.log("List containers successfully #1");

  // Create a new ServiceURL with updated URL when uploading or part of operation is finished
  serviceURL = new Azure.ServiceURL(
    "https://jsv10.blob.core.windows.net?updatedSAS",
    pipeline
  );
}

main()
  .then(() => {
    "Successfully executed sample";
  })
  .catch(console.error);
