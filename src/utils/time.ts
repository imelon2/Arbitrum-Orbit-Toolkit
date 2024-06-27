export function getKoreanTime(): string {
    const koreanTimeOffset = 9 * 60; // 한국 표준시의 UTC 오프셋 (KST: UTC+9)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const koreanTime = new Date(utc + (koreanTimeOffset * 60 * 1000));
    
    const year = koreanTime.getFullYear();
    const month = koreanTime.getMonth() + 1;
    const date = koreanTime.getDate();
    const hours = koreanTime.getHours();
    const minutes = koreanTime.getMinutes();
    const seconds = koreanTime.getSeconds();
  
    return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} (KST)`;
  }