const { argv } = require("process");
const fs = require("fs");
const keys = require("../../config/keys.json");
const fileList = require("../../config/fileList.json");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const parentFolderId = process.env.PARENT_FOLDER || "1VzmLyZTfqRmurLFWA8ixVgoEFivHZ0kg";
let drive;

const authorize = async () => {
  if (drive) return drive;
  const auth = new google.auth.JWT(keys.client_email, undefined, keys.private_key, SCOPES);

  auth.authorize(function (err) {
    if (err) {
      console.log(new Error("Error:" + err.message));
      return;
    } else {
      console.log("Connection established with Google API");
    }
  });
  drive = google.drive({ version: "v3", auth: auth });
};

const doKeysFileExists = () => {
  let isFileExists = keys ? true : false;
  console.log(isFileExists);
};

/**
 * Lists the names and IDs of up to 10 files.
 * @param {import("next").NextApiResponse} response An authorized OAuth2 client.
 */
async function listFiles(response) {
  await authorize();
  return drive.files.list(
    {
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    },
    async (err, res) => {
      if (err) {
        console.log("The API returned an error: " + err);
        if (response) response.status(500).send(err);
      }
      const files = res.data.files;
      if (files.length) {
        console.log("Files:");
        let fileMap = {};
        let fileList = files.map(async (file) => {
          if (file.name === "Notes") return;
          await downloadFile(file.id, file.name);
          console.log(`${file.name} (${file.id})`);
          fileMap[file.name] = file.id;
          return {
            name: file.name,
            id: file.id,
          };
        });
        let check = await Promise.all(fileList);
        fs.writeFileSync("./config/fileList.json", JSON.stringify(fileMap, null, 2));
        check = check.filter((file) => file);
        if (response) response.status(200).json({ files: check });
      } else {
        console.log("No files found.");
        if (response) response.status(400).json({ files: [] });
      }
    }
  );
}

/**
 * Downloads the file from Google Drive based on the File ID provided
 * @param {string} fileId
 * @param {string} fileName
 */
async function downloadFile(fileId, fileName) {
  await authorize();
  let data = await drive.files.get({
    alt: "media",
    fileId: fileId,
  });
  fs.writeFileSync(`./notes/${fileName}`, data.data);
}

/**
 * Deletes the file from Google Drive based on the File ID provided
 * @param {string} fileId
 */
async function deleteFiles(fileId) {
  await authorize();
  let data = await drive.files.delete({
    fileId: fileId,
  });
  if (data.status && data.status === "204") console.log("File deleted");
}

/**
 * Uploads the files from the local `notes` folder into Google Drive's configured parent folder
 */
async function uploadFiles() {
  let fileNames = fs.readdirSync("./notes");
  await authorize();

  fileNames.map(async (files) => {
    if (!fileList[files]) {
      const fileMetadata = {
        name: files,
        parents: parentFolderId,
      };
      const media = {
        mimeType: "text/plain",
        body: fs.createReadStream(`files/${fileMetadata.name}`),
      };
      await drive.files.create({
        resource: fileMetadata,
        media: media,
      });
    } else {
      await drive.files.update({
        fileId: fileList[files],
        addParents: parentFolderId,
        media: {
          mimeType: "text/plain",
          body: fs.createReadStream(`./notes/${files}`),
        },
      });
    }
  });
}

/**
 * Function used to run this file through CLI
 *
 * Run 'npm run drive:ops help' to get additional details
 */
(async () => {
  try {
    switch (argv[2]) {
      case "help": {
        console.log("Supported operations are 'publish' and 'fetch'\n");

        console.log("Syntax for publish: npm run drive:ops publish");
        console.log("Example command for publish: npm run drive:ops publish");
        console.log("This pushes all the files from the local `notes` folder to the configured Google Drive folder\n");

        console.log("Syntax for fetch: npm run drive:ops fetch");
        console.log("Example command for fetch: npm run drive:ops fetch");
        console.log("This pulls the files from the configured folder from Google Drive to a local `notes` folder\n");

        console.log("Syntax for fetch: npm run drive:ops delete <FILE_ID>");
        console.log("Example command for fetch: npm run drive:ops delete 1425rd_gwJDKA62JvECqv671tBAELX_ge");
        console.log("This deletes the file from the configured folder from Google Drive to a local `notes` folder\n");
        break;
      }
      case "publish": {
        doKeysFileExists();
        await uploadFiles();
        break;
      }
      case "fetch": {
        doKeysFileExists();
        await listFiles();
        break;
      }
      case "delete": {
        doKeysFileExists();
        await deleteFiles(argv[3]);
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  listFiles,
  uploadFiles,
};
