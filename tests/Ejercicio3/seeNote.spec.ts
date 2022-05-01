import 'mocha';
import {expect} from 'chai';
import {SeeNote} from "../../src/Ejercicio3/seeNote";

describe('Ejercicio 3', () => {
  let see1: SeeNote;
  let see2: SeeNote;

  beforeEach(() => {
    see1 = new SeeNote('edusegre', 'Notes');
    see2 = new SeeNote('edusegre', 'Note');
  });
  it('Existe la clase', () => {
    expect(SeeNote != undefined).to.be.true;
  });
  it('Se puede instanciar', () => {
    expect(see1 instanceof SeeNote).to.be.true;
  });
  it('Tiene un metodo init', () => {
    expect('init' in see1).to.be.true;
  });
  it('El metodo init controla errores', (done) => {
    see2.init((err, _) => {
      if (err) {
        expect(err).to.be.equal('ERROR: El fichero no existe ./Note/edusegre');
        done();
      }
    });
  });
});
