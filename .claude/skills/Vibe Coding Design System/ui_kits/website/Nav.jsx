// Nav.jsx — white top navigation, esprow style
function Nav() {
  const { useState, useEffect } = React;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('capabilities');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); };
  const links = [
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'playbook', label: 'Playbook' },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100, background: '#fff',
      borderBottom: `1px solid ${scrolled ? 'var(--line-1)' : 'transparent'}`,
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      transition: 'all var(--dur) var(--ease-out)',
    }}>
      <div className="container" style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={22} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {links.map(l => (
            <a key={l.id} href={'#' + l.id} onClick={() => { setActive(l.id); }}
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase',
                padding: '10px 16px', color: active === l.id ? 'var(--slate-deep)' : 'var(--slate-mut)',
                borderBottom: `3px solid ${active === l.id ? 'var(--accent)' : 'transparent'}`,
                transition: 'all var(--dur-fast) var(--ease-out)',
              }}
              onMouseEnter={e => { if (active !== l.id) e.currentTarget.style.color = 'var(--slate)'; }}
              onMouseLeave={e => { if (active !== l.id) e.currentTarget.style.color = 'var(--slate-mut)'; }}
            >{l.label}</a>
          ))}
          <span style={{ width: 1, height: 24, background: 'var(--line-2)', margin: '0 14px' }}></span>
          <Button size="sm" variant="primary" icon="play" onClick={() => scrollTo('workflow')}>Run the demo</Button>
        </nav>
      </div>
    </header>
  );
}
window.Nav = Nav;
