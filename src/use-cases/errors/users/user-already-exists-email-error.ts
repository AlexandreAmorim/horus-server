export class UserAlreadyExistsEmailError extends Error {
  constructor() {
    super('E-mail already exists.')
  }
}
