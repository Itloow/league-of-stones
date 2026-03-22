import { useState } from 'react'; // Import du hook d'état (CM3-React-I)
import { useRouter } from 'next/router'; // Attention, dans le Pages Router, c'est next/router !

export default function Register() {
  // 1. Définition des états locaux avec useState (CM3-React-I, diapo 3)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // 2. Fonction asynchrone pour l'appel API (CM1, syntaxe async/await avec try/catch)
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 

    // Validation stricte du cahier des charges (Tâche 13)
    if (!email.endsWith('@univ-tlse2.fr')) {
      setError("L'email doit se terminer par @univ-tlse2.fr");
      return; 
    }
    if (name.length < 3 || name.length > 28) {
      setError("Le nom d'utilisateur doit contenir entre 3 et 28 caractères.");
      return;
    }

    setIsLoading(true);
    
    // Bloc try/catch vu dans le CM1 (diapo 66)
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      // On attend que la réponse JSON soit parsée
      const data = await response.json(); 

      // Si le Web Service retourne une erreur (ex: email déjà pris)
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      // Succès ! Le WS renvoie l'ID
      alert('Compte créé avec succès !');
      router.push('/login'); // Redirection vers la future page de connexion

    } catch (err) {
      // Affichage de l'erreur interceptée dans le catch
      setError(err.message); 
    } finally {
      setIsLoading(false); 
    }
  };

  // 3. Rendu du composant (JSX)
  return (
    <main style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Créer un compte</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Email universitaire :</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Nom d'utilisateur :</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Mot de passe :</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '10px', backgroundColor: isLoading ? '#ccc' : '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {isLoading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>
    </main>
  );
}