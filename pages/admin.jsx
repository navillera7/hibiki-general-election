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
  const [leeResults, setLeeResults] = useState([]);
  const [JungResults, setJungResults] = useState([]);
  const [GaehunResults, setGaehunResults] = useState([]);
  const [JungDownResults, setJungDownResults] = useState([]);

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
      fetch('/api/lee-summary')
        .then(res => res.json())
        .then(setLeeResults);
      fetch('/api/jung-summary')
        .then(res => res.json())
        .then(setJungResults);
      fetch('/api/gaehun-summary')
        .then(res => res.json())
        .then(setGaehunResults);
      fetch('/api/JungDown-summary')
        .then(res => res.json())
        .then(setJungDownResults);
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

      <section>
        <h2>이재명 국정 지지도</h2>
        {agendaResults.length === 0 ? (
          <p>이 후보에 대한 투표 결과가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leeResults} {...chartStyle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#d32f2f" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="count" position="top" style={{ fill: '#333', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

      </section>

      <section>
        <h2>정청래 지도부 지지도</h2>
        {agendaResults.length === 0 ? (
          <p>정 후보에 대한 투표 결과가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={JungResults} {...chartStyle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#fbc02d" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="count" position="top" style={{ fill: '#333', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

      </section>
      <section>
        <h2>개헌 찬반 투표 결과</h2>
        {agendaResults.length === 0 ? (
          <p>개헌에 대한 투표 결과가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={GaehunResults} {...chartStyle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#7b1fa2" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="count" position="top" style={{ fill: '#333', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

      </section>
      <section>
        <h2>정청래 지선 전 사퇴 필요성 투표 결과</h2>
        {agendaResults.length === 0 ? (
          <p>정청래 하락 필요성에 대한 투표 결과가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={JungDownResults} {...chartStyle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0097a7" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="count" position="top" style={{ fill: '#333', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

      </section>
    </div>
  );
}
