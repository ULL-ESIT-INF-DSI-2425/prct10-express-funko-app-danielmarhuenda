import express from "express";
import { readNote } from "./notes.js";

const app = express();

app.get("/notes", (req, res) => {
  if (!req.query.title) {
    res.send({
      error: "A title has to be provided",
    });

  }else if (!req.query.ruta) {
    res.send({
      error: "A ruta has to be provided",
    });

  } else {
    /**
    readNote(req.query.title as string, (err, data) => {
      if (err) {
        res.send({
          error: err,
        });
      } else if (!data!.success) {
        res.send({
          error: `No note was found`,
        });
      } else {
        res.send({
          notes: data!.notes,
        });
      }
    });
    */
    readNote(req.query.title as string, req.query.ruta as string).then((data) => {
      if (!data!.success) {
        console.log("Se va a enviar un error");
        res.send({
          error: `No note was found`,
        });

      } else {
        console.log("Se va a enviar una nota", data!.notes);
        res.send({
          notes: data!.notes,
        });
      }

    }).catch((err) => {
      console.log("Se va a enviar un error");
      res.send({
        error: err,
      });
    })
  }
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
