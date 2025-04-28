import {describe, expect, test} from "vitest";
import { readNote } from "../../src/modificacion/notes"
import { Note, ResponseType } from "../../src/modificacion/types";

describe("Funcionamiento correcto", () => {
    let bluenote:Note = {"title":"Blue note","body":"This is a blue note","color":"blue"};

    test("Lee correctamente la nota", () => {
        readNote("Blue note", "public/notes/notes.json").then((data) => {
            expect(data.notes).toStrictEqual([bluenote]);
        });
    });

    test("Se envia el booleano success correctamente", () => {
        readNote("Red note", "public/notes/notes.json").then((data) => {
            expect(data.success).toBe(true);
        });
    });

    test("Se envia como ResponseType", () => {
        let bluerespuesta:ResponseType = {"notes": [bluenote], "success": true, "type":"read"}
        readNote("Blue note", "public/notes/notes.json").then((data) => {
            expect(data).toStrictEqual(bluerespuesta);
        });
    });

    test("Se reciben varias notas", () => {
        let magentanote:Note = {"title":"Magenta note","body":"This is a magenta note","color":"magenta"}
        let magentanote2:Note = {"title":"Magenta note","body":"Otra magenta note","color":"magenta"}
        let magentanote3:Note = {"title":"Magenta note","body":"Tercera note","color":"red"}
        readNote("Magenta note", "public/notes/notes.json").then((data) => {
            expect(data.notes).toStrictEqual([magentanote, magentanote2, magentanote3]);
        });
    });

});

describe("Deteccion de errores", () => {

    test("Carpeta no existente", () => {
        readNote("Red note", "publi/notes/notes.json").catch((err) => {
            expect(err).toBeDefined();
            expect(err).toStrictEqual("Error reading notes file: ENOENT: no such file or directory, open 'publi/notes/notes.json'");
        });
    });

    test("Fichero no existente", () => {
        readNote("Red note", "public/notes/notes.jso").catch((err) => {
            expect(err).toBeDefined();
            expect(err).toStrictEqual("Error reading notes file: ENOENT: no such file or directory, open 'public/notes/notes.jso'");
        });
    });

    test("Nota no existente", () => {
        readNote("no note", "public/notes/notes.json").then((data) => {
            expect(data.success).toBe(false);
            expect(data.notes).toBe(undefined);
        });
    });

});