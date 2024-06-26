import { UsersRepository } from '../repositories/users-repository';
import { HashProvider } from '../providers/hash-provider';
import { User } from '../entities/user';
import { AuditsRepository } from '../repositories/audits-repository';
import { Audit } from '../entities/audit';
import { Action } from '../enums/action';

import { WrongCredentialsError } from './errors/wrong-credentials-error';

import { Either, failure, success } from '@/core/logic/either';

interface ValidateUserCredentialsUseCaseRequest {
  email: string;
  password: string;
}

type ValidateUserCredentialsUseCaseError = WrongCredentialsError;

type ValidateUserCredentialsUseCaseResponse = Either<
  ValidateUserCredentialsUseCaseError,
  {
    user: User;
  }
>;

export class ValidateUserCredentialsUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly auditsRepository: AuditsRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute({
    email,
    password,
  }: ValidateUserCredentialsUseCaseRequest): Promise<ValidateUserCredentialsUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return failure(new WrongCredentialsError());
    }

    const doesPasswordMatches = await this.hashProvider.compare(
      password,
      user.password.value,
    );

    if (!doesPasswordMatches) {
      return failure(new WrongCredentialsError());
    }

    const audit = Audit.create({
      action: Action.UserAuthenticated,
      userId: user.id,
    });

    await this.auditsRepository.create(audit);

    return success({ user });
  }
}
