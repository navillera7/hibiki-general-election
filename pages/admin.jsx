// /pages/admin.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';

export default function AdminPage() {
  const router = useRouter();
  const [candidateResults, setCandidateResults] = useState([]);
  const [agendaResults, setAgendaResults] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin') !== 'true') {
      router.push('/admin-login');
    } else {
      fetch('/api/vote-summary')
        .then(res => res.json())
        .then(setCandidateResults);

      fetch('/api/agenda-summary')
        .then(res => res.json())
        .then(setAgendaResults);
    }
  }, []);

  const chartStyle = {
    margin: { top: 20, right: 30, left: 20, bottom: 5 },
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>투표 현황</h1>

      <section style={{ marginBottom: 50 }}>
        <h2>정당 투표 결과</h2>
        {candidateResults.length === 0 ? (
          <p>후보자에 대한 투표 결과가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={candidateResults} {...chartStyle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1976d2" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="count" position="top" style={{ fill: '#333', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section>
        <h2>총리 투표 결과</h2>
        {agendaResults.length === 0 ? (
          <p>안건에 대한 투표 결과가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agendaResults} {...chartStyle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2e7d32" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="count" position="top" style={{ fill: '#333', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}
