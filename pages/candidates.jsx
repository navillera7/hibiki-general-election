import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import candidates from '@/lib/candidates';

export default function CandidatesPage() {
  const router = useRouter();
  const { code } = router.query;

  const [votes, setVotes] = useState(() => {
    const initial = {};
    candidates.forEach((c) => {
      initial[c.id] = 0;
    });
    return initial;
  });

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
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
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, votes }),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/agenda-vote?code=${code}`);
    } else {
      alert(data.message || '투표 오류 발생');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>후보를 선택하세요 (총 3표)</h1>

      {alertVisible && (
        <div style={{
          backgroundColor: '#fdecea',
          color: '#d32f2f',
          padding: '12px 20px',
          marginBottom: '20px',
          border: '1px solid #f5c2c0',
          borderRadius: '6px'
        }}>
          정확히 3표를 모두 사용해야 합니다!
        </div>
      )}

      {candidates.map((c) => (
        <div
          key={c.id}
          className="candidate-card"
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '10px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onClick={() => setSelectedCandidate(c)}
        >
          <div>
            <strong>{c.name}</strong>
            <p style={{ margin: '5px 0', color: '#666' }}>{c.slogan}</p>
          </div>
          <div className="vote-controls">
            <button onClick={(e) => { e.stopPropagation(); handleVoteChange(c.id, -1); }} disabled={votes[c.id] === 0}>-</button>
            <span style={{ margin: '0 10px' }}>{votes[c.id]} 표</span>
            <button onClick={(e) => { e.stopPropagation(); handleVoteChange(c.id, 1); }} disabled={totalVotes >= 3}>+</button>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={totalVotes > 3}
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
        투표 제출
      </button>

      {selectedCandidate && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '500px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <h2>{selectedCandidate.name}</h2>
            <p><strong>{selectedCandidate.slogan}</strong></p>
            <p style={{ marginTop: '15px' , whiteSpace: 'pre-line'}}>{selectedCandidate.details}</p>
            <button
              onClick={() => setSelectedCandidate(null)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
