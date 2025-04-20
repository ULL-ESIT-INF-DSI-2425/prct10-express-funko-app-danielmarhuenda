import Gestor from "./FunkoFilesystem/GestorPromesas.js";
import Funko from "./FunkoFilesystem/Funko.js";

import express from 'express';

const app = express();

app.get('/funkos', (req, res) => {
    const user = req.query.user;
    if (!user) {
        res.send({
            error: "El usuario es obligatorio",
        });
    }else if(typeof user !== 'string'){
        res.send({
            error: "El usuario debe ser un string",
        });
    }else {
        let gestor: Gestor = new Gestor(user, () => {
            console.log('Inventario cargado y listo para usar de:', user);
            if(!req.query.id){
                let funkoList:Funko[] = gestor.readtodo();
                res.send({
                    funkoList: funkoList,
                });

            }else if(typeof req.query.id !== 'number' && typeof req.query.id !== 'string'){
                res.send({
                    error: "El id debe ser un numero o un string",
                });

            }else{
                let id:number = 0;
                if(typeof req.query.id === 'string') id = parseInt(req.query.id);
                else id = req.query.id;

                gestor.get(id).then((funko) => {
                    res.send({
                        funko: funko,
                    });
                }).catch((err) => {
                    res.send({
                        error: err,
                    });
                });
            }
        });
    } 
    
});

app.listen(3000, () => {
    console.log('Server esperando en port 3000');
});