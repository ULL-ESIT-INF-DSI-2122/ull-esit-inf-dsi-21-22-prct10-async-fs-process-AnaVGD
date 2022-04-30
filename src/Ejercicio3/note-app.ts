import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {Note} from "./note";
import {Management} from './management';

/**
 * Comando add, permite añadir notas pasando por linea de
 * comando el usuario, el titulo, el cuerpo y el color de la nota
 */
yargs.command({
  command: 'add',
  describe: 'Añadir una nueva nota',
  builder: {
    user: {
      describe: 'Usuario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string' && process.argv.length === 7) {
      const newNote: Note = new Note(argv.title, argv.body, argv.color);
      const managment: Management = new Management();
      console.log(managment.addNote(newNote, argv.user));
    } else {
      console.log(chalk.red('Datos introducidos son erróneos'));
    }
  },
});

/**
 * Comando list, permite listar las notas de un usurario pasando por linea de
 * comando el usuario de esta.
 */
yargs.command({
  command: 'list',
  describe: 'Listar notas de un usuario',
  builder: {
    user: {
      describe: 'Nota del usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const managment: Management = new Management();
      console.log(chalk.white(managment.listNote(argv.user)));
    } else {
      console.log(chalk.red('Datos introducidos son erróneos'));
    }
  },
});

/**
 * Comando remove, permite eliminar una notas pasando por linea de
 * comando el usuario, el titulo de esta.
 */
yargs.command({
  command: 'remove',
  describe: 'Elimina una nota',
  builder: {
    user: {
      describe: 'Nota del usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && process.argv.length === 5) {
      const managment: Management = new Management();
      console.log(managment.rmNote(argv.user, argv.title));
    } else {
      console.log(chalk.red('Datos introducidos son erróneos'));
    }
  },
});

/**
 * Comando read, permite leer el contenido de una de las notas de un usuario
 * pasando por linea de comando el usuario, el titulo de la nota
 */
yargs.command({
  command: 'read',
  describe: 'Leer una nota',
  builder: {
    user: {
      describe: 'Nota del usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && process.argv.length === 5) {
      const managment: Management = new Management();
      console.log(managment.readNote(argv.user, argv.title));
    } else {
      console.log(chalk.red('Datos introducidos son erróneos'));
    }
  },
});

/**
 * Comando mody, permite modificar notas pasando por linea de
 * comando el usuario, el titulo, el cuerpo y el color de la nota
 */
yargs.command({
  command: 'mody',
  describe: 'Modificar notas de un usuario',
  builder: {
    user: {
      describe: 'Usuario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string' && process.argv.length === 7) {
      const managment: Management = new Management();
      console.log(managment.modifyNote(argv.user, argv.title, argv.body, argv.color));
    } else {
      console.log(chalk.red('Datos introducidos son erroneos'));
    }
  },
});

yargs.parse();
