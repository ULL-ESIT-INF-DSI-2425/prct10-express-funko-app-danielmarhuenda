import Funko from "./FunkoFilesystem/Funko.js";
//import Gestor from "./FunkoFilesystem/Gestor.js";
import { Tipos, Generos, Parametros, Precios } from "./FunkoFilesystem/Enumerados.js";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import chalk from "chalk";
const log = console.log;

import net from 'net';
const client = net.connect({port: 60300});



const argv = yargs(hideBin(process.argv))
  .option('user', { description: 'Usuario', type: 'string', demandOption: true })
  .parseSync();

const user = argv.user as string;

if (!user) {
  console.error("Error: El parámetro --user es obligatorio.");
  process.exit(1);
}

client.on('connect', () => {
  log(chalk.green('Conexión establecida.'));



yargs(hideBin(process.argv))
  .command(
    'add',
    'Añade un funko',
    (yargs) => yargs.options(Parametros),
    (args) => {
      const funko = new Funko(
        args.id as number,
        args.name as string,
        args.desc as string,
        args.type as Tipos,
        args.genre as Generos,
        args.franchise as string,
        args.number as number,
        args.exclusive as boolean,
        args.features as string,
        args.market as number
      );
      client.write(JSON.stringify({'user': user, 'type': 'add', 'funko': funko}));
    }
  )
  .command(
    'update',
    'Modifica un funko',
    (yargs) => yargs.options(Parametros),
    (args) => {
      const funko = new Funko(
        args.id as number,
        args.name as string,
        args.desc as string,
        args.type as Tipos,
        args.genre as Generos,
        args.franchise as string,
        args.number as number,
        args.exclusive as boolean,
        args.features as string,
        args.market as number
      );
      client.write(JSON.stringify({'user':user, 'type': 'update', 'funko': funko}));
    }
  )
  .command(
    'remove',
    'Eliminar un Funko',
    (yargs) => yargs.option('id', { type: 'number', demandOption: true }),
    (args) => {
      client.write(JSON.stringify({'user':user, 'type': 'remove', 'id': args.id}));
    }
  )
  .command(
    'read',
    'Leer un Funko',
    (yargs) => yargs.option('id', { type: 'number', demandOption: true }),
    (args) => {
      client.write(JSON.stringify({'user':user, 'type': 'read', 'id': args.id}));
    }
  )
  .command(
    'list',
    'Imprimir los Funkos de este usuario',
    {},
    () => {
      console.log('Funkos almacenados:');
      client.write(JSON.stringify({'user':user, 'type': 'list'}));
    }
)
.help()
.parseSync();
});

let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

client.on('end', () => {
  const message = JSON.parse(wholeData);
  log(chalk.green('Conexión cerrada.'));

  if(message.type === 'correcto'){
    log(chalk.green('Operación realizada correctamente'));

  }else if(message.type === 'error'){
    log(chalk.red('Error en la operación'));
    log(chalk.red(message.error));

  }else if(message.type === 'read'){
    const funko: Funko = message.funko;
    if(funko){
      Imprimir(funko);
    }else{
      log(chalk.red('No se ha encontrado el funko'));
    }

  }else if(message.type === 'list'){
    const funkos: Funko[] = message.funkos;
    log(chalk.green('Funkos encontrados:'));
    funkos.forEach((funko) => {
      Imprimir(funko);
    });

  }else{
    log(chalk.red('Error en la operación, no se pilló el tipo del mensaje'));
  }
});

/**
 * Función para imprimir por pantalla un funko.
 * Quería hacerlo función dentro de la clase funko
 * Pero me daba error funko.Imprimir() is not a function y no encontré solución
 * @param funko Funko a imprimir por pantalla
 */
function Imprimir(funko:Funko):void{
    log(chalk.green(`ID: ${funko.ID}`));
    log(chalk.green(`Nombre: ${funko.nombre}`));
    log(chalk.green(`Descripcion: ${funko.descripcion}`));
    log(chalk.green(`Tipo: ${funko.tipo}`));
    log(chalk.green(`Genero: ${funko.genero}`));
    log(chalk.green(`Franquicia: ${funko.franquicia}`));
    log(chalk.green(`Numero: ${funko.numero}`));
    log(chalk.green(`Exclusivo: ${funko.exclusivo}`));
    log(chalk.green(`Caracteristicas: ${funko.caracteristicas}`));
    if(funko.mercado >= Precios.NADA && funko.mercado < Precios.BAJO){
        log(chalk.red(`Precio: ${funko.mercado}`));
    }else if(funko.mercado >= Precios.BAJO && funko.mercado < Precios.MEDIO){
        log(chalk.yellow(`Precio: ${funko.mercado}`));
    }else if(funko.mercado >= Precios.MEDIO && funko.mercado < Precios.ALTO){
        log(chalk.gray(`Precio: ${funko.mercado}`));
    }else if(funko.mercado >= Precios.ALTO && funko.mercado < Precios.DEMASIADO){
        log(chalk.green(`Precio: ${funko.mercado}`));
    }else{
        log(chalk.greenBright(`Precio: ${funko.mercado}`));
    }
    log(chalk.green('----------------------------------'));
}