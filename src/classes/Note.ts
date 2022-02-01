import { getUnixTime } from "date-fns";

interface IMeta {
  date: Date;
}

interface IParams {
  heading: string;
  tags: string[];
  body: string;
  fileFormatString: string;
}

export class Note {
  heading: string;
  tags: string[];
  body: string;
  fileFormatString: string;
  meta: IMeta;

  constructor(params?: IParams, metaParam?: IMeta) {
    this.heading = params?.heading ?? "";
    this.tags = params?.tags ?? [];
    this.body = params?.body ?? "";
    this.fileFormatString = params?.fileFormatString ?? "";
    this.meta = <IMeta>{
      date: metaParam?.date || new Date(),
    };
  }

  toFileFormat() {
    const str = [];
    str.push(this.heading);
    str.push("@@@@");
    str.push(this.body);
    str.push("@@@@");
    str.push("####");
    str.push(this.tags.join(" "));
    str.push("####");
    str.push(getUnixTime(this.meta.date));
    str.push("==============================");
    return str.join("\n").concat("\n");
  }

  toObj() {
    const notes = this.fileFormatString.split("==============================");
    const allNotes = notes.map((note) => {
      if (!note.trim()) return;

      const body = note.split("@@@@");
      body[0] = body[0].trim();
      body[1] = body[1].trim();
      body[2] = body[2].trim();

      const tagObj = body[2].split("####");
      tagObj[1] = tagObj[1].trim();
      tagObj[2] = tagObj[2].trim();

      return new Note(
        {
          heading: body[0],
          body: body[1],
          tags: tagObj[1].split(" "),
          fileFormatString: "",
        },
        {
          date: new Date(parseInt(tagObj[2]) * 1000),
        }
      );
    });
    return allNotes;
  }
}
