'use strict';
module.exports = (filename, parentFolderID, fileData) => {
  return {
    attributes: JSON.stringify({
      name: filename,
      parent: { id: parentFolderID }
    }),
    content: { value: fileData, options: { filename: 'unused' } }
  };
}