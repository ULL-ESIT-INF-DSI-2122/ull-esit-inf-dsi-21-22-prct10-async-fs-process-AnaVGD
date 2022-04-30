import * as yargs from 'yargs';
import {CatGrep} from "./catGrep";


yargs.command({
  command: 'pipe',
  describe: 'Ejecutar programa con pipe',
  builder: {
    file: {
      describe: 'Nombre del fichero',
      demandOption: true,
      type: 'string',
    },
    word: {
      describe: 'Palabra a buscar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && typeof argv.word === 'string' && process.argv.length === 5) {
      const newCatGrep: CatGrep = new CatGrep(argv.file, argv.word);
      newCatGrep.runPipe();
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

yargs.command({
  command: 'noPipe',
  describe: 'Ejecutar programa con pipe',
  builder: {
    file: {
      describe: 'Nombre del fichero',
      demandOption: true,
      type: 'string',
    },
    word: {
      describe: 'Palabra a buscar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && typeof argv.word === 'string' && process.argv.length === 5) {
      const newCatGrep: CatGrep = new CatGrep(argv.file, argv.word);
      newCatGrep.runNoPipe();
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

yargs.parse();
