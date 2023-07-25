export default (uid: string, message: string, color: string, id: string) => {
  return JSON.stringify({
    g: uid,
    m: message,
    mc: color,
    i: id
  })
}