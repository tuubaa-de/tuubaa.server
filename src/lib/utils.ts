export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function emotes(content: string) {
  console.log("content", content);

  return content.match(/<a?:.+?:\d{17,21}>|\p{Extended_Pictographic}/gu);
}
