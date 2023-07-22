import crypto from 'crypto'

export default (inputString: string) => {
  // 使用SHA256哈希函数将输入字符串转换为固定长度的哈希值（64个字符的16进制数）
  const hash = crypto.createHash('sha256').update(inputString).digest('hex');

  // 取哈希值的前12个字符（48位），将其转换为十进制数字
  let number = parseInt(hash.substr(0, 12), 16);

  // 确保生成的数字在指定范围内（1000000000 ~ 999999999999）
  const min = 1000000000;
  const max = 999999999999;
  number = min + (number % (max - min));

  return number
}