import { Injectable } from '@nestjs/common';
import { AuthTokenRepositoryInject } from './persistence/auth-token.repository';
import { AuthTokenRepository } from 'shared/respositories/auth-token/auth-token.repository';
import { AuthTokenSchemaClass } from 'shared/schemas/auth-token/auth-token.schema';

export interface AuthTokenService {
  createAuthToken(data: AuthTokenSchemaClass): Promise<AuthTokenSchemaClass>;
  deleteAuthToken(
    data: Partial<AuthTokenSchemaClass>,
  ): Promise<AuthTokenSchemaClass>;
  checkExistToken(token: string): Promise<AuthTokenSchemaClass>;
}

@Injectable()
export class AuthTokenServiceImpl implements AuthTokenService {
  constructor(
    @AuthTokenRepositoryInject()
    private readonly authTokenRepository: AuthTokenRepository,
  ) {}

  public async checkExistToken(token: string): Promise<AuthTokenSchemaClass> {
    return this.authTokenRepository.findOneByCondition({
      token,
    });
  }

  public async createAuthToken(
    data: AuthTokenSchemaClass,
  ): Promise<AuthTokenSchemaClass> {
    return this.authTokenRepository.create(data);
  }

  public async deleteAuthToken(
    data: Partial<AuthTokenSchemaClass>,
  ): Promise<AuthTokenSchemaClass> {
    return this.authTokenRepository.deleteOne(data);
  }
}
