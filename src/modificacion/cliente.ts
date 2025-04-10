import net from 'net';
const client = net.connect({port: 60300});

import * as readline from 'readline';

function EnviarMensaje(client:net.Socket){
    const rl = readline.createInterface({
        input: process.stdin
    });

    rl.question('Mensaje: ', (answer) => {
        client.write(JSON.stringify({'type': 'mensaje', 'texto': answer}));
        EnviarMensaje(client);
    });
}

client.on('connect', () => {
    console.log('Conexión establecida.');

    let wholeData = '';
    client.on('data', (dataChunk) => {
        wholeData += dataChunk;

        try{
            const message = JSON.parse(wholeData);
            if(message.type === 'mensaje'){
                console.log('Mensaje de', message.id, ':', message.texto);

            } else if(message.type === 'id'){
                console.log('Tu id es:', message.texto)
            }
            

            wholeData = '';
        } catch(error){
        }
    });

    EnviarMensaje(client);

    client.on('end', () => {
        console.log('Servidor desconectado.');
    });
});