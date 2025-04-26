import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ResultPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // 5초 후 홈으로 자동 이동
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>🎉 투표가 완료되었습니다!</h1>
      <p>참여해 주셔서 감사합니다.</p>
      <p>5초 후 메인 페이지로 이동합니다...</p>
    </div>
  );
}
