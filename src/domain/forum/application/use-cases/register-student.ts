import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { HasherGenerator } from '../cryptography/hash-generator'
import { StudentsRepository } from '../repositories/students-repository'
import { StudentAlreadyExistsError } from './erros/student-already-exists-error'

interface RegisterStudentUseCaseProps {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    success: boolean
    student: {
      name: string
      email: string
    }
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HasherGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseProps): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) return left(new StudentAlreadyExistsError(email))

    const password_hash = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password_hash,
    })

    await this.studentsRepository.create(student)

    return right({
      success: true,
      student: {
        name: student.name,
        email: student.email,
      },
    })
  }
}
