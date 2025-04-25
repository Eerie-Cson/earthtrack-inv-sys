import bcrypt from 'bcrypt';
import { generateAccount } from '../tests/helpers/generate-account';
import { UserService } from './user.service';

describe('UserService', () => {
  const userRepository = {
    create: jest.fn(),
    find: jest.fn(),
  };

  const userService = new UserService(userRepository as never);

  describe('#createProduct', () => {
    test.concurrent('should call create with correct params', async () => {
      const user = generateAccount();

      const hashedPassword = 'hashedPassword123';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      await userService.createUser(user);

      expect(userRepository.create).toHaveBeenCalledWith({
        ...user,
        password: hashedPassword,
      });
    });
  });

  describe('#findUser', () => {
    test.concurrent('should call find with correct params ', async () => {
      const user = generateAccount();

      userRepository.find.mockResolvedValue(user);

      await userService.findUser({ firstname: user.firstname });

      expect(userRepository.find).toHaveBeenCalledWith({
        firstname: user.firstname,
      });
    });
  });

  describe('#validateUser', () => {
    test.concurrent(
      'should call bcrypt compare with correct params',
      async () => {
        const user = generateAccount();
        const validPassword = user.password;
        const hashedPassword = await bcrypt.hash(validPassword, 10);

        userRepository.find.mockResolvedValue({
          ...user,
          password: hashedPassword,
        });

        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        await userService.validateUser(user.username, validPassword);

        expect(bcrypt.compare).toHaveBeenCalledWith(
          validPassword,
          hashedPassword
        );
      }
    );
  });
});
