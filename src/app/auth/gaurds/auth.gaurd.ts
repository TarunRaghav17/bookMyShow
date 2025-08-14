import { CanActivateFn } from '@angular/router';

export const authGaurd: CanActivateFn = (route, state) => {
  return true;
};
