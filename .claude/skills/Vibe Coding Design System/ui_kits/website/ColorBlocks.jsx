// ColorBlocks.jsx — esprow-style solid color panel row
function ColorBlocks() {
  const blocks = [
    { bg: 'var(--accent)', fg: '#fff', sub: 'rgba(255,255,255,0.82)', k: 'What changed', title: 'AI in the loop', body: "The team ships with agents drafting, reviewing and testing. We review intent, not boilerplate." },
    { bg: 'var(--slate)', fg: '#fff', sub: 'var(--on-dark-2)', k: 'Your workflow', title: 'Prompt to PR', body: 'One line of plain English becomes a planned, implemented, tested change in your review queue.' },
    { bg: 'var(--slate-deep)', fg: '#fff', sub: 'var(--on-dark-2)', k: 'Our agents', title: 'Review & automate', body: 'Security passes, test generation, docs and release chores run as agents — not manual toil.' },
    { bg: 'var(--bg-soft)', fg: 'var(--slate-deep)', sub: 'var(--slate-soft)', k: 'Get started', title: 'Run the playbook', body: null, cta: true },
  ];
  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid var(--line-1)' }}>
      {blocks.map((b, i) => (
        <div key={i} className="reveal" style={{ background: b.bg, color: b.fg, padding: '38px 30px 34px', minHeight: 250, display: 'flex', flexDirection: 'column', animationDelay: `${i * 0.06}s` }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: b.cta ? 'var(--accent)' : b.fg, opacity: b.cta ? 1 : 0.85 }}>{b.k}</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, lineHeight: 1.1, margin: '14px 0 0', color: b.fg }}>{b.title}</h3>
          {b.body && <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.55, color: b.sub, margin: '12px 0 0' }}>{b.body}</p>}
          <div style={{ flex: 1 }}></div>
          {b.cta ? (
            <div style={{ marginTop: 18 }}>
              <Button variant="primary" size="sm" icon="arrow-right">Open the playbook</Button>
            </div>
          ) : (
            <div aria-hidden style={{ marginTop: 22, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: b.fg, opacity: 0.5 }}>/{String(i + 1).padStart(2, '0')}</div>
          )}
        </div>
      ))}
    </section>
  );
}
window.ColorBlocks = ColorBlocks;
