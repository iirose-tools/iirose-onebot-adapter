let count = 0;

export default () => {
  const sec = Math.floor(Date.now() / 1000);
  
  count += 1;

  return `${sec}${count.toString().padStart(4, '0')}`;
}

setInterval(() => count = 0, 1000)