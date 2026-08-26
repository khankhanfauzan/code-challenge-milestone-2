import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const [existingEmail, existingUsername] = await Promise.all([
      this.usersRepository.findByEmail(dto.email),
      this.usersRepository.findByUserName(dto.username),
    ]);

    if (existingEmail) throw new BadRequestException("This email is already registered");
    if (existingUsername) throw new BadRequestException("This username is already registered");

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    return this.usersRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash
    });
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user.id, email: user.email, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, user: { id: user.id, username: user.username, email: user.email } }
  }
}
