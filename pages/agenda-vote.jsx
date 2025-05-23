// /pages/agenda-vote.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';

const choices = [
  { id: 'yes', label: '찬성' },
  { id: 'no', label: '반대' },
  { id: 'abstain', label: '기권' },
];

export default function AgendaVotePage() {
  const router = useRouter();
  const { code } = router.query;
  const [selected, setSelected] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selected) {
      alert('한 가지 선택을 해주세요.');
      return;
    }

    setSubmitting(true);

    const res = await fetch('/api/agenda-vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, vote: selected }),
    });

    const data = await res.json();
    if (data.success) {
      router.push('/thank-you');
    } else {
      alert(data.message || '투표 실패');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>안건에 대한 찬반 투표</h1>
      <p>해당 안건에 대해 어떻게 생각하시나요?</p>

      {choices.map((c) => (
        <div key={c.id} style={{ marginBottom: '12px' }}>
          <label style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="agenda-vote"
              value={c.id}
              checked={selected === c.id}
              onChange={() => setSelected(c.id)}
            />{' '}
            {c.label}
          </label>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting || !selected}
        style={{ marginTop: 20, padding: '10px 20px' }}
      >
        제출하기
      </button>
    </div>
  );
}
