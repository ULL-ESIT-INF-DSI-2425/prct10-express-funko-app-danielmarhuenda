import type { Options } from 'yargs';

//node dist/funko-app.js add --user servertest --id 1 --name nose --desc descrip --type Pop! --genre Animación --franchise franquisia --number 333 --exclusive false --features ninguna --market 999
/**
 * Tipos de Funko
 */
export enum Tipos{POP="Pop!", RIDES="Pop! Rides", SODA="Vynil Soda", GOLD="Vynil Gold"}

/**
 * Generos de donde viene el personaje del Funko
 */
export enum Generos{ANIMACION="Animación", TV="Películas y TV", JUEGO="Videojuegos", DEPORTE="Deportes", MUSICA="Música", ANIME="Ánime"}

/**
 * Separador de precios de los Funkos para poner diferentes colores al imprimir.
 */
export enum Precios{NADA = 0, BAJO=10, MEDIO=20, ALTO=30, DEMASIADO=40}

/**
 * Valores que tiene un Funko
 */
export interface CommonOptions {
    user: string;
    id: number;
    name: string;
    desc: string;
    type: string;
    genre: string;
    franchise: string;
    number: number;
    exclusive: boolean;
    features: string;
    market: number;
}

/**
 * Parametros que usa el yargs, lo pongo aquí para no repetirlo en cada comando.
 */
export const Parametros: { [K in keyof CommonOptions]: Options } = {
    user: { description: 'Usuario', type: 'string', demandOption: true },
    id: { description: 'Funko ID', type: 'number', demandOption: true },
    name: { description: 'Funko nombre', type: 'string', demandOption: true },
    desc: { description: 'Funko descripcion', type: 'string', demandOption: true },
    type: { description: 'Funko tipo', type: 'string', demandOption: true },
    genre: { description: 'Funko genero', type: 'string', demandOption: true },
    franchise: { description: 'Funko fraquicia', type: 'string', demandOption: true },
    number: { description: 'Funko numero', type: 'number', demandOption: true },
    exclusive: { description: 'Es exclusivo?', type: 'boolean', demandOption: true },
    features: { description: 'Funko caracteristicas', type: 'string', demandOption: true },
    market: { description: 'Market precio', type: 'number', demandOption: true },
  };
  