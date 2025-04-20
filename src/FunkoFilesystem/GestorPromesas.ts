import Funko from "./Funko.js";

import fs from 'fs';
import path from 'path';

/**
 * Clase que gestiona la base de datos de Funkos.
 * Almaceno los datos de forma persistente en archivos JSON.
 * Cada usuario tiene su propia carpeta en la que se guardan los archivos.
 * Almaceno los datos de forma temporal en un Map.
 */
export default class Gestor {
    private databaseDir: string;
    private _almacenMap = new Map<number, Funko>();

    /**
     * Constructor de la clase Gestor.
     * @param usuario  Nombre del usuario.
     * @param callback  Función de callback para que el resto del programa espere a que se carguen los datos.
     */
    constructor(usuario: string, callback: () => void){
        this.databaseDir = path.join("BasedeDatosFunko", usuario);
        if (!fs.existsSync(this.databaseDir)) {
            fs.mkdirSync(this.databaseDir, { recursive: true });
        }
        this.loadInventario(() => {
            callback();
        });
    }

    /**
     * Getter de almacenMap.
     */
    get almacenMap(): Map<number, Funko> {
        return this._almacenMap;
    }

    /**
    * Carga todos los archivos JSON de la carpeta al iniciar.
    * @param callback  Función de callback para que el resto del programa espere a que se carguen los datos.
    */
    private loadInventario(callback: () => void): void {
        fs.readdir(this.databaseDir, (err, files) => {
            if (err) {
                console.error('Error al leer la carpeta:', err);
                callback();
                return;
            }
    
            if (files.length === 0) {
                callback();
                return;
            }
    
            let counter = 0;
    
            files.forEach(file => {
                const filePath = path.join(this.databaseDir, file);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error al leer el archivo ${file}:`, err);
                    } else {
                        try {
                            const funko: Funko = JSON.parse(data);
                            this._almacenMap.set(funko.ID, funko);
                        } catch (parseError) {
                            console.error(`Error al parsear el archivo ${file}:`, parseError);
                        }
                    }
                    counter++;
                    if (counter === files.length) {
                        callback();
                    }
                });
            });
        });
    }
    
    


    /**
     * Guarda un objeto Funko como un archivo JSON en la carpeta.
     * @param funko  Objeto Funko a guardar.
     */
    private storeEntidad(funko: Funko, callback: (err?: Error) => void): void {
        const filePath = path.join(this.databaseDir, `${funko.ID}.json`);
        fs.writeFile(filePath, JSON.stringify(funko, null, 2), 'utf8', (err) => {
          if (err) {
            callback(new Error(`Error al escribir en el archivo ${filePath}: ${err.message}`));
          } else {
            callback();
          }
        });
    }

    /**
     * Añadir un nuevo Funko a la base de datos.
     * @param funko  Objeto Funko a añadir.
     */
    add = (funko:Funko) => {
        return new Promise<string>((resolve, reject) => {
        if (this._almacenMap.has(funko.ID)) {
            reject(`Error, ID ${funko.ID} ya está en uso`)
        } else {
            this._almacenMap.set(funko.ID, funko);
            this.storeEntidad(funko, (err) => {
              if (err) {
                reject(err)
              } else {
                resolve(`Funko ${funko.ID} añadido correctamente`);
              }
            });
        }
        });
    };

    /**
     * Eliminar un Funko de la base de datos.
     * @param ID  ID del Funko a eliminar.
     */
    remove = (ID: number) => {
        return new Promise<string>((resolve, reject) => {
            if (!this._almacenMap.has(ID)) {
                reject(`Funko con ID ${ID} no encontrado.`);
            } else {
                this._almacenMap.delete(ID);
                const filePath = path.join(this.databaseDir, `${ID}.json`);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        reject(`Error al eliminar el archivo ${filePath}: ${err.message}`);
                    } else {
                        resolve(`Funko ${ID} eliminado correctamente`);
                    }
                });
            }
        });
    };

    /**
     * Obtener un Funko de la base de datos.
     * @param ID  ID del Funko a obtener.
     */
    get = (ID: number) => {
        return new Promise<Funko>((resolve, reject) => {
            const funko = this._almacenMap.get(ID);
            if (funko) {
                resolve(funko);
            } else {
                reject(`Funko con ID ${ID} no encontrado.`);
            }
        });
    };

    /**
     * Actualizar un Funko de la base de datos.
     * @param funko  Objeto Funko a actualizar.
     */
    update = (funko: Funko) => {
        return new Promise<string>((resolve, reject) => {
            if (!this.almacenMap.has(funko.ID)) {
                reject(`Funko con ID ${funko.ID} no encontrado.`);
            } else {
                this._almacenMap.set(funko.ID, funko);
                this.storeEntidad(funko, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Funko ${funko.ID} actualizado correctamente`);
                    }
                });
            }
        });
    };

    /**
     * Leer un Funko de la base de datos.
     * Al final no usé esta función debido a que había que usar chalk en mitad de la función y no podía ponerlo todo en un solo string.
     * Dejo la función por si acaso.
     * @param ID  ID del Funko a leer
     */
    read = (ID: number) => {
        return new Promise<Funko>((resolve, reject) => {
            this.get(ID).then((funko) => {
                if (funko) {
                    resolve(funko);
                } else {
                    reject(`Funko con ID ${ID} no encontrado.`);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    };

    public readtodo():Funko[] {
        let funkos: Funko[] = [];
        this._almacenMap.forEach((funko) => {
            funkos.push(funko);
        });
        return funkos;
    }

    /**
     * Imprimir los IDs y nombres de los Funkos almacenados para ver si lee bien los json.
     */
    public ImprimirTest(): void {
        this._almacenMap.forEach((funko) => {
            console.log(funko.ID, funko.nombre);
        });
    }

    /**
     * Getter de la longitud del Map para ver rapidamente en los test si se añadieron funkos.
     */
    length(): number {
        return this._almacenMap.size;
    }
}
