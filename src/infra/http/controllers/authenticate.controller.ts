import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/erros/wrong-credentials-error'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { success, accessToken } = result.value

    return { success, accessToken }
  }
}
