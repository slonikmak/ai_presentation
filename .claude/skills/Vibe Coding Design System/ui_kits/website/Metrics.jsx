// Metrics.jsx — light stat band
function Metrics() {
  const stats = [
    { label: 'Merged PRs / wk', value: '218', delta: '+38%' },
    { label: 'Avg review time', value: '4m', delta: '−61%' },
    { label: 'Test coverage', value: '94%', delta: '+23pt' },
    { label: 'Repos in pipeline', value: '12', delta: 'one config' },
  ];
  return (
    <section style={{ borderBottom: '1px solid var(--line-1)', background: 'var(--bg)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
        {stats.map((s, i) => (
          <div key={i} className="reveal" style={{ padding: '40px 28px', borderLeft: i === 0 ? 'none' : '1px solid var(--line-1)', animationDelay: `${i * 0.05}s` }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 46, letterSpacing: '-.02em', lineHeight: 1, color: 'var(--slate-deep)' }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--slate-mut)', marginTop: 14 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)', marginTop: 7 }}>{s.delta}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
window.Metrics = Metrics;
