import {spawn} from 'child_process';
import * as fs from 'fs';

/**
 * Clase `Wrapper`
 */
export class Wrapper {
  /** getter que devuelve la dirección del fichero  */
  public getFile(): string {
    return this.file;
  }
  /**
   * Constructor de la clase Wrapper
   * @param file dirección del fichero 
   */
  constructor(private file: string) {}

  /**
   * Método `checkDirFile`, comprueba si la dirección pasada es un fichero o un directorio
   * @param callback callback
   */
  checkDirFile(callback: (err: string | undefined, event: string | undefined) => void) {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`No existe ./${this.file}`, undefined);
      } else {
        const ls = spawn('ls', ['-ld', this.file]);

        let lsOutput = '';
        ls.stdout.on('data', (piece) => {
          lsOutput += piece;
        });

        ls.on('error', (error) => {
          callback(`ERROR: ./${error.message}`, undefined);
        });

        ls.on('close', () => {
          const vecLsOutput = lsOutput.split('');
          if (vecLsOutput[0] === 'd') {
            callback(undefined, `${this.file} es un directorio`);
          } else {
            callback(undefined, `${this.file} es un fichero`);
          }
        });
      }
    });
  }

  /**
   * `mkdir` se encarga de crear directorios
   * @param callback callback
   */
  mkdir(callback: (err: string | undefined, event: string | undefined) => void) {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (!err) {
        callback(`Ya existe ${this.file}`, undefined);
      } else {
        spawn('mkdir', [this.file]);
        callback(undefined, "Directorio creado");
      }
    });
  }

  /**
   * Listar los ficheros dentro de un directorio.
   * @param callback callback
   */
  listFiles(callback: (err: string | undefined, event: string | undefined) => void) {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`El fichero ${this.file} no existe`, undefined);
      } else {
        fs.stat(this.file, (err, stats) => {
          if (!err) {
            if (stats.isFile()) {
              callback(`${this.file} es un fichero`, undefined);
            } else if (stats.isDirectory()) {
              const ls = spawn('ls', ['-p', this.file]);
              const grep = spawn('grep', ['-v', '/']);
              ls.stdout.pipe(grep.stdin);

              let grepOutput = '';
              grep.stdout.on('data', (piece) => {
                grepOutput += piece;
              });

              grep.on('error', (error) => {
                callback(`ERROR: ./${error.message}`, undefined);
              });

              ls.on('error', (error) => {
                callback(`ERROR: ./${error.message}`, undefined);
              });

              grep.on('close', () => {
                if (grepOutput.length === 0) callback(undefined, `No hay ficheros en el directorio ${this.file}`);
                else callback(undefined, grepOutput);
              });
            }
          } else {
            callback(`ERROR: ./${err.message}`, undefined);
          }
        });
      }
    });
  }

  /**
   * Muestra el contenido de un fichero
   * @param callback callback
   */
  cat(callback: (err: string | undefined, event: string | undefined) => void) {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`El directorio ${this.file} no existe`, undefined);
      } else {
        fs.stat(this.file, (err, stats) => {
          if (!err) {
            if (stats.isDirectory()) {
              callback(`${this.file} es un directorio`, undefined);
            } else if (stats.isFile()) {
              const cat = spawn('cat', [this.file]);

              let catOutput = '';
              cat.stdout.on('data', (piece) => {
                catOutput += piece;
              });

              cat.on('error', (error) => {
                callback(`ERROR: ./${error.message}`, undefined);
              });

              cat.on('close', () => {
                callback(undefined, catOutput);
              });
            }
          } else {
            callback(`ERROR: ./${err.message}`, undefined);
          }
        });
      }
    });
  }

  /**
   * rm encargado de borrar ficheros y directorios.
   * @param callback callback
   */
  rm(callback: (err: string | undefined, event: string | undefined) => void) {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`El fichero/directorio ${this.file} no existe`, undefined);
      } else {
        fs.stat(this.file, (err, stats) => {
          if (!err) {
            if (stats.isDirectory()) {
              const rm = spawn('rm', ['-R', this.file]);

              rm.on('error', (error) => {
                callback(`ERROR: ./${error.message}`, undefined);
              });

              rm.on('close', () => {
                callback(undefined, `Eliminado el directorio ${this.file}`);
              });
            } else if (stats.isFile()) {
              const rm = spawn('rm', [this.file]);

              rm.on('error', (error) => {
                callback(`ERROR: ./${error.message}`, undefined);
              });

              rm.on('close', () => {
                callback(undefined, `Eliminado el fichero ${this.file}`);
              });
            }
          } else {
            callback(`ERROR: ./${err.message}`, undefined);
          }
        });
      }
    });
  }

  /**
   * Copiar ficheros y/o directorios de una ruta a otra. Se le pasa por
   * parámetro la ruto destino
   * @param destination ruta destino
   * @param callback callback
   */
  cp(destination: string, callback: (err: string | undefined, event: string | undefined) => void) {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`El fichero ${this.file} no existe`, undefined);
      } else {
        fs.access(destination, fs.constants.F_OK, (err) => {
          if (err) {
            callback(`El fichero ${this.file} no existe`, undefined);
          } else {
            const fileName = this.file.split('/');
            fs.access(`${destination}/${fileName[fileName.length - 1]}`, fs.constants.F_OK, (err) => {
              if (!err) {
                callback('El fichero/directorio a copiar ya existe en destino', undefined);
              } else {
                fs.stat(destination, (err, stats) => {
                  if (!err) {
                    if (stats.isFile()) {
                      callback(`La ruta ${destination} es un fichero`, undefined);
                    } else if (stats.isDirectory()) {
                      fs.stat(this.file, (err, stats) => {
                        if (!err) {
                          if (stats.isFile()) {
                            const cp = spawn('cp', [this.file, destination]);

                            cp.on('error', (error) => {
                              callback(`ERROR: ./${error.message}`, undefined);
                            });

                            cp.on('close', () => {
                              callback(undefined, `El fichero ${this.file} copiado en ${destination}`);
                            });
                          } else if (stats.isDirectory()) {
                            const cp = spawn('cp', ['-r', this.file, destination]);

                            cp.on('error', (error) => {
                              callback(`ERROR: ./${error.message}`, undefined);
                            });

                            cp.on('close', () => {
                              callback(undefined, `El fichero ${this.file} copiado en ${destination}`);
                            });
                          }
                        } else {
                          callback(`ERROR: ./${err.message}`, undefined);
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  /**
   * Movemos ficheros y/o directorios de una ruta a otra. Se le pasa por
   * parámetro la ruto destino
   * @param destination ruta destino
   * @param callback callback
   */
  mv(destination: string, callback: (err: string | undefined, event: string | undefined) => void) {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        callback('El fichero origen no existe', undefined);
      } else {
        fs.access(destination, fs.constants.F_OK, (err) => {
          if (err) {
            callback('El fichero destino no existe', undefined);
          } else {
            const fileName = this.file.split('/');
            fs.access(`${destination}/${fileName[fileName.length - 1]}`, fs.constants.F_OK, (err) => {
              if (!err) {
                callback('El fichero/directorio a mover ya existe en destino', undefined);
              } else {
                fs.stat(destination, (err, stats) => {
                  if (!err) {
                    if (stats.isFile()) {
                      callback(`La ruta de destino ${destination} es un fichero`, undefined);
                    } else if (stats.isDirectory()) {
                      const mv = spawn('mv', [this.file, destination]);

                      mv.on('error', (error) => {
                        callback(`ERROR: ./${error.message}`, undefined);
                      });

                      mv.on('close', () => {
                        callback(undefined, `El fichero ${this.file} movido a ${destination}`);
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}

// const wrap = new Wrapper('Notes/Pepe/Juan');
// wrap.checkDirFile();
// wrap.mkdir();
// wrap.listFiles();
// wrap.cat();
// wrap.rm();
// wrap.cp('Notes/Pepe');
// wrap.mv('Notes/Juan');
