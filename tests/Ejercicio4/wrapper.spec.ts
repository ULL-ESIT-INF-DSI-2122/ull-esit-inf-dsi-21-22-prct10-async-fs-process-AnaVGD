import 'mocha';
import {expect} from 'chai';
import {Wrapper} from "../../src/Ejercicio4/wrapper";

describe('Ejercicio 4', () => {
  let wra1: Wrapper;
  let wra2: Wrapper;
  let wra3: Wrapper;
  let wra4: Wrapper;
  let wra5: Wrapper;
  // let wra6: Wrapper;
  let wra7: Wrapper;

  beforeEach(() => {
    wra1 = new Wrapper('Notes');
    wra2= new Wrapper('Notes/Pepe/Titulo.json');
    wra3= new Wrapper('Note');
    wra4= new Wrapper('src');
    wra5= new Wrapper('prub.txt');
    // wra6= new Wrapper('create.txt');
    wra7 = new Wrapper('Notes/Hola');
  });
  it('Existe la clase', () => {
    expect(Wrapper != undefined).to.be.true;
  });
  it('Se puede instanciar', () => {
    expect(wra1 instanceof Wrapper).to.be.true;
  });
  it('Tiene un metodo checkDirFile', () => {
    expect('checkDirFile' in wra1).to.be.true;
  });
  it('Tiene un metodo mkdir', () => {
    expect('mkdir' in wra1).to.be.true;
  });
  it('Tiene un metodo listFiles', () => {
    expect('listFiles' in wra1).to.be.true;
  });
  it('Tiene un metodo cat', () => {
    expect('cat' in wra1).to.be.true;
  });
  it('Tiene un metodo rm', () => {
    expect('rm' in wra1).to.be.true;
  });
  it('Tiene un metodo cp', () => {
    expect('cp' in wra1).to.be.true;
  });
  it('Tiene un metodo mv', () => {
    expect('mv' in wra1).to.be.true;
  });
  it('El metodo checkDirFile funciona indica si es un directorio', (done) => {
    wra1.checkDirFile((_, data) => {
      if (data) {
        expect(data).to.be.equal('Notes es un directorio');
        done();
      }
    });
  });

  it('El metodo checkDirFile funciona indica si es un fichero', (done) => {
    wra2.checkDirFile((_, data) => {
      if (data) {
        expect(data).to.be.equal('Notes/Pepe/Titulo.json es un fichero');
        done();
      }
    });
  });

  it('El metodo checkDirFile controla errores', (done) => {
    wra3.checkDirFile((err, _) => {
      if (err) {
        expect(err).to.be.equal('No existe ./Note');
        done();
      }
    });
  });

  it('El metodo mkdir y rm indica si crea un directorio y borrado', (done) => {
    wra7.mkdir((_, data) => {
      if (data) {
        expect(data).to.be.equal('Directorio creado');
        done();
      }
    });
    wra7.rm((_, data) => {
      if (data) {
        expect(data).to.be.equal('Eliminado el directorio Notes/Hola');
        done();
      }
    });
  });

  it('El metodo mkdir indica si el directorio existe', (done) => {
    wra1.mkdir((err, _) => {
      if (err) {
        expect(err).to.be.equal('Ya existe Notes');
        done();
      }
    });
  });

  it('El metodo listFiles lista un fichero', (done) => {
    wra4.listFiles((_, data) => {
      if (data) {
        expect(data).to.be.equal('basicFunctions.ts\nprub.ts\ntext.txt\n');
        done();
      }
    });
  });

  it('El metodo listFiles indica directorios inexistentes', (done) => {
    wra3.listFiles((err, _) => {
      if (err) {
        expect(err).to.be.equal('El fichero Note no existe');
        done();
      }
    });
  });

  it('El metodo listFiles indica si es in fichero', (done) => {
    wra2.listFiles((err, _) => {
      if (err) {
        expect(err).to.be.equal('Notes/Pepe/Titulo.json es un fichero');
        done();
      }
    });
  });

  it('El metodo cat muestra contenido de fichero', (done) => {
    wra5.cat((_, data) => {
      if (data) {
        expect(data).to.be.equal('Hola, prueba 1');
        done();
      }
    });
  });

  it('El metodo cat indica directorios inexistentes', (done) => {
    wra3.cat((err, _) => {
      if (err) {
        expect(err).to.be.equal('El directorio Note no existe');
        done();
      }
    });
  });

  it('El metodo cat indica si es un directorio', (done) => {
    wra1.cat((err, _) => {
      if (err) {
        expect(err).to.be.equal('Notes es un directorio');
        done();
      }
    });
  });

  it('El metodo rm indica fichero/directorios si es inexistentes', (done) => {
    wra3.rm((err, _) => {
      if (err) {
        expect(err).to.be.equal('El fichero/directorio Note no existe');
        done();
      }
    });
  });

  // it('El metodo rm elimina directorio', (done) => {
  //   spawn('touch', [wra6.getFile()]);
  //   wra6.rm((_, data) => {
  //     if (data) {
  //       expect(data).to.be.equal('Eliminado el fichero create.txt');
  //       done();
  //     }
  //   });
  // });
});
