import '../styles/globals.css'; // 절대 경로 (alias) 대신 상대 경로로 수정

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
