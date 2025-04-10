import net from 'net';

//let conexiones:net.Socket[] = [];
let conexiones = new Map<number, net.Socket>;

function GetID():number{
    let id:number = 0;

    while(conexiones.has(id)){
        id++;
    }

    return id;
}

net.createServer((connection) => {
    console.log('A client has connected.');
    let id:number = GetID();

    conexiones.set(id, connection);
    connection.write(JSON.stringify({'type': 'id', 'texto': id}))
  
    let wholeData = '';
    connection.on('data', (dataChunk) => {
        wholeData += dataChunk;

        try{
            const message = JSON.parse(wholeData);
            console.log('Mensaje de', id, ':', message);

            conexiones.forEach(conexion => {
                if(conexion !== connection)
                    conexion.write(JSON.stringify({'type': 'mensaje', 'id':id, 'texto': message.texto}));
            });

            wholeData = '';

        } catch(error){
        }
    });

    connection.on('end', () => {
        console.log('Client disconnected.');
    });

}).listen(60300, () => {
    console.log('Waiting for clients to connect.');
});