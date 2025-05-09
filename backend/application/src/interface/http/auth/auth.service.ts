import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOrCreateUser(email: string): Promise<any> {
    let user = await this.userService.findByEmail(email);

    if (!user) {
      user = await this.userService.create(email);
    }

    return user;
  }

  async login(email: string) {
    const user = await this.validateOrCreateUser(email);

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
