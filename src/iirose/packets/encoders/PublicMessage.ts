export default (message: string, color: string, id: string) => {
  if (message === 'cut') {
    return `{0${JSON.stringify({
      m: message,
      mc: color,
      i: id
    })}`
  }

  return JSON.stringify({
    m: message,
    mc: color,
    i: id
  })
}