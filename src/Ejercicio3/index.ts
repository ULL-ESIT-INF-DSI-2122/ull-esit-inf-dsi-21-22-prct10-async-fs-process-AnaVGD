import * as yargs from 'yargs';
import {SeeNote} from "./seeNote";


yargs.command({
  command: 'see',
  describe: 'Ejecutar programa con pipe',
  builder: {
    file: {
      describe: 'Nombre del fichero',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Usuario de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && typeof argv.user === 'string' && process.argv.length === 5) {
      const newSeeNote: SeeNote = new SeeNote(argv.user, argv.file);
      newSeeNote.init();
    } else {
      console.log('Datos introducidos son erróneos');
    }
  },
});

yargs.parse();
