import { ExecutionContext } from '@nestjs/common';
import { extractUserFromContext } from './user.decorator';
import { Role } from '@prisma/client';

describe('extractUserFromContext', () => {
  it('should extract user from request object', () => {
    const mockUser = { id: 'user-1', role: Role.USER };

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;

    const result = extractUserFromContext(context);
    expect(result).toEqual(mockUser);
  });
});
