// Hero.jsx — light editorial hero with slash motif + slate terminal panel
function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg)', borderBottom: '1px solid var(--line-1)' }}>
      {/* big translucent slash parallelograms */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '6%', width: 120, height: '150%', background: 'var(--slash-fill-dark)', transform: 'skewX(-20deg)' }}></div>
        <div style={{ position: 'absolute', top: '-20%', left: '13%', width: 36, height: '150%', background: 'rgba(43,51,64,0.04)', transform: 'skewX(-20deg)' }}></div>
        <div style={{ position: 'absolute', top: '-20%', left: '17.5%', width: 14, height: '150%', background: 'var(--accent-tint)', transform: 'skewX(-20deg)' }}></div>
      </div>

      <div className="container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center', padding: '96px 40px 92px' }}>
        <div>
          <div className="t-kicker slash reveal">Internal · AI in development · 2026</div>
          <h1 className="t-display reveal" style={{ marginTop: 22, marginBottom: 0, animationDelay: '.06s' }}>
            You write<br />the intent.<br />
            <span className="bold accent">AI writes</span><br />
            <span className="bold accent">the boilerplate.</span>
          </h1>
          <div className="reveal" style={{ marginTop: 28, paddingLeft: 18, borderLeft: '3px solid var(--accent)', maxWidth: 480, animationDelay: '.14s' }}>
            <p className="t-lead" style={{ margin: 0 }}>
              AI now drafts the first 80% — code, tests, reviews, docs. We spend our time
              on the 20% that's actually hard. Here's the workflow the team runs today.
            </p>
          </div>
          <div className="reveal" style={{ display: 'flex', gap: 12, marginTop: 36, animationDelay: '.22s' }}>
            <Button variant="primary" size="lg" icon="play"
              onClick={() => { const el = document.getElementById('workflow'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }}>
              Run the demo
            </Button>
            <Button variant="slate" size="lg" onClick={() => { const el = document.getElementById('capabilities'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }}>
              See capabilities
            </Button>
          </div>
        </div>

        <Terminal />
      </div>
    </section>
  );
}

function Terminal() {
  const { useState, useEffect } = React;
  const lines = [
    { p: '~/monorepo', cmd: 'vibe review --diff HEAD~1' },
    { out: 'reading 14 files · 2 packages', c: 'var(--on-dark-3)' },
    { out: '✓ no race conditions', c: '#5BE3A8' },
    { out: '! src/auth.ts:42 — missing null check', c: '#FFB454' },
    { out: '✓ 6 tests generated · coverage 71% → 94%', c: '#5BE3A8' },
    { out: 'opened PR #218 — ready for human review', c: '#6CB6FF' },
  ];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= lines.length) { const t = setTimeout(() => setShown(0), 2600); return () => clearTimeout(t); }
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 600 : 520);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div className="reveal" style={{ animationDelay: '.28s', background: 'var(--slate-deep)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }}></span>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FEBC2E' }}></span>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28C840' }}></span>
        <span style={{ marginLeft: 10, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--on-dark-3)' }}>vibe — zsh</span>
      </div>
      <div style={{ padding: '20px 20px 24px', fontFamily: 'var(--font-mono)', fontSize: 13.5, lineHeight: 1.85, minHeight: 250 }}>
        {lines.slice(0, shown).map((l, i) => (
          <div key={i}>
            {l.cmd ? (
              <span><span style={{ color: 'var(--accent-bright)' }}>{l.p} </span><span style={{ color: 'var(--on-dark-3)' }}>$ </span><span style={{ color: '#fff' }}>{l.cmd}</span></span>
            ) : (<span style={{ color: l.c }}>{l.out}</span>)}
          </div>
        ))}
        {shown < lines.length && <span className="caret"></span>}
      </div>
    </div>
  );
}
window.Hero = Hero;
