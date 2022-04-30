import * as yargs from 'yargs';
import {Wrapper} from "./wrapper";


yargs.command({
  command: 'check',
  describe: 'Muestra si es directorio o fichero',
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
      wrap.checkDirFile();
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

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
      wrap.mkdir();
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

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
      wrap.listFiles();
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

yargs.command({
  command: 'cat',
  describe: 'Mostrar el contenido de un fichero ',
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
      wrap.cat();
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

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
      wrap.rm();
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

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
      wrap.cp(argv.fileD);
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

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
      wrap.mv(argv.fileD);
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

yargs.parse();
