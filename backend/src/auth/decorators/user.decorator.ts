import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const extractUserFromContext = (ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
};

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => extractUserFromContext(ctx));
