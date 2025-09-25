// /pages/vote.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import candidates from '@/lib/candidates';

const pmChoices = [
  { id: '박시이', label: '박시이' },
  { id: '돌돔', label: '돌돔' },
  { id: 'abstain', label: '기권' },
];

export default function CombinedVotePage() {
  const router = useRouter();
  const { code } = router.query;

  // 후보 3표 배분
  const [votes, setVotes] = useState(() => {
    const init = {};
    candidates.forEach((c) => { init[c.id] = 0; });
    return init;
  });
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const [alertVisible, setAlertVisible] = useState(false);

  // 총리 1표
  const [pmVote, setPmVote] = useState('');

  // 제출 상태
  const [submitting, setSubmitting] = useState(false);

  const handleVoteChange = (id, delta) => {
    if (delta > 0 && totalVotes >= 3) return;
    if (votes[id] + delta < 0) return;
    setVotes({ ...votes, [id]: votes[id] + delta });
  };

  const handleSubmitAll = async () => {
    if (totalVotes !== 3) {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 2500);
      return;
    }
    if (!pmVote) {
      alert('총리 후보를 한 명 선택해 주세요.');
      return;
    }

    try {
      setSubmitting(true);

      // 1) 후보 3표 먼저 제출 (/api/vote) — 기존 candidates.jsx 흐름 재사용:contentReference[oaicite:2]{index=2}
      const res1 = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, votes }),
      });
      const data1 = await res1.json();
      if (!data1.success) {
        setSubmitting(false);
        alert(data1.message || '후보 투표 제출 중 오류가 발생했어요.');
        return;
      }

      // 2) 총리 1표 제출 (/api/agenda-vote) — 기존 agenda-vote.jsx 흐름 재사용:contentReference[oaicite:3]{index=3}
      const res2 = await fetch('/api/agenda-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, vote: pmVote }),
      });
      const data2 = await res2.json();
      if (!data2.success) {
        setSubmitting(false);
        alert(data2.message || '총리 투표 제출 중 오류가 발생했어요.');
        return;
      }

      // 3) 결과 페이지로
      router.push('/result');
    } catch (e) {
      console.error(e);
      setSubmitting(false);
      alert('네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 720, margin: '0 auto' }}>
      <h1>통합 투표 페이지</h1>

      {/* 섹션 1: 후보 투표 (3표) */}
      <section style={{ marginTop: 24 }}>
        <h2>후보를 선택하세요 (총 3표)</h2>

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
          <div key={c.id} style={{
            border: '1px solid #ccc',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{c.name}</strong>
              <p style={{ margin: '5px 0', color: '#666' }}>{c.slogan}</p>
            </div>
            <div>
              <button onClick={() => handleVoteChange(c.id, -1)} disabled={votes[c.id] === 0}>-</button>
              <span style={{ margin: '0 10px' }}>{votes[c.id]} 표</span>
              <button onClick={() => handleVoteChange(c.id, 1)} disabled={totalVotes >= 3}>+</button>
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'right', color: '#666' }}>사용한 표: {totalVotes}/3</div>
      </section>

      {/* 섹션 2: 총리 투표 (1표 라디오) */}
      <section style={{ marginTop: 32 }}>
        <h2>총리 투표</h2>
        {pmChoices.map((c) => (
          <div key={c.id} style={{ marginBottom: 12 }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="pm-vote"
                value={c.id}
                checked={pmVote === c.id}
                onChange={() => setPmVote(c.id)}
              />{' '}
              {c.label}
            </label>
          </div>
        ))}
      </section>

      <button
        onClick={handleSubmitAll}
        disabled={submitting}
        style={{ marginTop: 24, padding: '10px 20px' }}
      >
        {submitting ? '제출 중…' : '최종 제출'}
      </button>
    </div>
  );
}
