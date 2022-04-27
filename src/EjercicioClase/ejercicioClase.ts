// import {watch} from 'fs';
import * as fs from 'fs';
import {spawn} from 'child_process';

// import {spawn} from 'child_process';


export class Fileslslh {
  /**
   * Recibe un string con la dirección del fichero
   * @param fileName string con la dir
   */
  constructor(private fileName: string, private comm1: string, private comm2: string, private comm3: string) {}

  /**
   * Función encargado de lee un documento
   */
  init() {
    fs.watch(this.fileName, (event, filename) => {
      if (!fs.existsSync(this.fileName)) {
        console.log('El fichero no existe');
      } else {
        if (event === 'change') {
          const ls = spawn(comm1, [comm2 + comm3, this.fileName]);
          let output = '';
          ls.stdout.on('data', (data) => {
            output += data;
          });
          ls.on('close', () => {
            console.log(output);
          });
        } else {
          console.log(`${filename} no tiene cambios`);
          // throw new Error('${filename} has been deleted');
        }
      }
    });
  }
// console.log(this.fileName);
}

const fileName = process.argv[2];
const comm1 = process.argv[3];
const comm2 = process.argv[4];
const comm3 = process.argv[5];


const variable = new Fileslslh(fileName, comm1, comm2, comm3);
variable.init();

