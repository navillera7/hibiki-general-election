// /pages/vote.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import candidates from '@/lib/candidates';

const pmChoices = [
  { id: '피바', label: '피바' },
  { id: '돌돔', label: '돌돔' },
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

  // 모달(공약/상세)
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // 제출 상태
  const [submitting, setSubmitting] = useState(false);

  const handleVoteChange = (id, delta) => {
    if (delta > 0 && totalVotes >= 3) return;
    if ((votes[id] ?? 0) + delta < 0) return;
    setVotes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + delta }));
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

      // 1) 후보 3표 먼저 제출 (/api/vote) — 기존 구현 재활용:contentReference[oaicite:1]{index=1}
      const res1 = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, votes }),
      });
      const data1 = await res1.json();
      if (!data1.success) throw new Error(data1.message || '후보 투표 제출 오류');

      // 2) 총리 1표 제출 (/api/agenda-vote) — 기존 구현 재활용:contentReference[oaicite:2]{index=2}
      const res2 = await fetch('/api/agenda-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, vote: pmVote }),
      });
      const data2 = await res2.json();
      if (!data2.success) throw new Error(data2.message || '총리 투표 제출 오류');

      // 3) 결과 페이지로
      router.push('/result');
    } catch (e) {
      console.error(e);
      alert(e.message || '네트워크/서버 오류가 발생했어요. 다시 시도해 주세요.');
      setSubmitting(false);
    }
  };

  // ESC로 모달 닫기 (선택)
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedCandidate(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{ padding: 40, maxWidth: 760, margin: '0 auto' }}>
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
          <div
            key={c.id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedCandidate(c)} // 카드 클릭 → 상세 모달
          >
            <div>
              <strong>{c.name}</strong>
              <p style={{ margin: '5px 0', color: '#666' }}>{c.slogan}</p>
            </div>
            <div onClick={(e) => e.stopPropagation() /* 버튼 클릭 시 모달 방지 */}>
              <button onClick={() => handleVoteChange(c.id, -1)} disabled={(votes[c.id] ?? 0) === 0}>-</button>
              <span style={{ margin: '0 10px' }}>{votes[c.id] ?? 0} 표</span>
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

      {/* 후보 상세(공약) 모달 */}
      {selectedCandidate && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCandidate(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: 12, padding: 28, maxWidth: 520,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <h2 style={{ marginTop: 0 }}>{selectedCandidate.name}</h2>
            <p><strong>{selectedCandidate.slogan}</strong></p>
            <div style={{ marginTop: 12, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {/* detail(신규) 우선, 없으면 details(구버전) 사용 */}
              {selectedCandidate?.details || '공약 정보가 아직 없습니다.'}
            </div>
            <button
              onClick={() => setSelectedCandidate(null)}
              style={{
                marginTop: 18, padding: '10px 20px',
                backgroundColor: '#1976d2', color: 'white',
                border: 'none', borderRadius: 6, cursor: 'pointer'
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
