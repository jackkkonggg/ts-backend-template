import { camelCase, upperCase } from 'lodash';

export function toEnumCase(str: string) {
  return upperCase(camelCase(str)).split(' ').join('_');
}
