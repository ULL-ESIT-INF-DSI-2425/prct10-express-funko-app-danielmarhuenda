import fs from "fs/promises";
import { Note, ResponseType } from "./types.js";

/** 
export const readNotecallback = (
  title: string,
  cb: (err: string | undefined, res: ResponseType | undefined) => void,
) => {
  loadNotescallback("public/notes/notes.json", (err, data) => {
    if (err) {
      cb(err, undefined);
    } else if (data) {
      const notes: Note[] = JSON.parse(data);
      const foundNote = notes.find((note) => note.title === title);
      const response: ResponseType = {
        type: "read",
        success: foundNote ? true : false,
        notes: foundNote ? [foundNote] : undefined,
      };
      cb(undefined, response);
    }
  });
};
*/
export const readNote = (title:string, ruta:string) => {
  return new Promise<ResponseType>((resolve, reject) => {
    loadNotes(ruta).then((data) => {
      const notes: Note[] = JSON.parse(data);
      const foundNote = notes.find((note) => note.title === title);
      const response: ResponseType = {
        type: "read",
        success: foundNote ? true : false,
        notes: foundNote ? [foundNote] : undefined,
      };
      resolve(response);
      
    }).catch((err) => {
      reject(err);
    });
  });
};

/** 
const loadNotescallback = (
  ruta:string,
  cb: (err: string | undefined, data: string | undefined) => void,
) => {
    
  fs.readFile(ruta, (err, data) => {
    if (err) {
      cb(`Error reading notes file: ${err.message}`, undefined);
    } else {
      cb(undefined, data.toString());
    }
  });
  
};
*/

const loadNotes = (ruta:string) => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(ruta).then((data) => {
      resolve(data.toString());

    }).catch((err) => {
      reject(`Error reading notes file: ${err.message}`);
    });
  });
};




