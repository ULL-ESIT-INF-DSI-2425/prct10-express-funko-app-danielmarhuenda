import {describe, expect, test} from "vitest";
import Gestor from "../../src/FunkoFilesystem/GestorPromesas";
import Funko from "../../src/FunkoFilesystem/Funko";
import { Tipos, Generos } from "../../src/FunkoFilesystem/Enumerados";
import fs from 'fs';

describe("Tests del Gestor de Funkos", () => {
    let funko1:Funko = new Funko(1, "Funko1", "Funko de prueba", Tipos.GOLD, Generos.ANIMACION, "Naruto", 1, false, "Ninguna", 10);
    let funko2:Funko = new Funko(2, "Funko2", "Funko de prueba", Tipos.POP, Generos.TV, "Naruto", 2, false, "Ninguna", 20);
    let funko3:Funko = new Funko(3, "Funko3", "Funko de prueba", Tipos.RIDES, Generos.DEPORTE, "Naruto", 3, false, "Ninguna", 30);
    let gestor:Gestor = new Gestor("test", () => {
    });

    test("lenght", () => {
        expect(gestor.length()).toBe(0);
    });

    test("Add item", () => {
        gestor.add(funko1);
        gestor.add(funko2);
        gestor.add(funko3);
        expect(gestor.length()).toBe(3);
    });

    test("get item normal", () => {
        gestor.get(1).then((funko) => {
            expect(funko).toStrictEqual(funko1);
        });
        gestor.get(2).then((funko) => {
            expect(funko).toStrictEqual(funko2);
        });
        gestor.get(3).then((funko) => {
            expect(funko).toStrictEqual(funko3);
        });
    });

    test("Delete item", () => {
        gestor.remove(1);
        gestor.remove(2);
        gestor.remove(3);
        expect(gestor.length()).toBe(0);
    });

    test("get item error", () => {
        gestor.get(4).catch((err) => {
            expect(err).toBeDefined();
            expect(err).toMatch("Funko con ID 4 no encontrado.");
        });
    });

    test("Errores por archivo no existente", () => {
        let gestor2:Gestor = new Gestor("nuevotest", () => {
        });
        fs.rmSync("BasedeDatosFunko/nuevotest/", { recursive: true });
        //fs.rmSync('BasedeDatosFunko\\nuevotest', { recursive: true });

        gestor2.add(funko1).catch((err) => {
            expect(err).toBeDefined();
            //expect(err).toMatch("Error al escribir en el archivo BasedeDatosFunko/nuevotest/1.json: ENOENT: no such file or directory, open 'BasedeDatosFunko/nuevotest/1.json'");
        });
        gestor2.remove(1).catch((err) => {
            expect(err).toBeDefined();
            //expect(err).toMatch("Error al eliminar el archivo BasedeDatosFunko/nuevotest/1.json: ENOENT: no such file or directory, unlink 'BasedeDatosFunko/nuevotest/1.json'");
        });
        gestor2.update(funko1).catch((err) => {
            expect(err).toBeDefined();
            expect(err).toMatch("Funko con ID 1 no encontrado.");
        });
    });

    test("Leer de carpeta ya existente", () => {
        let gestor2:Gestor = new Gestor("nombretest", () => {
            expect(gestor2.length()).toBe(1);
        });
    });

});