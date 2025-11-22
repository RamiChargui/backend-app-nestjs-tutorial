import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, JwtPayload } from 'src/utils/types';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly JwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  public getAllUsers() {
    return this.userRepository.find();
  }

  /**
   * Registers a new user.
   * @param RegisterDto The user registration data.
   * @returns JWT (access token).
   */
  public async register(userdto: RegisterDto) {
    const { email, password, username } = userdto;
    const userformdb = await this.userRepository.findOneBy({ email });
    if (userformdb) throw new BadRequestException('user already exists');

    const hashedPassword = await this.hashPassword(password);
    const verificationToken = randomBytes(32).toString('hex');

    let newuser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      verificationToken: verificationToken,
    });
    newuser = await this.userRepository.save(newuser);

    const link = this.generateLink(newuser.id, verificationToken);

    await this.mailService.sendVerificatinEmail(email, link);

    return {
      message:
        'Verification token has been sent to your email, plrease check your email!',
    };
  }

  public async activeAccount(id: number, token: String): Promise<AccessToken> {
    const user = await this.userRepository.findOneBy({ id });
    if (user && user!.verificationToken == token && user!.isActive === false) {
      user!.isActive = true;
      user!.verificationToken = '';
      this.userRepository.save(user!);
      await this.mailService.sendWelcomeEmail(user!.email, user!.username);
      //to-do generate jwt token
      const accessToken = await this.generateJwtToken({
        id: user!.id,
        userRole: user!.role,
      });

      return { accessToken };
    }

    throw new BadRequestException(
      'Invalid verification token or user not found',
    );
  }

  public async login(logindto: LoginDto) {
    const { email, password } = logindto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new BadRequestException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    if (!user.isActive) {
      let verificationToken = user.verificationToken;

      if (!verificationToken) {
        user.verificationToken = randomBytes(32).toString('hex');
        const result = await this.userRepository.save(user);
        verificationToken = result.verificationToken;
      }
      const link = this.generateLink(user.id, verificationToken);

      await this.mailService.sendVerificatinEmail(user.email, link);
      return {
        message:
          'Verification token has been sent to your email, plrease check your email!',
      };
    }

    // to-do generate jwt token
    const accessToken = await this.generateJwtToken({
      id: user.id,
      userRole: user.role,
    });
    return { accessToken };
  }

  /**
   * Hashes a plain text password.
   * @param password The plain text password to hash.
   * @returns The hashed password.
   */
  public async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async generateJwtToken(payload: JwtPayload) {
    return this.JwtService.signAsync(payload);
  }

  generateLink(id: number, verificationToken: string) {
    return `${this.config.get<string>('DOMAIN')}/api/users/verify-email/${id}/${verificationToken}`;
  }
}
