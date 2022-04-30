import { spawn } from 'child_process';
import * as fs from 'fs';

export class Wrapper {
  constructor(private file: string) {}

  checkDirFile() {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`No existe ./${this.file}`);
      } else {
        const ls = spawn('ls', ['-ld', this.file]);

        let lsOutput = '';
        ls.stdout.on('data', (piece) => {
          lsOutput += piece;
        });

        ls.on('error', (error) => {
          console.log(error.message);
        });

        ls.on('close', () => {
          // console.log(lsOutput);
          const vecLsOutput = lsOutput.split('');
          // console.log(vecLsOutput);
          if (vecLsOutput[0] === 'd') {
            console.log(`${this.file} es un directorio`);
          } else {
            console.log(`${this.file} es un fichero`);
          }
        });
      }
    });
  }

  mkdir() {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (!err) {
        console.log(`Ya existe ./${this.file}`);
      } else {
        spawn('mkdir', [this.file]);
        console.log("Directorio creado");
      }
    });
  }

  listFiles() {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('El fichero no existe');
      } else {
        fs.stat(this.file, (err, stats) => {
          if (!err) {
            if (stats.isFile()) {
              console.log(`${this.file} es un fichero`);
            } else if (stats.isDirectory()) {
              // console.log('is directory? ' + stats.isDirectory());
              // console.log('is directory? ' + stats.isDirectory());
              const ls = spawn('ls', ['-p', this.file]);
              const grep = spawn('grep', ['-v', '/']);
              ls.stdout.pipe(grep.stdin);

              let grepOutput = '';
              grep.stdout.on('data', (piece) => {
                grepOutput += piece;
              });

              grep.on('error', (error) => {
                console.log(error.message);
              });

              ls.on('error', (error) => {
                console.log(error.message);
              });

              grep.on('close', () => {
                if (grepOutput.length === 0) console.log(`No hay ficheros en el directorio ${this.file}`);
                else console.log(grepOutput);
              });
            }
          } else {
            console.log(err.message);
          }
        });
      }
    });
  }

  cat() {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('El fichero no existe');
      } else {
        fs.stat(this.file, (err, stats) => {
          if (!err) {
            if (stats.isDirectory()) {
              console.log(`${this.file} es un directorio`);
            } else if (stats.isFile()) {
              const cat = spawn('cat', [this.file]);

              let catOutput = '';
              cat.stdout.on('data', (piece) => {
                catOutput += piece;
              });

              cat.on('error', (error) => {
                console.log(error.message);
              });

              cat.on('close', () => {
                console.log(catOutput);
              });
            }
          } else {
            console.log(err.message);
          }
        });
      }
    });
  }

  rm() {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('El fichero no existe');
      } else {
        fs.stat(this.file, (err, stats) => {
          if (!err) {
            if (stats.isDirectory()) {
              const rm = spawn('rm', ['-R', this.file]);

              rm.on('error', (error) => {
                console.log(error.message);
              });

              rm.on('close', () => {
                console.log(`Eliminado el directorio ${this.file}`);
              });
            } else if (stats.isFile()) {
              const rm = spawn('rm', [this.file]);

              rm.on('error', (error) => {
                console.log(error.message);
              });

              rm.on('close', () => {
                console.log(`Eliminado el fichero ${this.file}`);
              });
            }
          } else {
            console.log(err.message);
          }
        });
      }
    });
  }

  cp(destination: string) {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('El fichero origen no existe');
      } else {
        fs.access(destination, fs.constants.F_OK, (err) => {
          if (err) {
            console.log('El fichero destino no existe');
          } else {
            const fileName = this.file.split('/');
            fs.access(`${destination}/${fileName[fileName.length - 1]}`, fs.constants.F_OK, (err) => {
              if (!err) {
                console.log('El fichero/directorio a copiar ya existe en destino');
              } else {
                fs.stat(destination, (err, stats) => {
                  if (!err) {
                    if (stats.isFile()) {
                      console.log(`La ruta ${destination} es un fichero`);
                    } else if (stats.isDirectory()) {
                      fs.stat(this.file, (err, stats) => {
                        if (!err) {
                          if (stats.isFile()) {
                            const cp = spawn('cp', [this.file, destination]);

                            cp.on('error', (error) => {
                              console.log(error.message);
                            });

                            cp.on('close', () => {
                              console.log(`El fichero ${this.file} copiado en ${destination}`);
                            });
                          } else if (stats.isDirectory()) {
                            const cp = spawn('cp', ['-r', this.file, destination]);

                            cp.on('error', (error) => {
                              console.log(error.message);
                            });

                            cp.on('close', () => {
                              console.log(`El fichero ${this.file} copiado en ${destination}`);
                            });
                          }
                        } else {
                          console.log(err.message);
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

  mv(destination: string) {
    fs.access(this.file, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('El fichero origen no existe');
      } else {
        fs.access(destination, fs.constants.F_OK, (err) => {
          if (err) {
            console.log('El fichero destino no existe');
          } else {
            const fileName = this.file.split('/');
            fs.access(`${destination}/${fileName[fileName.length - 1]}`, fs.constants.F_OK, (err) => {
              if (!err) {
                console.log('El fichero/directorio a mover ya existe en destino');
              } else {
                fs.stat(destination, (err, stats) => {
                  if (!err) {
                    if (stats.isFile()) {
                      console.log(`La ruta de destino ${destination} es un fichero`);
                    } else if (stats.isDirectory()) {
                      const mv = spawn('mv', [this.file, destination]);

                      mv.on('error', (error) => {
                        console.log(error.message);
                      });

                      mv.on('close', () => {
                        console.log(`El fichero ${this.file} movido a ${destination}`);
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
