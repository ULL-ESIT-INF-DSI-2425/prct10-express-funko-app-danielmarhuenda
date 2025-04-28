import express from 'express';
import './db/mongoose.js';
import { Funko } from './models/funko.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/funkos', (req, res) => {
  const funko = new Funko(req.body);

  funko.save().then((funko) => {
    res.status(201).send(funko);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

app.get('/funkos', (req, res) => {
  const filter = req.query.ID?{ID: req.query.ID.toString()}:{};

  Funko.find(filter).then((funkos) => {
    if (funkos.length !== 0) {
      res.send(funkos);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});


app.all('/{*splat}', (_, res) => {
  res.status(501).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
