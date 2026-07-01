// components/EmailTemplate.js
export const EmailTemplate = ({ otpCode }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '5px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>Votre code de vérification (OTP)</h1>
      <p style={{ color: '#555' }}>
          Merci d'utiliser ELIMUU. Veuillez trouver votre code de vérification unique ci-dessous :
      </p>
      <h2 style={{ color: '#007bff' }}>{otpCode}</h2>
      <p style={{ color: '#555' }}>
          Ce code est valable 10 minutes. Ne le partagez avec personne.
      </p>
      <p style={{ color: '#555' }}>
          Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
      </p>
      <footer style={{ marginTop: '20px', fontSize: '14px', color: '#777' }}>
          <p>Cordialement,</p>
          <p>ELIMUU — Apprentissage Numérique</p>
          <p>195 Av Kabambare, Lingwala, Kinshasa, RDC</p>
          <p>contact@elimuu.com | +243 860 275 282</p>
      </footer>
  </div>
);
