import * as fs from 'fs';
import {spawn} from 'child_process';

export class CatGrep {
  constructor(private fileName: string, private word: string) {}

  runPipe(): void {
    fs.access(this.fileName, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('El fichero no existe');
      } else {
        const cat = spawn('cat', [this.fileName]);
        const grep = spawn('grep', [this.word]);
        cat.stdout.pipe(grep.stdin);

        let grepOutput = '';
        grep.stdout.on('data', (piece) => {
          grepOutput += piece;
        });

        grep.on('error', (error) => {
          console.log(error.message);
        });

        cat.on('error', (error) => {
          console.log(error.message);
        });

        grep.on('close', () => {
          const numberWord: number = (grepOutput.match(`\W*(${this.word})\W*`) || []).length;
          if (numberWord > 0) {
            console.log(`La pabara "${this.word}" aparece ${numberWord} veces en el fichero ${this.fileName}`);
          } else {
            console.log(`La pabara "${this.word}" no aparece en el fichero ${this.fileName}`);
          }
        });
      }
    });
  }

  runNoPipe() {
    fs.access(this.fileName, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('El fichero no existe');
      } else {
        const cat = spawn('cat', [this.fileName]);
        const grep = spawn('grep', [this.word]);

        cat.stdout.on("data", (data) => {
          grep.stdin.write(data);
        });

        cat.on('error', (error) => {
          console.log(error.message);
        });

        cat.on("close", () => {
          grep.stdin.end();
        });

        let grepOutput = '';
        grep.stdout.on('data', (piece) => {
          grepOutput += piece;
        });

        grep.on('error', (error) => {
          console.log(error.message);
        });

        grep.on('close', () => {
          const numberWord: number = (grepOutput.match(`\W*(${this.word})\W*`) || []).length;
          if (numberWord > 0) {
            console.log(`La pabara "${this.word}" aparece ${numberWord} veces en el fichero ${this.fileName}`);
          } else {
            console.log(`La pabara "${this.word}" no aparece en el fichero ${this.fileName}`);
          }
        });
      }
    });
  }
}

// const prub = new Ejercicios('helloworld.txt', 'Hola');
// prub.runPipe();
// prub.runNoPipe();
