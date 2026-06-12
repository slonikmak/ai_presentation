// Icon.jsx — Lucide wrapper + brand Logo + Button (esprow-style)
function Icon({ name, size = 20, color, style }) {
  return (
    <span className="ico" style={{ fontSize: size, color: color || 'currentColor', lineHeight: 0, ...style }}>
      <i data-lucide={name}></i>
    </span>
  );
}

// "/VIBE CODING" wordmark — magenta slash, slate VIBE, light CODING.
// `onDark` flips text to white for use on slate panels.
function Logo({ size = 22, onDark = false, short = false }) {
  const word = onDark ? '#fff' : 'var(--slate-deep)';
  const sub = onDark ? 'rgba(255,255,255,0.7)' : 'var(--slate-soft)';
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size, letterSpacing: '-.01em', color: word, lineHeight: 1, whiteSpace: 'nowrap' }}>
      <span style={{ color: 'var(--accent)' }}>/</span>VIBE{!short && <span style={{ fontWeight: 300, color: sub }}>CODING</span>}
    </span>
  );
}

// Square, uppercase button. variant: primary | slate | ghost | link
function Button({ children, variant = 'primary', size = 'md', icon, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const pad = size === 'sm' ? '10px 16px' : size === 'lg' ? '16px 30px' : '13px 22px';
  const fs = size === 'sm' ? 12 : size === 'lg' ? 14 : 13;
  if (variant === 'link') {
    return (
      <a onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
          color: hover ? 'var(--accent)' : 'var(--blue)', ...style }}>
        <span style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid currentColor', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all var(--dur)' }}>
          <Icon name={icon || 'arrow-right'} size={16} />
        </span>
        {children}
      </a>
    );
  }
  const base = {
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: fs, lineHeight: 1,
    letterSpacing: '.06em', textTransform: 'uppercase', padding: pad,
    borderRadius: 'var(--r-xs)', border: '1px solid transparent', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap',
    transition: 'all var(--dur-fast) var(--ease-out)', transform: press ? 'scale(0.98)' : 'none',
  };
  const variants = {
    primary: { background: hover ? 'var(--accent-deep)' : 'var(--accent)', color: '#fff' },
    slate: { background: hover ? 'var(--slate-deep)' : 'var(--slate)', color: '#fff' },
    ghost: { background: hover ? 'var(--accent)' : 'transparent', color: hover ? '#fff' : 'var(--accent)', borderColor: 'var(--accent)' },
  };
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
      style={{ ...base, ...variants[variant], ...style }}>
      {icon && <Icon name={icon} size={fs + 3} />}
      {children}
    </button>
  );
}

window.Icon = Icon;
window.Logo = Logo;
window.Button = Button;
