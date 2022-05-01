import * as fs from 'fs';
/**
 * Clase `SeeNote`
 */
export class SeeNote {
  /**
   * Constructor de la clase `SeeNote`
   * @param user Usuario de las notas
   * @param fileName Dirección de donde se almacenan las notas
   */
  constructor(private user: string, private fileName: string) {}
  /**
   * Método encargado de vigilar el fichero del usuario
   * @param callback callback
   */
  init(callback: (err: string | undefined, event: string | undefined) => void) {
    fs.access(`./${this.fileName}/${this.user}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`ERROR: El fichero no existe ./${this.fileName}/${this.user}`, undefined);
      } else {
        fs.watch(`./${this.fileName}/${this.user}`, (event, filename) => {
          if (event === 'change') {
            fs.stat(`./${this.fileName}/${this.user}/${filename}`, (_, stats) => {
              if (stats.birthtimeMs !== stats.mtimeMs) {
                callback(undefined, `\n${filename} se ha modificado`);
              }
            });
          } else if (event === 'rename') {
            fs.access(`./${this.fileName}/${this.user}/${filename}`, fs.constants.F_OK, (err) => {
              if (err) {
                callback(undefined, `\n${filename} se ha borrado`);
              } else {
                callback(undefined, `\n${filename} se ha creado`);
              }
            });
          } else {
            callback(undefined, `\n${filename} no tiene cambios`);
          }
        });
      }
    });
  }
}

// const eje3 = new SeeNote('edusegre', 'Notes');
// eje3.init();
