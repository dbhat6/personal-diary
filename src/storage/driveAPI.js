const { argv } = require("process");
const fs = require("fs");
const keys = require("../../config/keys.json");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.JWT(keys.client_email, undefined, keys.private_key, SCOPES);

auth.authorize(function (err) {
  if (err) {
    console.log(new Error("Error:" + err.message));
    return;
  } else {
    console.log("Connection established with Google API");
  }
});
const drive = google.drive({ version: "v3", auth: auth });

const doKeysFileExists = () => {
  let isFileExists = keys ? true : false;
  console.log(isFileExists);
};

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listFiles(response) {
  return drive.files.list(
    {
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    },
    async (err, res) => {
      if (err) {
        console.log("The API returned an error: " + err);
        response.status(500).send(err);
      }
      const files = res.data.files;
      if (files.length) {
        console.log("Files:");
        let fileList = files.map(async (file) => {
          if (file.name === "Notes") return;
          await downloadFiles(file.id, file.name);
          console.log(`${file.name} (${file.id})`);
          return {
            name: file.name,
            id: file.id,
          };
        });
        let check = await Promise.all(fileList);
        check = check.filter((file) => file);
        response.status(200).json({ files: check });
      } else {
        console.log("No files found.");
        response.status(400).json({ files: [] });
      }
    }
  );
}

/**
 *
 * @param {string} fileId
 * @param {string} fileName
 */
async function downloadFiles(fileId, fileName) {
  let data = await drive.files.get({
    alt: "media",
    fileId: fileId,
  });
  fs.writeFileSync(`./notes/${fileName}`, data.data);
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function updateFiles(fileId, fileName) {
  // const fileContent = fs.readFileSync(`./notes/${fileName}`);
  console.log(fileName);
  drive.files.update({
    fileId: fileId,
    addParents: "1VzmLyZTfqRmurLFWA8ixVgoEFivHZ0kg",
    alt: "media",
  });
}

/**
 * Function used to run this file through CLI
 *
 * Run 'npm run s3:ops help' to get additional details
 */
(async () => {
  try {
    switch (argv[2]) {
      case "help": {
        console.log("Supported operations are 'publish' and 'fetch'\n");

        console.log(
          "Syntax for publish: npm run s3:ops publish <KEY_PATH_EXCLUDING_FILE_NAME_AND_ENDING_FORWARDSLASH> <PATH_TO_FILE>"
        );
        console.log("Example command for publish: npm run s3:ops publish testing ./sample-program-definition.json");
        console.log(
          "This pushes sample-program-definition.json to the path testing/sample-program-definition.json within the configured S3 bucket\n"
        );

        console.log("Syntax for fetch: npm run s3:ops fetch <KEY_PATH_IN_S3_INCLUDING_FILE_NAME> <versionId>:OPTIONAL");
        console.log("Example command for fetch: npm run s3:ops fetch testing/sample-program-definition.json");
        console.log(
          "This pulls the latest sample-program-definition.json from the path testing/sample-program-definition.json within the configured S3 bucket and puts it in the directory from which the command is run"
        );
        break;
      }
      case "publish": {
        doKeysFileExists();
        // let fileContent = require("fs").readFileSync(argv[4], { encoding: "utf8" });
        // let fileName = argv[4].split("/").pop();

        // await uploadObject(`${argv[3]}/${fileName}`, fileContent);
        break;
      }
      case "fetch": {
        doKeysFileExists();
        await listFiles();
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  listFiles,
  updateFiles,
};
