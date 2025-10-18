import React, { useEffect, useState, useRef } from "react";

// CHRONOS X — Google Sign-In + view-only Future Projects
// Changes per user's latest request:
// - Title changed to "CHRONOS X"
// - ECG Module removed and replaced with Radar Detection System
// - Visible "Log in with Google" button added (calls GSI prompt when CLIENT_ID is set; falls back to a demo name prompt)
// - Fixed image variable names

const CLIENT_ID = "REPLACE_WITH_YOUR_GOOGLE_OAUTH_CLIENT_ID"; // <-- put your Google OAuth 2.0 Client ID here

export default function BITWATCHV2() {
  const talhaImg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect rx='20' width='400' height='400' fill='%236c5ce7'/><text x='50%' y='55%' font-size='120' fill='white' text-anchor='middle' font-family='Poppins'>T</text></svg>`;
  const ashharImg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect rx='12' width='300' height='300' fill='%23ffb86b'/><text x='50%' y='55%' font-size='80' fill='white' text-anchor='middle' font-family='Poppins'>A</text></svg>`;
  const sulemanImg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect rx='12' width='300' height='300' fill='%2393e1a6'/><text x='50%' y='55%' font-size='80' fill='white' text-anchor='middle' font-family='Poppins'>S</text></svg>`;

  // auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const googleButtonRef = useRef(null);

  // View-only future projects (example spoilers). These cannot be edited in the UI.
  const [projects] = useState(() => {
    return [
      { id: 1, title: "Gesture-based Controls", desc: "Control music and calls using wrist gestures." },
      { id: 2, title: "Sleep Stage Detection", desc: "Use sensors to infer sleep stages and give sleep quality reports." },
      { id: 3, title: "Offline Navigation", desc: "Lightweight route guidance synced from phone, for running/biking." },
    ];
  });

  const [showProjects, setShowProjects] = useState(false);

  // load Google Identity Services script and render button (if CLIENT_ID provided)
  useEffect(() => {
    if (!CLIENT_ID || CLIENT_ID === "REPLACE_WITH_YOUR_GOOGLE_OAUTH_CLIENT_ID") return; // skip if not configured

    const existing = document.getElementById("google-identity");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.id = "google-identity";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
        });
        if (googleButtonRef.current) {
          google.accounts.id.renderButton(googleButtonRef.current, { theme: "outline", size: "medium", type: "standard" });
        }
      }
    };

    return () => {
      const s = document.getElementById("google-identity");
      if (s) s.remove();
    };
  }, []);

  function handleCredentialResponse(response) {
    try {
      const payload = JSON.parse(atob(response.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      setUserName(payload.name || payload.email || "User");
      setIsLoggedIn(true);
    } catch (e) {
      setUserName("User");
      setIsLoggedIn(true);
    }
  }

  function logout() {
    setIsLoggedIn(false);
    setUserName("");
  }

  function handleGoogleLoginClick() {
    // If GSI is available, prompt; otherwise fallback to simple prompt for demo
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.prompt();
      return;
    }
    const name = prompt('Demo login: enter your name');
    if (name) {
      setUserName(name);
      setIsLoggedIn(true);
    }
  }

  return (
    <div style={styles.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap'); *{box-sizing:border-box;} body{margin:0;background:linear-gradient(to bottom,#0f1724,#071025);font-family:Poppins,sans-serif;color:#e6eef8;}`}</style>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoTitle}>
            <img src={talhaImg} alt="logo" style={styles.logo} />

            {/* Rounded rectangle title (pill) with more rounded corners */}
            <div style={{ ...styles.titlePill, borderRadius: 999 }}>
              <h1 style={styles.h1}>CHRONOS X</h1>
            </div>
          </div>

          <div>
            {isLoggedIn ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ color: '#94a3b8' }}>Hi, {userName}</div>
                <button onClick={logout} style={styles.ghostBtn}>Log out</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* If CLIENT_ID configured the GSI button will render into googleButtonRef; otherwise use fallback button */}
                <div ref={googleButtonRef} />
                <button onClick={handleGoogleLoginClick} style={styles.loginFallbackBtn}>Log in with Google</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h2 style={styles.heroTitle}>
              The <span style={styles.highlight}>Future</span> of Tech<br />on Your <span style={styles.highlight}>Wrist</span>
            </h2>

            <img
              src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='420'><rect rx='28' width='900' height='420' fill='%231b2430'/><text x='50%' y='50%' font-size='30' text-anchor='middle' fill='%236c5ce7' font-family='Poppins'>CHRONOS X MOCKUP</text></svg>`}
              alt="CHRONOS X"
              style={styles.heroImage}
            />

            {isLoggedIn && (
              <div style={{ marginTop: 18 }}>
                <button style={styles.primaryBtn} onClick={() => setShowProjects(true)}>Future Projects</button>
              </div>
            )}

            {!isLoggedIn && CLIENT_ID === "REPLACE_WITH_YOUR_GOOGLE_OAUTH_CLIENT_ID" && (
              <div style={{ marginTop: 12, color: '#94a3b8' }}>To enable Google Sign-In, replace <code>CLIENT_ID</code> with your Google OAuth client ID.</div>
            )}

          </div>
        </section>

        <section style={styles.featuresSection}>
          <div style={styles.featuresGrid}>
            <div style={{ ...styles.featureCard, border: '1px solid rgba(108,92,231,0.14)' }}>
              <div style={styles.featureIcon}>☁️</div>
              <h3>Smart Weather Detection</h3>
              <p style={styles.featureDesc}>(Displays on device — not live in this demo.)</p>
            </div>

            <div style={{ ...styles.featureCard, border: '1px solid rgba(108,92,231,0.14)' }}>
              <div style={styles.featureIcon}>❤️</div>
              <h3>Health Tracker</h3>
              <p style={styles.featureDesc}>Heart rate monitoring (device-integrated).</p>
            </div>

            <div style={{ ...styles.featureCard, border: '1px solid rgba(108,92,231,0.14)' }}>
              <div style={styles.featureIcon}>📡</div>
              <h3>Radar Detection System</h3>
              <p style={styles.featureDesc}>Device-integrated radar detection for nearby signal visualization.</p>
            </div>

          </div>
        </section>

        <section style={styles.teamSection}>
          <div style={styles.teamBadge}>Innovation Team</div>

          <div style={styles.teamGrid}>
            <div style={styles.talhaCard}>
              <img src={talhaImg} alt="Talha" style={styles.talhaImg} />
              <div style={styles.talhaName}>Talha Khan</div>
            </div>

            <div style={styles.ashharCard}>
              <img src={ashharImg} alt="Ashhar" style={styles.memberImgLarge} />
              <div style={styles.memberName}>Ashhar Zeeshan</div>
            </div>

            <div style={styles.sulemanCard}>
              <img src={sulemanImg} alt="Suleman" style={styles.memberImgLarge} />
              <div style={styles.memberName}>Suleman Khan</div>
            </div>

          </div>
        </section>

      </main>

      <footer style={styles.footer}>
        <div style={{ color: '#94a3b8', fontSize: 13 }}>Built with ❤️ by Talha — replace images & API keys to make it live.</div>
      </footer>

      {/* Projects modal (view-only) */}
      {showProjects && (
        <div style={styles.modalBackdrop} onClick={() => setShowProjects(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Future Projects</h3>
            <div style={{ marginTop: 12 }}>
              {projects.length === 0 ? (
                <div style={{ color: '#94a3b8' }}>No projects available.</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                  {projects.map((p) => (
                    <li key={p.id} style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8 }}>
                      <div style={{ fontWeight: 700 }}>{p.title}</div>
                      <div style={{ color: '#94a3b8', fontSize: 13 }}>{p.desc}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowProjects(false)} style={styles.ghostBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  app: { minHeight: '100vh', background: 'linear-gradient(to bottom,#0f1724 0%,#0b1220 100%)', color: '#e6eef8', fontFamily: 'Poppins,system-ui,-apple-system,sans-serif' },
  header: { padding: '1rem 5%', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(6px)', position: 'fixed', width: '100%', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 30px rgba(2,6,23,0.6)' },
  headerInner: { width: '100%', maxWidth: 1150, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoTitle: { display: 'flex', alignItems: 'center', gap: 12 },
  logo: { width: 56, height: 56, borderRadius: 12, boxShadow: '0 8px 30px rgba(108,92,231,0.15)' },
  titlePill: { background: 'rgba(255,255,255,0.03)', padding: '8px 14px', borderRadius: 999, display: 'inline-block' },
  h1: { fontSize: 18, margin: 0, background: 'linear-gradient(45deg,#6c5ce7,#48dbfb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  ghostBtn: { padding: '8px 10px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#e6eef8' },
  loginFallbackBtn: { padding: '8px 12px', borderRadius: 8, background: 'linear-gradient(45deg,#6c5ce7,#48dbfb)', color: 'white', border: 'none', cursor: 'pointer' },
  main: { paddingTop: 110 },
  hero: { minHeight: '52vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 5%' },
  heroContent: { textAlign: 'center', maxWidth: 1100 },
  heroTitle: { fontSize: 36, lineHeight: 1.02, margin: 0 },
  highlight: { background: 'linear-gradient(45deg,#6c5ce7,#48dbfb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroImage: { width: '100%', maxWidth: 900, marginTop: 18, borderRadius: 18, transform: 'rotate(-3deg)', filter: 'drop-shadow(0 20px 30px rgba(108,92,231,0.25))' },
  primaryBtn: { padding: '10px 14px', borderRadius: 12, background: 'linear-gradient(45deg,#6c5ce7,#48dbfb)', color: 'white', border: 'none', fontWeight: 700 },
  featuresSection: { padding: '36px 5%', maxWidth: 1200, margin: '0 auto' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 },
  featureCard: { padding: 18, borderRadius: 14, background: 'linear-gradient(145deg,#071025,#091427)', boxShadow: '0 10px 30px rgba(2,6,23,0.6)', textAlign: 'center' },
  featureIcon: { fontSize: 28, marginBottom: 12, color: '#6c5ce7' },
  featureDesc: { color: '#94a3b8' },
  teamSection: { padding: '36px 5%', textAlign: 'center' },
  teamBadge: { display: 'inline-block', padding: '10px 20px', borderRadius: 40, background: 'linear-gradient(45deg,#6c5ce7,#48dbfb)', color: 'white', fontWeight: 700, textTransform: 'uppercase' },
  teamGrid: { position: 'relative', width: '100%', maxWidth: 760, height: 260, margin: '20px auto 0' },
  talhaCard: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  talhaImg: { width: 160, height: 160, objectFit: 'cover', borderRadius: 8, boxShadow: '0 12px 40px rgba(108,92,231,0.28)', border: '3px solid rgba(108,92,231,0.12)' },
  talhaName: { marginTop: 10, fontSize: 20, fontWeight: 800, color: '#e6eef8' },
  ashharCard: { position: 'absolute', left: '10%', top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  sulemanCard: { position: 'absolute', right: '10%', top: 160, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  memberImgLarge: { width: 96, height: 96, objectFit: 'cover', borderRadius: 8, boxShadow: '0 8px 20px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.03)' },
  memberName: { color: '#e6eef8', fontWeight: 700, marginTop: 8 },
  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 },
  modal: { background: '#071025', padding: 18, borderRadius: 10, minWidth: 340, color: '#e6eef8' },
  input: { padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#e6eef8' },
  deleteBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#ff6b6b', padding: '6px 8px', borderRadius: 8 },
  footer: { padding: '32px 5%', textAlign: 'center' }
};
