# Práctica 10 - Sistema de ficheros y creación de procesos en Node.js



## Índice
- [Introducción](#idc)
- [Ejercicios](#ida)
  - [Ejercicio 1](#id1)
  - [Ejercicio 2](#id2)
  - [Ejercicio 3](#id3)
  - [Ejercicio 4](#id4)

## Introducción<a name="idc"></a>
En esta práctica se plantean una serie de ejercicios o retos a resolver haciendo uso de las APIs proporcionadas por Node.js para interactuar con el sistema de ficheros, así como para crear procesos.
### Ejercicio 1
Traza de ejecución mostrando, paso a paso, el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores, además de lo que se muestra por la consola.

1. Se inicializa la stak, API y QUEVE vacías

| Stack | API | Queue |
| -- | -- | -- |
| -- | -- | -- |
2. La función main entra a la stack

| Stack | API | Queue |
| -- | -- | -- |
| Main | -- | -- |

En este punto se generan dos situaciones

4. Si se cumple el if  entre en la pila el console.log

| Stack | API | Queue |
| -- | -- | -- |
| console.log()| -- | -- |
| Main | -- | -- |
5. Se saca el console de la pila y se imprime por pantalla

| Stack | API | Queue |
| -- | -- | -- |
| Main | -- | -- |

6.  Se saca el main y se finaliza el programa

| Stack | API | Queue |
| -- | -- | -- |
| -- | -- | -- |

4. En caso de que no se cumpla se entra en el else y entra acces a la pila

| Stack | API | Queue |
| -- | -- | -- |
| acces() | -- | -- |
| main | -- | -- |

5. Sale acces de la pila y entra en la API

| Stack | API | Queue |
| -- | -- | -- |
| Main | acces() | -- |

6. Sale main de la pila y acces dela de la API y entra en queve

| Stack | API | Queue |
| -- | -- | -- |
| -- | -- | acces() |

7. Sale acces de queve y entra en la pila que esta vaciá

| Stack | API | Queue |
| -- | -- | -- |
| acces() | -- | -- |

8. Se ejecuta acces, si hay un error entra en la pila el console.log(File.. , si no hay error, entra el console.log(Startin..), digamos que entra este último.

| Stack | API | Queue |
| -- | -- | -- |
| console.log(Startin..) | -- | -- |
| acces() | -- | -- |

9. Se saca el cconsole.log de la pila y se muestra por pantalla

| Stack | API | Queue |
| -- | -- | -- |
| acces() | -- | -- |

10. Entra watch en la pila

| Stack | API | Queue |
| -- | -- | -- |
| watch | -- | -- |
| acces() | -- | -- |

11. Se saca el watch de la pila y se ejecuta

| Stack | API | Queue |
| -- | -- | -- |
| acces() | -- | -- |

12. Entra watcher.on en la pila 

| Stack | API | Queue |
| -- | -- | -- |
| watcher.on | -- | -- |
| acces() | -- | -- |

13. Sale el watcher de la pila y entra en la API

| Stack | API | Queue |
| -- | -- | -- |
| acces() | watcher.on | -- |

14. Luego se espera a un cambio en el fichero y entra el console.log en la pila

| Stack | API | Queue |
| -- | -- | -- |
| console.log() | -- | -- |
| acces() | watcher.on | -- |

15. Se saca el console de la pila y se muestra por pantalla 

| Stack | API | Queue |
| -- | -- | -- |
| acces() | watcher.on | -- |

16. Sale de la pila el acces y el programa se queda esperando a algún cambio, como en el enunciado se indica que se realizan 2 cambios por lo que al real esos cambios se mandará al queve el console.log

| Stack | API | Queue |
| -- | -- | -- |
| -- | watcher.on | console.log() |

17. Luego el console sale del queve y entra en la pila

| Stack | API | Queue |
| -- | -- | -- |
| console.log() | watcher.on | -- |

18. Se saca de la pila y se muestra por consola

| Stack | API | Queue |
| -- | -- | -- |
| -- | watcher.on | -- |

19. Por último se cierra el programa y sale el watch.on de la API

| Stack | API | Queue |
| -- | -- | -- |
| -- | -- | -- |

### Ejercicio 2
Consistente en la implementación de un programa que devuelva el número de ocurrencias de una palabra en un fichero de texto. Para acceder al contenido del fichero se expande el comando `cat` de Unix/Linux, además de expandir el comando `grep` con la salida proporcionada por cat como entrada para obtener las líneas en las que se encuentra la palabra buscada.

Posee un clase `CatGrep` a la que se le pasa por el constructor la dirección del fichero

Esta clase cuenta con dos métodos:
 1. `runPipe` hace uso del método pipe de un Stream para poder redirigir la salida de un comando hacia otro.
La primero que hace este método es comprobar que el fichero exista, en caso de que no, se mostrará por pantalla el error, en caso contrario con ayuda de la función `spawn` se expande el `cat` y el `grep` y con ayuda de `pipe` se expande el comando `grep` con la salida de `cat`.

Cuando todo el proceso termina utilizó la función match para calcular el número de ocurrencias de la palabra en el fichero.

```typescript
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
```

2. `runNoPipe` hace lo mismo que el método anterior sin hacer uso del método pipe
Primero compruebo que exista el fichero y realizó la expiación del cat y el grep, una vez finaliza el cat expando el comando grep usando `end()`, y realizó el cálculo de la ocurrencias igual que el método anterior


```typescript
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
```



Este ejercicio se ejecuta pasando por líneas de comando el fichero gestionando haciendo uso de yars:

```typescript
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
```

Posee un comando `pipe` para ejecutar el metdo que usa pipe

```typescript
node dist/Ejercicio2/index.js node pipe --file="helloworld" --word="Hola"
```

Y otro comando `noPipe` para ejecutar el método que no usa pipe
```typescript
node dist/Ejercicio2/index.js node noPipe --file="helloworld" --word="Hola"
```

### Ejercicio 3
A partir de la aplicación de procesamiento de notas desarrollada en la Práctica 9, desarrolle una aplicación que reciba desde la línea de comandos el nombre de un usuario de la aplicación de notas, así como la ruta donde se almacenan las notas de dicho usuario. Esta aplicación gestiona los cambios realizados sobre todo el directorio especificado al mismo tiempo que dicho usuario interactúa con la aplicación de procesamiento de notas.

Este ejercicio consta de una clase `SeeNote` a la que se le pasó por el constructor el usuario y el dirección donde se almacenan las notas del usuario.

El método `init` primero comprueba que el fichero exista, en caso de que no se indicará por pantalla, posteriormente uso `watch` para vigilar el fichero, pasando le la dirección del directorio del usuario. Luego tengo if para gestionar los eventos que pueden surgir, en caso de una modificación el evento será un change, en caso de que se añade una nota primero surgirá el evento rename y posteriormente el evento change, por lo que para gestionar esto dentro de if de change uso `stat` para comprobar el fichero viendo que la variable birthtimeMs y mtimeMs sean sean distintas de este modo indica que se ha modificado el fichero, ya que en caso de que se cree la nota, estas variables contienen el mismo valor, en caso de que se borre una nota el evento sería un remane, para poder diferenciarlo del de crear una nota, compruebo que la nota exista, en caso de que si seria que se ha creado, en caso de que no, sería que se ha eliminado.


```typescript
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
```

Para gestionar el paso de parámetros desde la línea de comandos lo realizó haciendo uso de `yargs`

Posee un único comando `see`, se pasa la dirección y el usuario


```typescript
yargs.command({
  command: 'see',
  describe: 'Ver fichero de notas',
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
      newSeeNote.init((err, evenType) => {
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
```

Se ejecuta de la siguiente forma
```typescript
node dist/Ejercicio3/index.js see --file="Notes" --user="edusegre"
```

- ¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?
En este caso lo que haría yo es que para mostrar el nombre es tan fácil como usar la variable filename del watch y ese será el nombre del fichero. Luego para mostrar el contenido expandirá el comando cat dentro del if de '`rename`', es decir cuando el evento es `rename`. 

- ¿Cómo haría para que no solo se observará el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?
Tras una búsqueda por internet y tras lo dado en clase, se podría hacer esto con un watch recursivo, es decir que ponemos true a recursive `fs.watch( filename[recursive: true][, listener] )` de esta forma se vigilan todos los subdirectorios del directorio dado.


### Ejercicio 4
Aplicación que permite hacer de `wrapper` de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación deberá permitir:

1. Dada una ruta concreta, mostrar si es un directorio o un fichero.
2. Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.
3. Listar los ficheros dentro de un directorio.
4. Mostrar el contenido de un fichero (similar a ejecutar el comando cat).
5. Borrar ficheros y directorios.
6. Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.

Esta aplicación contiene una clase `Wrapper` la que posee varios métodos:

1. `checkDirFile` Se encarga de indicar si una ruta es un directorio o un fichero
Este método primero comprueba que la ruta introducida exista, luego se expande el comando ls -ld y en la variable `lsOutput` se guarda el contenido del stream, una vez que el evento que llegue sea clase realizó un `split` de `lsOutput` y compruebo que la primer letra del vector generado sea una `d`en caso de que si lo sea esto indicará que es un directorio y en caso de que sea un `-` es un fichero. 


```typescript
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
```
Esta aplicación contiene una clase `Wrapper` la que posee varios métodos:

1. `checkDirFile` Se encarga de indicar si una ruta es un directorio o un fichero
Este método primero comprueba que la ruta introducida exista, luego se expande el comando ls -ld y en la variable `lsOutput` se guarda el contenido del stream, una vez que el evento que llegue sea clase realizó un `split` de `lsOutput` y compruebo que la primer letra del vector generado sea una `d`en caso de que si lo sea esto indicará que es un directorio y en caso de que sea un `-` es un fichero. 


```typescript
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
```

3. `listFiles` listar los ficheros dentro de un directorio.
Compruebo primero que el directorio exista luego, con `stat` y el método `isFile()` y `isDirectory()` compruebo que la ruta introducida sea un directorio, luego expando el comando `ls -p`, y expando el comando `grep -v /` con la salida del anterior comando, de esta forma indico que quiero solo los string que no contengan un `/` al final, ya que el comando `ls -p` muestra los directorios una `/` al final. Por último, guardo la salida en `grepOutput` y compruebo que este no esté vació, y llama a callback pasándole `undefined` y `grepOutput`.


```typescript
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
```
4. `cat` Muestra el contenido de un fichero
Este método comprueba que exista el fichero, luego con `stat` y los métodos isFile compruebo si es un fichero, luego expando el comando cat y almaceno la salida en `catOutput` la cual condo el evento devuelto sea close, se lo pasare al callback.
 

```typescript
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
```
5. `rm` se encarga de borrar ficheros y directorios.
Primero comprueba que el fichero o directorio a barra exista. posteriormente con `fs.stat` y `isDirectory()` compruebo si es un directorio, en el caso de que lo sea expando el comando `rm -R` y cuando el evento sea close pasó al callback undefines y un string indicando que se a eliminado. En el caso de que sea un fichero expando el comando `rm` y realizó lo mismo comentado anteriormente.


```typescript
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
```

6. `cp` copiar ficheros y/o directorios de una ruta a otra.
Este método se le pasa por parámetro la ruta destino siendo la ruta pasada al constructor de la clase la de origen. El método primero comprueba si existe la ruta origen, luego se comprueba que exista la de destino. Comprueba también que la ruta a copiar no exista ya en la ruta destino, posteriormente también se revisa que la ruta destino no sea un fichero, ya cuando se han realizo la comprobaciones, se sabe que la ruta destino es un directorio, a continuación comprobamos si la ruta origen es un fichero, en ese caso expandimos el comando `cp` con la ruta origen y destino y indicamos que se realizó la copia, en caso de que sea un directorio expandimos el comando `cp -r` y se realizó lo mismo que con los ficheros. 


```typescript
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
```
7. `mv` este método se encarga de mover ficheros y/o directorios de una ruta a otra. 
Se realiza lo mismo que con copier la única diferencia es que el expandir se expande el comando `mv` de igual forma si la ruta origen es un fichero o si es un directorio. 


```typescript 
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
```
Este ejercicio se le pasan los parámetros por línea de comando por lo que hago uso de `yars`, cree un comando para cada uno de los métodos comentados anteriormente, al que se le pasa la ruta y en caso de los métodos `cp` y `mv` se le pasa también una ruta de destino.

[JARS](./src/Ejercicio4/index.ts).
Para ejecutar el comando `mkdir`:
```typescript
node dist/Ejercicio4/index.js check --file="Notes"
```
Para ejecutar el comando `mkdir`:
```typescript
node dist/Ejercicio4/index.js mkdir --file="Note"
```
Para ejecutar el comando `list`:
```typescript
node dist/Ejercicio4/index.js list --file="src"
```
Para ejecutar el comando `cat`:
```typescript
node dist/Ejercicio4/index.js cat --file="Notes/Pepe/Tilo.json"
```
Para ejecutar el comando `rm`:
```typescript
node dist/Ejercicio4/index.js cat --file="Notes/Pepe/Tilo.json"
```
Para ejecutar el comando `mv`:
```typescript
$node dist/Ejercicio4/index.js mv --fileO="Notes/Juan/Juan/Tilo.json" --fileD="Notes/edusegre"
```
Para ejecutar el comando `cp`:
```typescript
$node dist/Ejercicio4/index.js cp --fileO="Notes/Juan/Juan/Titulo.json" --fileD="Notes/edusegre"
```


Para la comprobación de este trabajo se realizaron las respectivos [pruebas](./tests/) y [domcuentacion](./docs/)