import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as chalk from 'chalk';
import {Note} from './note';
// import { NoteSchema } from './noteSchema';
// /**
//  * Clase MyError para gestionar los errores
//  */
// export class MyError extends Error {}

/**
 * Clase Management, encargada de gestionar los comandos introducidos
 */
export class Management {
  constructor() {}

  /**
   * Método addNote, encargado de añadir notas a la base de datos
   * @param note Se le pasa la nota a añadir
   * @param user Se pasa el usuario al que pertenece la nota
   */
  addNote(note: Note, user: string): string {
    const dir: string = `./Notes/${user}/${note.title}.json`;
    if (!fs.existsSync('./Notes')) {
      fs.mkdirSync('./Notes');
    }
    if (!fs.existsSync(`./Notes/${user}`)) {
      fs.mkdirSync(`./Notes/${user}`);
    }
    if (fs.existsSync(dir)) {
      return (chalk.red('El titulo de la nota ya existe'));
    } else {
      try {
        fs.writeFileSync(dir, `{\n  "title": "${note.title}",\n  "body": "${note.body}",\n  "color": "${note.color}"\n}`);
        return (chalk.green('Nueva nota creada'));
      } catch (err) {
        return (chalk.red('Error al crear la nota'));
      }
    }
  }

  /**
   * Método `modifyNote` encargado de modificar una nota, se le pasa todos los
   * atributos de la nota
   * @param user Usuario al que pertenece la nota
   * @param title Titulo de la nota
   * @param body Cuerpo de la nota
   * @param color Color de la nota
   */
  modifyNote(user: string, title: string, body: string, color: string): string {
    if (!fs.existsSync(`./Notes/${user}/${title}.json`)) {
      return (chalk.red('Nota no encontrada'));
    } else {
      try {
        const dir: string = `./Notes/${user}/${title}.json`;
        fs.writeFileSync(dir, `{\n  "title": "${title}",\n  "body": "${body}",\n  "color": "${color}"\n}`);
        return chalk.green('Modificación realizada');
      } catch (err) {
        return chalk.red('Error al modificar la nota');
      }
    }
  }

  /**
   * Método `rmNote` encargado de eliminar una nota a partir del usuario al que
   * pertenece y el titulo de la nota.
   * @param user Usuario de la nota
   * @param title Titulo de la nota
   */
  rmNote(user: string, title: string): string {
    const dir: string = `./Notes/${user}/${title}.json`;
    if (!fs.existsSync(dir)) {
      return (chalk.red('Nota no encontrada'));
    } else {
      try {
        fs.rmSync(dir);
        return (chalk.green('Nota eliminada'));
      } catch (err) {
        return (chalk.red('Error al eliminar la nota'));
      }
    }
  }

  /**
   * Método `listNote` encargado de mostrar la notas que tiene un usuario.
   * @param user Usuario al que se quiere mostrar sus notas
   */
  listNote(user: string): string {
    if (!fs.existsSync(`./Notes/${user}`)) {
      return (chalk.red('Notas no encontradas'));
    } else {
      const dir: string = './Notes/' + user;
      let list: string[] = [];
      fs.readdirSync(dir).forEach((element) => {
        list.push(element);
      });
      if (list.length == 0) {
        return (chalk.red(`El usuario ${user} no tiene notas`));
      } else {
        let print: string = '';
        let count: number = 0;
        list.forEach((element) => {
          try {
            const readDir = fs.readFileSync(`./Notes/${user}/${element}`).toString();
            const note: Note = JSON.parse(readDir);
            if (readDir.split(',').length != 3 || note.body == undefined || note.color == undefined || note.title == undefined ) {
              print = chalk.red('La estructura del fichero es errónea');
            } else {
              print = this.colors(note.color, 'Tus Notas\n', note.title);
            }
          } catch (err) {
            print = chalk.red('Error en el fichero');
          }
          ++count;
          if (count < list.length) print += '\n';
        });
        return print;
      }
    }
  }

  /**
   * Método `readNote` muestra por consola el cuerpo de una nota
   * @param user Usuario al que pertenece la nota a mostrar
   * @param title Titulo de la nota a mostrar
   */
  readNote(user: string, title: string): string {
    if (!fs.existsSync(`./Notes/${user}/${title}.json`)) {
      return (chalk.red('Notas no encontradas'));
    } else {
      try {
        const dir: string = `./Notes/${user}/${title}.json`;
        const readDir: string = fs.readFileSync(dir).toString();
        const note: Note = JSON.parse(readDir);
        if (readDir.split(',').length != 3 || note.body == undefined || note.color == undefined || note.title == undefined) {
          return 'El fichero no tiene tres atributos';
        } else {
          return this.colors(note.color, `${note.title}\n`, note.body);
        }
      } catch (err) {
        return (chalk.red('Error en el fichero'));
      }
    }
  }

  /**
 * Método `rmDir` encargado de eliminar un directorio de un usuario
 * @param user usuario a eliminar el directorio
 * @returns devuelve `do it` si se elimino correctamente y `'El directorio no existe'`
 */
  rmDir(user: string) {
    if (!fs.existsSync(`./Notes/${user}`)) {
      return chalk.red('El directorio no existe');
    } else {
      // const fs = require('fs').promises;
      rimraf.sync(`./Notes/${user}`);
      return 'do it';
    }
  }

  /**
   * Se encarga de desvolver uns string con el color indicado por parámetros
   * @param color Color que se desea asigna a un string
   * @param message mensaje previo del string
   * @param printMessage string al que se le decía asigna el color
   * @returns devuelve el string con el color indicado
   */
  colors(color: string, message: string, printMessage: string): string {
    let print: string = message;
    switch (color) {
      case 'rojo':
        print += chalk.red(printMessage);
        break;
      case 'azul':
        print += chalk.blue(printMessage);
        break;
      case 'verde':
        print += chalk.green(printMessage);
        break;
      case 'amarillo':
        print += chalk.yellow(printMessage);
        break;
      default:
        print = chalk.red('Color introducido erróneo');
        break;
    }
    return print;
  }
}
