import { useState } from 'react';
import { useRouter } from 'next/router';
import candidates from '@/lib/candidates';

export default function CandidatesPage() {
  const router = useRouter();
  const { code } = router.query;

  const initialVotes = {};
  candidates.forEach((c) => {
    initialVotes[c.id] = 0;
  });

  const [votes, setVotes] = useState(initialVotes);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVoteChange = (id, delta) => {
    if (delta > 0 && totalVotes >= 3) return;
    if (votes[id] + delta < 0) return;

    setVotes({
      ...votes,
      [id]: votes[id] + delta,
    });
  };

  const handleSubmit = async () => {
    if (totalVotes !== 3) {
      alert('정확히 3표를 모두 사용해야 합니다!');
      return;
    }

    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, votes }),
    });

    
    const data = await res.json();
    console.log('서버 응답:', data); // 추가
    if (data.success) {
      router.push('/result');
    } else {
      alert(data.message || '투표 오류 발생');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>후보를 선택하세요 (총 3표)</h1>
  
      {candidates.map((c) => (
  <div key={c.id} className="candidate-card">
    <div style={{ flex: 1 }}>
      <span className="candidate-name">{c.name}</span>
      <p style={{ marginTop: '0.3rem', fontSize: '0.9rem', color: '#666' }}>
        {c.slogan}
      </p>
    </div>
    <div className="vote-controls">
      <button
        className="vote-button"
        onClick={() => handleVoteChange(c.id, -1)}
        disabled={votes[c.id] === 0}
      >
        -
      </button>
      <span className="vote-count">{votes[c.id]} 표</span>
      <button
        className="vote-button"
        onClick={() => handleVoteChange(c.id, 1)}
        disabled={totalVotes >= 3}
      >
        +
      </button>
    </div>
  </div>
))}
  
      <br />
      <button onClick={handleSubmit} disabled={totalVotes !== 3}>
        투표 제출
      </button>
    </div>
  );
  
  
}
