const sasCache = {};

exports.getNewSASForBlob = blobIdentity => {
  if (sasCache[blobIdentity] && stillValidIn5Mins(sasCache[blobIdentity])) {
    const newSAS = "aNewSAS";
  } else {
    return sasCache[blobIdentity];
  }
};
