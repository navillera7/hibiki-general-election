import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import candidates from '@/lib/candidates';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';

export default function AdminPage() {
  const router = useRouter();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin') !== 'true') {
      router.push('/admin-login');
    } else {
      fetchResults();
    }
  }, []);

  const fetchResults = async () => {
    const res = await fetch('/api/vote-summary');
    const data = await res.json();
    setResults(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/admin-login');
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>투표 결과</h1>

      <button
        onClick={handleLogout}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'background-color 0.3s ease',
        }}
      >
        로그아웃
      </button>

      {results.length === 0 ? (
        <p>아직 투표 결과가 없습니다.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={results}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            {/* 여기: Legend 제거 */}
            <Bar dataKey="count" fill="#1976d2" radius={[8, 8, 0, 0]}>
              {/* 여기: LabelList로 득표수 표시 */}
              <LabelList dataKey="count" position="top" style={{ fill: '#333', fontSize: 14, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
