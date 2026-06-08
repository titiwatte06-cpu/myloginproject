export const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .page-shell { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px 16px; background:#f5f5f5; font-family:'DM Sans','Helvetica Neue',sans-serif; }
  .auth-card { background:#fff; border-radius:20px; border:1px solid #e8e8e8; padding:40px 32px; width:100%; max-width:380px; box-shadow:0 4px 40px rgba(0,0,0,0.07); animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1); }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .field-wrap { display:flex; flex-direction:column; gap:6px; }
  .field-label { font-size:13px; font-weight:600; color:#1a1a1a; }
  .field-input { border:1.5px solid #e4e4e4; border-radius:10px; padding:11px 14px; font-size:14px; font-family:inherit; outline:none; background:#fafafa; color:#1a1a1a; transition:all 0.18s; width:100%; box-sizing:border-box; }
  .field-input:focus { border-color:#1a1a1a; background:#fff; box-shadow:0 0 0 3px rgba(0,0,0,0.06); }
  .field-input.has-error { border-color:#ff4d4d; background:#fff8f8; }
  .pass-wrap { position:relative; }
  .pass-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#777; font-size:12px; font-weight:700; font-family:inherit; padding:0; }
  .btn-primary { background:#1a1a1a; color:#fff; border:none; border-radius:10px; padding:13px; font-size:14px; font-weight:600; font-family:inherit; cursor:pointer; width:100%; transition:background 0.16s,transform 0.12s; }
  .btn-primary:hover { background:#333; transform:translateY(-1px); }
  .btn-primary:disabled { cursor:not-allowed; opacity:.65; transform:none; }
  .divider { display:flex; align-items:center; gap:12px; color:#aaa; font-size:12px; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:#ebebeb; }
  .btn-social { display:flex; align-items:center; justify-content:center; gap:10px; border:1.5px solid #e8e8e8; border-radius:10px; padding:11px; font-size:13.5px; font-weight:500; font-family:inherit; cursor:pointer; background:#fff; color:#1a1a1a; width:100%; transition:border-color 0.15s,background 0.15s,transform 0.12s; }
  .btn-social:hover { border-color:#bbb; background:#fafafa; transform:translateY(-1px); }
  .toggle-text { font-size:13px; color:#777; text-align:center; margin:0; }
  .toggle-link { color:#1a1a1a; font-size:13px; font-weight:50; cursor:pointer; text-decoration:none; background:none; border:none; font-family:inherit; padding:0; }
  .mode-switch { display:flex; background:#f2f2f2; border-radius:10px; padding:3px; gap:3px; margin-bottom:24px; }
  .mode-btn { flex:1; padding:8px; border:none; border-radius:8px; font-size:13px; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.2s; background:transparent; color:#777; }
  .mode-btn.active { background:#fff; color:#1a1a1a; box-shadow:0 1px 6px rgba(0,0,0,0.1); }
  .field-error { color:#d93025; font-size:12.5px; font-weight:500; margin:0; }
  .status { border-radius:10px; padding:10px 12px; font-size:13px; line-height:1.4; margin-bottom:16px; }
  .status.ok { background:#edf7ed; color:#1e6b35; }
  .status.bad { background:#fff2f0; color:#b42318; }
`
