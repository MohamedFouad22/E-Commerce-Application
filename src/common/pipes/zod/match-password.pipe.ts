import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class MatchPasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      if (value.password !== value.confirmPassword) {
        throw new BadRequestException('Password Not Match 🚫');
      }
    }
    return value;
  }
}
