export class NotReachableError extends Error {
  constructor(message: string, value: never) {
    super(`${message}: ${value}`)
  }
}