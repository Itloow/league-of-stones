import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import pour le lien de navigation interne
// Import du Module CSS (CM3-React-II)
import styles from '../styles/Register.module.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NOUVEAU : Etats pour la confirmation et la checkbox
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptCGU, setAcceptCGU] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 

    // Validations mises à jour selon la maquette et le cahier des charges
    if (!email.endsWith('@univ-tlse2.fr')) {
      setError("L'email doit se terminer par @univ-tlse2.fr");
      return; 
    }
    if (name.length < 3 || name.length > 28) {
      setError("Le nom d'utilisateur doit contenir entre 3 et 28 caractères.");
      return;
    }
    // NOUVEAU : Validation concordance mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    // NOUVEAU : Validation acceptation CGU
    if (!acceptCGU) {
      setError("Vous devez accepter les conditions générales.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      alert('Compte créé avec succès !');
      router.push('/login'); 

    } catch (err) {
      setError(err.message); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    // Application des classes CSS Module
    <div className={styles.container}>
      <main className={styles.registerBox}>
        <h2 className={styles.title}>Créer un compte</h2>
        
        {error && <div style={{ color: '#ff4444', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Champ Nom */}
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>[👤]</span> {/* Placeholder Icône */}
            <input 
              type="text" 
              placeholder="Nom d'utilisateur"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className={styles.inputField}
            />
          </div>

          {/* Champ Email */}
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>[✉️]</span>
            <input 
              type="email" 
              placeholder="Email universitaire (@univ-tlse2.fr)"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className={styles.inputField}
            />
          </div>

          {/* Champ Password */}
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>[🔒]</span>
            <input 
              type="password" 
              placeholder="Mot de passe"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className={styles.inputField}
            />
          </div>

          {/* Champ Confirmation Password */}
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>[🔒]</span>
            <input 
              type="password" 
              placeholder="Confirmer le mot de passe"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              className={styles.inputField}
            />
          </div>

          {/* Checkbox CGU */}
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="cgu"
              checked={acceptCGU}
              onChange={(e) => setAcceptCGU(e.target.checked)}
              required
            />
            <label htmlFor="cgu">J'accepte les <a href="#">conditions générales d'utilisation</a></label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className={styles.footerLink}>
          Déjà inscrit ? <Link href="/login">Se connecter</Link>
        </p>
      </main>
    </div>
  );
}