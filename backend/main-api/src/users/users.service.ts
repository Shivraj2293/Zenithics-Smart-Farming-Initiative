import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // --- NEW DEBUGGING LOG ---
    console.log('!!! User saved. Attempting to send welcome email...');
    // --- END OF DEBUGGING LOG ---

    try {
      await this.notificationsService.sendWelcomeEmail(savedUser.email);
    } catch (error) {
        console.error('!!! FAILED to call sendWelcomeEmail:', error);
    }

    return savedUser;
  }

  // ... (the rest of your methods: findAll, findOneByEmail, etc. are unchanged)
  findAll() {
    return this.userRepository.find();
  }
  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
  async findOneByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { passwordResetToken: token } });
  }
}

