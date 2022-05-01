import 'mocha';
import {expect} from 'chai';
import {CatGrep} from "../../src/Ejercicio2/catGrep";

describe('Ejercicio 2', () => {
  let cat: CatGrep;
  let cat1: CatGrep;
  let cat2: CatGrep;
  beforeEach(() => {
    cat = new CatGrep('helloworld.txt', 'Hola');
    cat1 = new CatGrep('helloworl.txt', 'Hola');
    cat2 = new CatGrep('helloworld.txt', 'ana');
  });
  it('Existe la clase', () => {
    expect(CatGrep != undefined).to.be.true;
  });
  it('Se puede instanciar', () => {
    expect(cat instanceof CatGrep).to.be.true;
  });
  it('Tiene un metodo runPipe', () => {
    expect('runPipe' in cat).to.be.true;
  });
  it('El metodo runPipe funciona con palabra no existente', (done) => {
    cat2.runPipe((_, data) => {
      if (data) {
        expect(data).to.be.equal('La pabara "ana" no aparece en el fichero helloworld.txt');
        done();
      }
    });
  });
  it('El metodo runPipe funciona con palabra existente', (done) => {
    cat.runPipe((_, data) => {
      if (data) {
        expect(data).to.be.equal('La pabara "Hola" aparece 2 veces en el fichero helloworld.txt');
        done();
      }
    });
  });
  it('El metodo runPipe controla errores', (done) => {
    cat1.runPipe((err, _) => {
      if (err) {
        expect(err).to.be.equal('ERROR: El fichero helloworl.txt no existe');
        done();
      }
    });
  });
  it('Tiene un metodo runNoPipe', () => {
    expect('runNoPipe' in cat).to.be.true;
  });
  it('El metodo runNoPipe funciona con palabra no existente', (done) => {
    cat2.runNoPipe((_, data) => {
      if (data) {
        expect(data).to.be.equal('La pabara "ana" no aparece en el fichero helloworld.txt');
        done();
      }
    });
  });
  it('El metodo runNoPipe funciona con palabra existente', (done) => {
    cat.runNoPipe((_, data) => {
      if (data) {
        expect(data).to.be.equal('La pabara "Hola" aparece 2 veces en el fichero helloworld.txt');
        done();
      }
    });
  });
  it('El metodo runNoPipe controla errores', (done) => {
    cat1.runNoPipe((err, _) => {
      if (err) {
        expect(err).to.be.equal('ERROR: El fichero helloworl.txt no existe');
        done();
      }
    });
  });
});
