import * as yargs from 'yargs';
import {Wrapper} from "./wrapper";
import * as chalk from 'chalk';

/**
 * Comando check para mostrar si es directorio o fichero
 */
yargs.command({
  command: 'check',
  describe: 'Muestra si v',
  builder: {
    file: {
      describe: 'Ruta del fichero o directorio',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && process.argv.length === 4) {
      const wrap: Wrapper = new Wrapper(argv.file);
      wrap.checkDirFile((err, evenType) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (evenType) {
          console.log(chalk.white(evenType));
        }
      });
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

/**
 * Comando mkdir para crear directorios
 */
yargs.command({
  command: 'mkdir',
  describe: 'Crea un directorio',
  builder: {
    file: {
      describe: 'Nueva ruta',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && process.argv.length === 4) {
      const wrap: Wrapper = new Wrapper(argv.file);
      wrap.mkdir((err, evenType) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (evenType) {
          console.log(chalk.white(evenType));
        }
      });
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

/**
 * Comando list para listar los ficheros dentro de un directorio
 */
yargs.command({
  command: 'list',
  describe: 'Listar los ficheros dentro de un directorio',
  builder: {
    file: {
      describe: 'Directorio a mostrar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && process.argv.length === 4) {
      const wrap: Wrapper = new Wrapper(argv.file);
      wrap.listFiles((err, evenType) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (evenType) {
          console.log(chalk.white(evenType));
        }
      });
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

/**
 * Comando cat para mostrar el contenido de un fichero
 */
yargs.command({
  command: 'cat',
  describe: 'Mostrar el contenido de un fichero',
  builder: {
    file: {
      describe: 'Directorio a mostrar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && process.argv.length === 4) {
      const wrap: Wrapper = new Wrapper(argv.file);
      wrap.cat((err, evenType) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (evenType) {
          console.log(chalk.white(evenType));
        }
      });
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

/**
 * OCmando rm para eliminar ficheros y directorios
 */
yargs.command({
  command: 'rm',
  describe: 'Borrar ficheros y directorios',
  builder: {
    file: {
      describe: 'Directorio/fichero a eliminar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && process.argv.length === 4) {
      const wrap: Wrapper = new Wrapper(argv.file);
      wrap.rm((err, evenType) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (evenType) {
          console.log(chalk.white(evenType));
        }
      });
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

/**
 * Comando cp para copiar ficheros y/o directorios de una ruta a otra
 */
yargs.command({
  command: 'cp',
  describe: 'Copiar ficheros y/o directorios de una ruta a otra',
  builder: {
    fileO: {
      describe: 'Nombre del fichero/directorio origen',
      demandOption: true,
      type: 'string',
    },
    fileD: {
      describe: 'Nombre del directorio destino',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.fileO === 'string' && typeof argv.fileD === 'string' && process.argv.length === 5) {
      const wrap: Wrapper = new Wrapper(argv.fileO);
      wrap.cp(argv.fileD, (err, evenType) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (evenType) {
          console.log(chalk.white(evenType));
        }
      });
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

/**
 * Comando mv para mover ficheros y/o directorios de una ruta a otra
 */
yargs.command({
  command: 'mv',
  describe: 'Mover ficheros y/o directorios de una ruta a otra',
  builder: {
    fileO: {
      describe: 'Nombre del fichero/directorio origen',
      demandOption: true,
      type: 'string',
    },
    fileD: {
      describe: 'Nombre del directorio destino',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.fileO === 'string' && typeof argv.fileD === 'string' && process.argv.length === 5) {
      const wrap: Wrapper = new Wrapper(argv.fileO);
      wrap.mv(argv.fileD, (err, evenType) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (evenType) {
          console.log(chalk.white(evenType));
        }
      });
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

yargs.parse();
