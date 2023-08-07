// import { SetMetadata } from '@nestjs/common';

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// export const User = (...args: string[]) => SetMetadata('user', args);

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
