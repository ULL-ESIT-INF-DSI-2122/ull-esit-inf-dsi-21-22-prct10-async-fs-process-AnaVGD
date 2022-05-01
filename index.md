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


### Ejercicio 2
Consististe en la implementación un programa que devuelva el número de ocurrencias de una palabra en un fichero de texto. Para acceder al contenido del fichero se expande el comando `cat` de Unix/Linux, además de expandir el comando `grep` con la salida proporcionada por cat como entrada para obtener las líneas en las que se encuentra la palabra buscada.

Posse un clase `CatGrep` a la que se le pasa por el constructor la dirección del fichero

Esta clase cuenta con dos métodos:
 1. `runPipe` hace uso del método pipe de un Stream para poder redirigir la salida de un comando hacia otro.
La pormiro que hace este metdo es comprobar que el fichero exista, en caso de que nose mostrara por pantalla el erro, en caso contrario con ayuda de la funcion `spawn` se expande el `cat` y el `grep` y con ayuda de `pipe` se expande el coamndo `grep` con la salida de `cat`.

Cuando todo el proceso termina utilizo la funcion match para calcular el numero de ocurrencias de la palabra en el fichero.

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

2. `runNoPipe` a¡hace lo mismo que el método anterior sin hacer uso del método pipe
Primero compruebo que exista el fichero y realizo la expiación del cat y el grep, una vez finaliza el cat expando el comando grep usando `end()`, y realizo el calcuculo de la ocurrencias igual que el método anterior

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

Este ejercicio se ejecuta pasando por lineas de comando el fichero gestionándose haciendo uso de yars:

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

Posee un comado `pipe` para ejecutar el metdo que usa pipe

```typescript
node dist/Ejercicio2/index.js node pipe --file="helloworld" --word="Hola"
```

Y otro comando `noPipe` para ejecutar el método que no usa pipe
```typescript
node dist/Ejercicio2/index.js node noPipe --file="helloworld" --word="Hola"
```

### Ejercicio 3
A partir de la aplicación de procesamiento de notas desarrollada en la Práctica 9, desarrolle una aplicación que reciba desde la línea de comandos el nombre de un usuario de la aplicación de notas, así como la ruta donde se almacenan las notas de dicho usuario. esta aplicación gestiona los cambios realizados sobre todo el directorio especificado al mismo tiempo que dicho usuario interactúa con la aplicación de procesamiento de notas.

Este ejercicio consta de una clase `SeeNote` a la que se le paso por el constructor el usuario y el dirección donde se almacenan las notas del usuario.

El método `init` primero comprueba que el fichero exista, en caso de que o se indicara por pantalla, posteriormente uso `watch` para vigilar el fichero, pasando le la dirección del directorio del usuario. Luego tengo if para gestionar los eventos que pueden surgir, en caso de una modificación el evento sera un change, en caso de que se añada una nota primero surgirá el evento rename y posteriormente el evento change, por lo que para gestionar esto dentro de if de change uso `stat` para comprobar el fichero viendo que la variable birthtimeMs y mtimeMs sean sean distintas de este modo indica que se ha modificado el fichero, ya que en caso de que se cree la nota, estas variables contienen el mismo valor, en caso de que se borre una nota el evento seria un remane, para poder diferenciarlo del de crear una nota, compruebo que la nota exista, en caso de que si seria que se ha creado, en caso de que no, seria que se ha eliminado.

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

Para gestionar el paso de parámetros esde la línea de comandos lo realizo haciendo uso de `yargs`

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

### Ejercicio 4
Aplicación que permite hacer de `wrapper` de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación deberá permitir:

1. Dada una ruta concreta, mostrar si es un directorio o un fichero.
2. Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.
3. Listar los ficheros dentro de un directorio.
4. Mostrar el contenido de un fichero (similar a ejecutar el comando cat).
5. Borrar ficheros y directorios.
6. Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.

Esta aplicacion contiene una clase `Wrapper` la que posee varios metodos:

1. `checkDirFile` Se encarga de indicar si una ruta es un directorio o un fichero
Este método primero comprueba que la ruta introducida exista, luego se expande el comando ls -ld y en la variable `lsOutput` se guarda el contenido del stream, una vez que el evento que llegue sea clase realizo un `split` de `lsOutput` y compruebo que la primero letra del vector generado sea una `d`en caso de que si lo sea esto indicara que es un directorio y en caso de que sea un `-` es un fichero. 

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
2. `mkdir` crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.
Este método primero comprueba que que el fichero exista, en caso de que no, se expande el comando `mkdir` y llamo a callback panado le undefined y el string indicando que se ha creado el directorio. 

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
Compurbo primero qu el directorio exista luego, con `stat` y el método `isFile()` y `isDirectory()` compruebo que la ruta introducida sea un derictor, luego expando el comando `ls -p`, y expando el comando `grep -v /` con la salida del anterior comando, de esta forma indico que quiero solo los string que no contengan un `/` al final, ya que el coando `ls -p` mustra los directorios una `/` al final. Por ultimo, gurdo la salida en `grepOutput` y compruebo que este no este vació, y llama a callback pasándole `undefined` y `grepOutput`.

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
Este métdo comprueba que exisat el fichero, luego con `stat` y los métodos isFile compuebo si es un fichero, luego expando el coando cat y almaceno la salida en `catOutput` la cual condo el evento devuelto sea close, se lo pasare al callback. 

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
