import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [stats, setStats] = useState({ total: 0, voted: 0, percentage: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/voted-count');
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      alert('코드를 입력하세요.');
      return;
    }

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    console.log(data);
    if (data.success) {
      router.push(`/candidates?code=${code}`);
    } else if (data == 'hibiki') {
      alert(data.message || '히비키쨩 다이스키');
    } else {
      alert(data.message || '코드가 유효하지 않습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem', textAlign: 'center' }}>
        제 5회 민주정우회 총선
      </h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#555', textAlign: 'center' }}>
        발급받은 코드를 입력하고 투표에 참여하세요
      </p>

      {/* 투표율 박스 */}
      <div style={{ marginBottom: '2rem', padding: '1rem 2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
          투표 진행 상황
        </p>
        <p style={{ margin: '5px 0', color: '#666' }}>
          {stats.voted}명 / {stats.total}명 ({stats.percentage}%)
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="코드를 입력하세요"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '20px',
            width: '250px',
            textAlign: 'center',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          투표 시작하기
        </button>
      </form>
    </div>
  );
}
