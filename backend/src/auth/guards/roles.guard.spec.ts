import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndMerge: jest.fn(),
  };

  beforeEach(() => {
    reflector = mockReflector as unknown as Reflector;
    guard = new RolesGuard(reflector);
  });

  const createMockContext = (role: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role },
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    }) as unknown as ExecutionContext;

  it('should allow access if no roles are required', () => {
    mockReflector.getAllAndMerge.mockReturnValue(undefined);
    const context = createMockContext('USER');

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if role matches', () => {
    mockReflector.getAllAndMerge.mockReturnValue(['ADMIN']);
    const context = createMockContext('ADMIN');

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access if role does not match', () => {
    mockReflector.getAllAndMerge.mockReturnValue(['ADMIN']);
    const context = createMockContext('USER');

    expect(guard.canActivate(context)).toBe(false);
  });
});
