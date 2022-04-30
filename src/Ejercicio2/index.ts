import * as yargs from 'yargs';
import * as chalk from 'chalk';
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
      newCatGrep.runPipe((err, evenType) => {
        if (err) {
          console.log(err);
        } else if (evenType) {
          console.log(evenType);
        }
      });
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
      newCatGrep.runNoPipe((err, evenType) => {
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
