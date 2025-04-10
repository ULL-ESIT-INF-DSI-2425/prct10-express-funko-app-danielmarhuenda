import Gestor from "./FunkoFilesystem/Gestor.js";
import Funko from "./FunkoFilesystem/Funko.js";

import net from 'net';

net.createServer((connection) => {
    console.log('A client has connected.');
  
    let wholeData = '';
    connection.on('data', (dataChunk) => {
        wholeData += dataChunk;
    
        try{

        const message = JSON.parse(wholeData);
        console.log('Received message from client:', message);
        if(message.user){
            const user = message.user;

            let gestor: Gestor = new Gestor(user, () => {
                console.log('Inventario cargado y listo para usar de:', user);
                if(message.type === 'add'){
                    const funko = message.funko;
                    gestor.add(funko, (err) => {
                        if (err) {
                            console.log('Error añadiendo funko:', err.message);
                            connection.write(JSON.stringify({'type': 'error', 'error': err.message}));
                        }else{
                            console.log('Funko añadido');
                            connection.write(JSON.stringify({'type': 'correcto'}));
                        }  
                        connection.end();      
                    });

                } else if(message.type === 'update'){
                    const funko = message.funko;
                    gestor.update(funko, (err) => {
                        if (err) {
                            console.log('Error actualizando funko:', err.message);
                            connection.write(JSON.stringify({'type': 'error', 'error': err.message}));
                        }else{
                            console.log('Funko actualizado');
                            connection.write(JSON.stringify({'type': 'correcto'}));
                        }
                        connection.end();
                    });

                }else if(message.type === 'remove'){
                    const id = message.id;
                    gestor.remove(id, (err) => {
                        if (err) {
                            console.log('Error eliminando funko:', err.message);
                            connection.write(JSON.stringify({'type': 'error', 'error': err.message}));
                        } else{
                            console.log('Funko eliminado');
                            connection.write(JSON.stringify({'type': 'correcto'}));
                        }
                        connection.end();
                    });

                }else if(message.type === 'read'){
                    const id = message.id;
                    gestor.read(id, (err, funko?:Funko) => {
                        if (err) {
                            console.log('Error leyendo funko:', err.message);
                            connection.write(JSON.stringify({'type': 'error', 'error': err.message}));
                        } else {
                            console.log('Funko leído:', funko);
                            connection.write(JSON.stringify({'type': 'read', 'funko': funko}));
                        }
                        connection.end();
                    });

                }else if(message.type === 'list'){
                    let listafunkos:Funko[] = [];
                    gestor.almacenMap.forEach(element => {
                        listafunkos.push(element);
                    });
                    console.log('Lista de Funkos:', listafunkos);
                    connection.write(JSON.stringify({'type': 'list', 'funkos': listafunkos}));
                    connection.end();

                }else{
                    console.log('Unknown operation type:', message.type);
                    connection.write(JSON.stringify({'type': 'error', 'error': 'Unknown operation type'}));
                    connection.end();
                }
            });
        }else{
            console.log('No user specified in the message.');
            connection.write(JSON.stringify({'type': 'error', 'error': 'No user specified in the message.'}));
            connection.end();
        }
    } catch (error) {
    }
    });

    connection.on('end', () => {
        console.log('Client disconnected.');
    });

}).listen(60300, () => {
    console.log('Waiting for clients to connect.');
});