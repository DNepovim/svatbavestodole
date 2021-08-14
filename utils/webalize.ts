import { replaceDiacritics } from './replaceDiacritics'

export const webalize = (string: string) => replaceDiacritics(`${string}`)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^[-\s]+|[-\s]+$/g, '')
  .replace(/--+/g, '-');

