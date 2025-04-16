export class InstitutionAlreadyExistsError extends Error {
  public statusCode: number;
  public error: string;

  constructor(public field: string) {
    super(`${field.toLowerCase()} já em uso.`);
    this.name = 'UserAlreadyExistsError';
    this.statusCode = 400;
    this.error = 'Bad Request';
  }
}
