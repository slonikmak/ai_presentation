// Workflow.jsx — interactive 4-step pipeline (light theme)
function Workflow() {
  const { useState, useEffect } = React;
  const steps = [
    { n: '01', key: 'prompt', icon: 'sparkles', title: 'You write the intent', desc: 'One line of plain English. No scaffolding, no prompt engineering.', kind: 'prompt' },
    { n: '02', key: 'draft', icon: 'code', title: 'Agent drafts the change', desc: 'It plans, edits across files, and implements against your conventions.', kind: 'diff' },
    { n: '03', key: 'review', icon: 'git-pull-request', title: 'AI reviews itself', desc: 'A second agent reviews for bugs, security and style, then writes tests.', kind: 'review' },
    { n: '04', key: 'merge', icon: 'git-merge', title: 'You approve & merge', desc: 'A clean PR lands in your queue. Read 40 lines instead of writing 400.', kind: 'merge' },
  ];
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (active >= steps.length - 1) { const t = setTimeout(() => setPlaying(false), 1800); return () => clearTimeout(t); }
    const t = setTimeout(() => setActive(a => a + 1), 1900);
    return () => clearTimeout(t);
  }, [playing, active]);

  return (
    <section id="workflow" style={{ padding: '92px 0', background: 'var(--bg-soft)', borderBottom: '1px solid var(--line-1)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 46 }}>
          <div className="reveal">
            <div className="t-kicker slash">The workflow</div>
            <h2 className="t-h1" style={{ marginTop: 16, marginBottom: 0 }}><span className="light">From prompt</span> to merged PR.</h2>
          </div>
          <Button variant="primary" icon={playing ? 'loader' : 'play'} onClick={() => { setActive(0); setPlaying(true); }}>
            {playing ? 'Running…' : 'Run the demo'}
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 28, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((s, i) => {
              const on = i === active, done = i < active;
              return (
                <button key={s.key} onClick={() => { setPlaying(false); setActive(i); }} style={{
                  textAlign: 'left', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'flex-start', padding: 18,
                  background: on ? '#fff' : 'transparent',
                  border: '1px solid', borderColor: on ? 'var(--line-1)' : 'transparent',
                  borderLeft: `3px solid ${on ? 'var(--accent)' : 'transparent'}`,
                  boxShadow: on ? 'var(--shadow-md)' : 'none', borderRadius: 'var(--r-xs)',
                  transition: 'all var(--dur) var(--ease-out)',
                }}>
                  <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 'var(--r-xs)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: on || done ? 'var(--accent)' : 'var(--bg-tint)', color: on || done ? '#fff' : 'var(--slate-mut)',
                    transition: 'all var(--dur) var(--ease-out)' }}>
                    <Icon name={done ? 'check' : s.icon} size={19} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: on ? 'var(--accent)' : 'var(--slate-faint)' }}>{s.n}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, lineHeight: 1.25, color: on ? 'var(--slate-deep)' : 'var(--slate-soft)' }}>{s.title}</span>
                    </span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, color: 'var(--slate-mut)', marginTop: 6 }}>{s.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <WorkflowPanel kind={steps[active].kind} />
        </div>
      </div>
    </section>
  );
}

function WorkflowPanel({ kind }) {
  const title = kind === 'prompt' ? 'prompt' : kind === 'diff' ? 'auth.ts — diff' : kind === 'review' ? 'vibe review' : 'PR #218';
  return (
    <div style={{ background: 'var(--slate-deep)', borderRadius: 'var(--r-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 380, boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Icon name="terminal" size={15} color="var(--on-dark-3)" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--on-dark-3)' }}>{title}</span>
      </div>
      <div style={{ padding: 22, fontFamily: 'var(--font-mono)', fontSize: 13.5, lineHeight: 1.85, flex: 1, color: '#fff' }}>
        {kind === 'prompt' && (
          <div><span style={{ color: 'var(--on-dark-3)' }}>$ </span><span>vibe "add rate limiting to the login endpoint, 5 tries / min, return 429"</span><span className="caret"></span></div>
        )}
        {kind === 'diff' && (
          <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', color: 'var(--on-dark-2)' }}>
{`  export async function login(req, res) {
`}<span style={{ color: '#5BE3A8', background: 'rgba(91,227,168,0.12)', display: 'block' }}>{`+   const ok = await limiter.check(req.ip, 5, '1m')
+   if (!ok) return res.status(429).json({ error: 'slow down' })`}</span>{`    const user = await auth.verify(req.body)
    return res.json({ token: sign(user) })
  }`}
          </pre>
        )}
        {kind === 'review' && (
          <div>
            <div style={{ color: 'var(--on-dark-3)' }}>reading diff · 1 file · +3 −0</div>
            <div style={{ color: '#5BE3A8' }}>✓ logic correct — 429 on 6th attempt</div>
            <div style={{ color: '#5BE3A8' }}>✓ no secrets, no injection paths</div>
            <div style={{ color: '#FFB454' }}>! limiter not reset on success — fix applied</div>
            <div style={{ color: '#5BE3A8' }}>✓ generated 4 tests · coverage 88% → 96%</div>
          </div>
        )}
        {kind === 'merge' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6CB6FF' }}><Icon name="git-pull-request" size={15} /> PR #218 · rate-limit-login</div>
            <div style={{ color: 'var(--on-dark-3)', marginTop: 10 }}>5 files · +28 −2 · 4 tests · 1 reviewer</div>
            <div style={{ marginTop: 18 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--r-xs)', background: 'rgba(91,227,168,0.14)', color: '#5BE3A8' }}>✓ ALL CHECKS PASSED</span>
            </div>
            <div style={{ marginTop: 20 }}><Button variant="primary" size="sm" icon="git-merge">Squash &amp; merge</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}
window.Workflow = Workflow;
