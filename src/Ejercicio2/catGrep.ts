import * as fs from 'fs';
import {spawn} from 'child_process';
/**
 * Clase CatGrep
 */
export class CatGrep {
  /**
   * El constructor de la clase recibe un fichero y una palabra para buscar en
   * el fichero
   * @param fileName Fichero
   * @param word Palabra a buscar en el fichero
   */
  constructor(private fileName: string, private word: string) {}

  /**
   * Método `runPipe` encargado de conatar las ocurrencias de una palabra en un
   * fichero de texto usando `pipe`.
   * @param callback Callback
   */
  runPipe(callback: (err: string | undefined, event: string | undefined) => void): void {
    fs.access(this.fileName, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`ERROR: El fichero ${this.fileName} no existe`, undefined);
      } else {
        const cat = spawn('cat', [this.fileName]);
        const grep = spawn('grep', [this.word]);
        cat.stdout.pipe(grep.stdin);

        let grepOutput = '';
        grep.stdout.on('data', (piece) => {
          grepOutput += piece;
        });

        grep.on('error', (error) => {
          callback(`ERROR: ${error.message}`, undefined);
        });

        cat.on('error', (error) => {
          callback(`ERROR: ${error.message}`, undefined);
        });

        grep.on('close', () => {
          const numberWord: number = (grepOutput.match(`\W*(${this.word})\W*`) || []).length;
          if (numberWord > 0) {
            callback(undefined, `La pabara "${this.word}" aparece ${numberWord} veces en el fichero ${this.fileName}`);
          } else {
            callback(undefined, `La pabara "${this.word}" no aparece en el fichero ${this.fileName}`);
          }
        });
      }
    });
  }
  /**
   * Método `runPipe` encargado de conatar las ocurrencias de una palabra en un
   * fichero de texto sin usar `pipe`.
   * @param callback Callback
   */
  runNoPipe(callback: (err: string | undefined, event: string | undefined) => void) {
    fs.access(this.fileName, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`ERROR: El fichero ${this.fileName} no existe`, undefined);
      } else {
        const cat = spawn('cat', [this.fileName]);
        const grep = spawn('grep', [this.word]);

        cat.stdout.on("data", (data) => {
          grep.stdin.write(data);
        });

        cat.on('error', (error) => {
          callback(`ERROR: ${error.message}`, undefined);
        });

        cat.on("close", () => {
          grep.stdin.end();
        });

        let grepOutput = '';
        grep.stdout.on('data', (piece) => {
          grepOutput += piece;
        });

        grep.on('error', (error) => {
          callback(`ERROR: ${error.message}`, undefined);
        });

        grep.on('close', () => {
          const numberWord: number = (grepOutput.match(`\W*(${this.word})\W*`) || []).length;
          if (numberWord > 0) {
            callback(undefined, `La pabara "${this.word}" aparece ${numberWord} veces en el fichero ${this.fileName}`);
          } else {
            callback(undefined, `La pabara "${this.word}" no aparece en el fichero ${this.fileName}`);
          }
        });
      }
    });
  }
}

// const prub = new Ejercicios('helloworld.txt', 'Hola');
// prub.runPipe();
// prub.runNoPipe();
