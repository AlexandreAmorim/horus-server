import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsEmailError } from '@/use-cases/errors/users/user-already-exists-email-error'
import { UserAlreadyExistsDocumentError } from '@/use-cases/errors/users/user-already-exists-document-error'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    first_name,
    last_name,
    document,
    document_secondary,
    rg,
    email,
    phone,
    gender,
    birthday,
    avatar,
    is_intelligence,
    status,
  }: User): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(document, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsEmailError()
    }

    const userWithSameDocument =
      await this.usersRepository.findByDocument(document)

    if (userWithSameDocument) {
      throw new UserAlreadyExistsDocumentError()
    }

    const user = await this.usersRepository.create({
      first_name,
      last_name,
      document,
      document_secondary,
      rg,
      email,
      password: password_hash,
      phone,
      gender,
      birthday,
      avatar,
      is_intelligence,
      status,
    })

    return {
      user,
    }
  }
}
