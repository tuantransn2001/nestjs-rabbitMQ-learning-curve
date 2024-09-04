import {
  BaseCRUDRepository,
  BaseCRUDRepositoryImpl,
} from 'src/shared/respository/base.repository';
import { UserSchemaClass, UserSchemaDocument } from '../entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DatabaseCollection } from 'src/common/utils/database/database-collection';
import mongoose, { Model } from 'mongoose';
import { TokenPayload } from 'src/modules/auth/dto/auth.response.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface UserRepository extends BaseCRUDRepository<UserSchemaClass> {
  findByEmail(email: string): Promise<UserSchemaDocument>;
  generateToken(user: UserSchemaClass): {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpire: number;
    lifeTime: number;
    refreshLifeTime: number;
  };
}

export class UserRepositoryImpl
  extends BaseCRUDRepositoryImpl<UserSchemaDocument>
  implements UserRepository
{
  constructor(
    @InjectModel(DatabaseCollection.COLLECTION_USER)
    private readonly userModel: Model<UserSchemaDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super(userModel);
  }

  public async findByEmail(email: string): Promise<UserSchemaDocument> {
    return this.userModel.findOne({ email });
  }

  public generateToken(user: UserSchemaClass) {
    const payload: TokenPayload = {
      sub: user._id as mongoose.Types.ObjectId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const data = {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.private_key'),
        expiresIn: this.configService.get<string>('jwt.life_time'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.refresh_key'),
        expiresIn: this.configService.get<string>('jwt.refresh_life_time'),
      }),
    };

    const expiresIn: any = this.jwtService.decode(data.refreshToken);

    return {
      ...data,
      refreshTokenExpire: expiresIn?.exp as number,
      lifeTime: this.configService.get<number>('jwt.life_time'),
      refreshLifeTime: this.configService.get<number>('jwt.refresh_life_time'),
    };
  }
}
