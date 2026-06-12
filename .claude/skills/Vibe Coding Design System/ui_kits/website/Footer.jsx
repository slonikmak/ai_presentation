// Footer.jsx — esprow-style light footer
function Footer() {
  const cols = [
    { h: 'Capabilities', items: ['Code generation', 'Automated review', 'Process automation', 'Security & lint'] },
    { h: 'Workflow', items: ['Prompt to PR', 'Test generation', 'Docs from diffs', 'Local-first agents'] },
    { h: 'Team', items: ['Playbook', 'Prompt library', 'Agent configs', 'CI templates'] },
    { h: 'Connect', items: ['#vibe-coding', 'Office hours', 'Request a demo', 'Feedback'] },
  ];
  const social = ['github', 'message-square', 'mail', 'linkedin'];
  return (
    <footer style={{ background: 'var(--bg-soft)' }}>
      {/* top utility strip */}
      <div style={{ borderTop: '1px solid var(--line-1)', borderBottom: '1px solid var(--line-1)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18, padding: '22px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--slate-soft)' }}>Sign up for the weekly digest:</span>
            <div style={{ display: 'flex' }}>
              <input placeholder="you@team.dev" style={{ border: '1px solid var(--line-2)', borderRight: 'none', borderRadius: 0, padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--slate-deep)', outline: 'none', width: 200 }} />
              <Button variant="slate" size="sm" style={{ borderRadius: 0 }}>Subscribe</Button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--slate-soft)' }}>Stay connected:</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {social.map(s => (
                <a key={s} href="#" style={{ width: 34, height: 34, background: 'var(--slate)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--r-xs)', transition: 'background var(--dur-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--slate)'}>
                  <Icon name={s} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* link columns */}
      <div className="container" style={{ padding: '56px 40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr repeat(4,1fr)', gap: 36 }}>
          <div>
            <Logo size={22} />
            <p className="t-body" style={{ fontSize: 14.5, marginTop: 16, maxWidth: 280 }}>
              An internal playbook for shipping with AI in the loop. Built by the team, for the team.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div className="t-label" style={{ paddingBottom: 10, borderBottom: '2px solid var(--slate-deep)', display: 'inline-block', marginBottom: 16 }}>{col.h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.items.map(it => (
                  <a key={it} href="#" style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--slate-soft)', transition: 'color var(--dur-fast)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--slate-soft)'}>{it}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 48, paddingTop: 22, borderTop: '1px solid var(--line-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--slate-mut)' }}>AUTOMATION / REVIEW / TESTING · 2026</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--slate-mut)' }}>internal use only</span>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
