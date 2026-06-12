// Capabilities.jsx — esprow-style product cards + compact capability grid
function Capabilities() {
  const products = [
    { icon: 'sparkles', title: 'Code generation', body: 'Describe the change in plain English. Agents plan, edit across files, and implement against your conventions.', cta: 'Explore generation', tone: 'slate' },
    { icon: 'git-pull-request', title: 'Automated review', body: 'A second agent reviews every diff for bugs, security and style, then writes the tests to prove it.', cta: 'See review in action', tone: 'accent' },
    { icon: 'workflow', title: 'Process automation', body: 'Release notes, changelogs, dependency bumps and triage run as scheduled agents — not manual chores.', cta: 'Browse automations', tone: 'deep' },
  ];
  const more = [
    { icon: 'shield-check', title: 'Security & lint pass', body: 'Static analysis plus an LLM second opinion on auth, secrets and injection paths.' },
    { icon: 'book-open', title: 'Docs that follow code', body: 'READMEs and API docs regenerate from the merged diff, so they never drift.' },
    { icon: 'cpu', title: 'Local-first agents', body: 'Everything runs against your repo in a sandbox. No code leaves the perimeter.' },
  ];

  return (
    <section id="capabilities" style={{ padding: '92px 0', borderBottom: '1px solid var(--line-1)' }}>
      <div className="container">
        <div className="reveal" style={{ maxWidth: 720, marginBottom: 44 }}>
          <div className="t-kicker slash">What it does</div>
          <h2 className="t-h1" style={{ marginTop: 16, marginBottom: 16 }}>
            <span className="light">Three pillars,</span> built<br />on the same agents.
          </h2>
          <Button variant="link" icon="arrow-right">Explore the full capability map</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {products.map((p, i) => <ProductCard key={p.title} {...p} delay={i * 0.07} />)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginTop: 18 }}>
          {more.map((c, i) => <CapCard key={c.title} {...c} delay={i * 0.06} />)}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ icon, title, body, cta, tone, delay }) {
  const [h, setH] = React.useState(false);
  const bg = tone === 'accent' ? 'var(--accent)' : tone === 'deep' ? 'var(--slate-deep)' : 'var(--slate)';
  return (
    <div className="reveal" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      position: 'relative', overflow: 'hidden', background: bg, color: '#fff',
      padding: 30, minHeight: 270, display: 'flex', flexDirection: 'column',
      borderRadius: 'var(--r-xs)', animationDelay: `${delay}s`,
      transition: 'transform var(--dur) var(--ease-out)', transform: h ? 'translateY(-3px)' : 'none',
    }}>
      {/* slash motif */}
      <div aria-hidden style={{ position: 'absolute', top: '-20%', right: 30, width: 60, height: '150%', background: 'rgba(255,255,255,0.07)', transform: 'skewX(-20deg)' }}></div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Icon name={icon} size={30} color="#fff" style={{ opacity: 0.95 }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 25, margin: '20px 0 10px' }}>{title}</h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.55, color: 'var(--on-dark-2)', margin: 0 }}>{body}</p>
        <div style={{ flex: 1 }}></div>
        <span style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff' }}>
          {cta} <Icon name="arrow-right" size={15} style={{ transform: h ? 'translateX(4px)' : 'none', transition: 'transform var(--dur)' }} />
        </span>
      </div>
    </div>
  );
}

function CapCard({ icon, title, body, delay }) {
  const [h, setH] = React.useState(false);
  return (
    <div className="reveal" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: '#fff', borderTop: '3px solid var(--accent)', border: '1px solid var(--line-1)', borderTopColor: 'var(--accent)',
      padding: 26, animationDelay: `${delay}s`, boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transition: 'box-shadow var(--dur) var(--ease-out)', borderRadius: 'var(--r-xs)',
    }}>
      <Icon name={icon} size={24} color="var(--slate)" />
      <h3 className="t-h3" style={{ fontSize: 19, marginTop: 16, marginBottom: 8 }}>{title}</h3>
      <p className="t-body" style={{ margin: 0, fontSize: 14.5 }}>{body}</p>
    </div>
  );
}
window.Capabilities = Capabilities;
