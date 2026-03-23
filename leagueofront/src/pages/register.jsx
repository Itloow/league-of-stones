import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Register.module.css';
import { inscription } from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@univ-tlse2.fr')) {
      setError("L'email doit se terminer par @univ-tlse2.fr");
      return;
    }
    if (name.length < 3 || name.length > 28) {
      setError("Le nom d'utilisateur doit contenir entre 3 et 28 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      // On utilise la fonction d'Olti (elle prend les 3 arguments séparément)
      const data = await inscription(email, name, password);

      if (!data) throw new Error("Le serveur n'a pas répondu ou une erreur est survenue.");

      // Si on a un succès, redirection vers ta page de confirmation
      router.push('/success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerText}>
        <div className={styles.welcome}>Bienvenue sur</div>
        <div className={styles.logoText}>LEAGUE OF STONES</div>
      </div>

      <div className={styles.creationTitle}>CRÉATION DE COMPTE</div>
      <div className={styles.creationSubtitle}>Veuillez renseigner les informations suivantes :</div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>ADRESSE MAIL</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.inputField} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>MOT DE PASSE</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.inputField} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>CONFIRMER VOTRE MOT DE PASSE</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={styles.inputField} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>CHOISSISSEZ VOTRE PSEUDO :</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={styles.inputField} />
        </div>

        <div className={styles.buttonGroup}>
          <Link href="/" className={styles.btnBack}>
            ← RETOUR EN ARRIÈRE
          </Link>
          <button type="submit" disabled={isLoading} className={styles.btnNext}>
            {isLoading ? '...' : 'SUIVANT →'}
          </button>
        </div>
      </form>
    </div>
  );
}