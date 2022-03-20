import { getUnixTime } from "date-fns";
import fs from "fs";
import path from "path";
import { Note } from "../classes/Note";

interface reqBody {
  heading: string;
  tags: string[];
  body: string;
}

const getPost = (noteId: string | string[]) => {
  const data = fs.readFileSync(`./notes/${noteId}`, "utf8");
  const notes = new Note({
    fileFormatString: data,
    body: "",
    heading: "",
    tags: [],
  });
  return notes.toObj();
};

const getDetails = () => {
  const files = fs.readdirSync("./notes");
  return files.map((file) => {
    const fileStat = fs.lstatSync(path.join("./notes", file));
    return { file, createdAt: fileStat.mtime, size: fileStat.size };
  });
};

const createPost = (body: reqBody) => {
  const files = fs
    .readdirSync("./notes")
    .filter((file) => fs.lstatSync(path.join("./notes", file)).isFile())
    .map((file) => {
      const fileStat = fs.lstatSync(path.join("./notes", file));
      return { file, mtime: fileStat.mtime, size: fileStat.size };
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  const file = files.length ? files[0] : undefined;

  let filePath;
  if (!file || file.size > 400) {
    filePath = `./notes/${getUnixTime(new Date())}.txt`;
  } else {
    filePath = `./notes/${file?.file}`;
  }

  fs.appendFileSync(
    filePath,
    new Note({
      heading: body.heading,
      tags: body.tags,
      body: body.body,
      fileFormatString: "",
    }).toFileFormat()
  );
};

export { getPost, createPost, getDetails };
