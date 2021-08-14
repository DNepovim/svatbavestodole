export const numberToTime = (input: number): string => {
  const minutes = (input % 1) * 60
  return `${Math.floor(input)}:${minutes > 9 ? minutes : `0${minutes}`}`
}