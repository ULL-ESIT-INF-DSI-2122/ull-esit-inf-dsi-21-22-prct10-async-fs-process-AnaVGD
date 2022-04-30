/**
 * Clase Note
 */
export class Note {
  /**
   * Instancia una nota
   * @param _title Titulo de la nota
   * @param _body Cuerpo de la nota
   * @param _color Color de la nota
   */
  constructor(private _title: string, private _body: string, private _color: string) {}

  /**
   * Getter de color
   * @return devuelve color de la nota
   */
  public get color(): string {
    return this._color;
  }

  /**
   * Getter de body
   * @return devuelve body de la nota
   */
  public get body(): string {
    return this._body;
  }

  /**
   * Getter de title
   * @return devuelve title de la nota
   */
  public get title(): string {
    return this._title;
  }
}
