import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_secret_key_here',
      signOptions: { expiresIn: '5m' },
    }),
    UserModule,
    OrderModule,
    MarketModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
