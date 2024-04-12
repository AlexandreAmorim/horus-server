export class UserAlreadyExistsDocumentError extends Error {
  constructor() {
    super('Document already exists.')
  }
}
