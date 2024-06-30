import { AppError } from '@/core/error/app-error';
import { I18NextDomain } from '@/core/infra/enums/i18next';

export class AtLeastOneSpecialCharacterPasswordError extends AppError {
  constructor() {
    super(I18NextDomain.AtLeastOneSpecialCharacterPassword);
  }
}
