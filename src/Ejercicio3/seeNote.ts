import * as fs from 'fs';

export class SeeNote {
  constructor(private user: string, private fileName: string) {}

  init() {
    console.log('hi');
    fs.access(`./${this.fileName}/${this.user}`, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`El fichero no existe ./${this.fileName}/${this.user}`);
      } else {
        fs.watch(`./${this.fileName}/${this.user}`, (event, filename) => {
          if (event === 'change') {
            fs.stat(`./${this.fileName}/${this.user}/${filename}`, (_, stats) => {
              // console.log(stats);
              if (stats.birthtimeMs !== stats.mtimeMs) {
                console.log("\n", filename, "se ha modificado");
              }
            });
          } else if (event === 'rename') {
            fs.access(`./${this.fileName}/${this.user}/${filename}`, fs.constants.F_OK, (err) => {
              if (err) {
                console.log("\n", filename, "se ha borrado");
              } else {
                console.log("\n", filename, "se ha creado");
              }
            });
          } else {
            console.log(`${filename} no tiene cambios`);
          }
        });
      }
    });
  }
}

// const eje3 = new SeeNote('edusegre', 'Notes');
// eje3.init();
