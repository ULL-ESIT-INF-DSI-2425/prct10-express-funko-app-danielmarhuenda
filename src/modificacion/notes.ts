import fs from "fs/promises";
import { Note, ResponseType } from "./types.js";

export const readNote = (title:string, ruta:string) => {
  return new Promise<ResponseType>((resolve, reject) => {
    loadNotes(ruta).then((data) => {
      const notes: Note[] = JSON.parse(data);
      //const foundNote = notes.find((note) => note.title === title);
      const foundNote = notes.filter((note) => note.title === title);

      const response: ResponseType = {
        type: "read",
        success: foundNote.length>0 ? true : false,
        notes: foundNote.length>0 ? foundNote : undefined,
      };
      resolve(response);

    }).catch((err) => {
      reject(err);
    });
  });
};


const loadNotes = (ruta:string) => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(ruta).then((data) => {
      resolve(data.toString());

    }).catch((err) => {
      reject(`Error reading notes file: ${err.message}`);
    });
  });
};




