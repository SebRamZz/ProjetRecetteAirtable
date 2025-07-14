# ProjetRecetteAirtable


## Getting Started

Dans le .env du dossier /portfolio ajouter les Key
```bash
NEXT_PUBLIC_AIRTABLE_API_KEY=""
NEXT_PUBLIC_AIRTABLE_BASE_ID=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL=http://localhost:3000
OLLAMA_HOST=http://localhost:11434/
NEXT_PUBLIC_BASE_URL=http://localhost:3000/
````

On utilise docker

```bash
docker-compose up -d

Ouvrir http://localhost:3000
````

## Membre du groupe
- Ismail MRABET
- Jay BURY
- Hamza MAHMOOD
- Sébastien RAMIREZ


## Technologies utilisées
- Next (Front/Back)
- NextAuth (Authentification)
- AirTable (BDD)
- Shacn/UI

## ⚠️ Démarrage de l'IA (Ollama) et téléchargement du modèle

Lors du premier démarrage du projet avec Docker Compose, le service Ollama télécharge automatiquement le modèle IA `phi3`. **Ce téléchargement peut prendre plusieurs minutes** (le modèle fait plusieurs Go).

Pendant ce temps, si vous essayez d'utiliser l'IA (génération de recette), vous verrez des erreurs 404 comme :

```
{"error":"model 'phi3' not found"}
```

C'est normal tant que le téléchargement n'est pas terminé.

### Comment savoir si le modèle est prêt ?

Vous pouvez vérifier l'état du modèle avec :

```sh
docker compose exec ollama ollama list
```

Quand `phi3` apparaît dans la liste, l'IA est prête à répondre !

### Logs et suivi du téléchargement

Dans les logs Docker (`docker compose logs -f ollama`), vous verrez des lignes comme :

```
pulling manifest ...
```

Tant que ces lignes apparaissent, le téléchargement est en cours. Attendez la fin avant de tester l'IA.

### Problèmes fréquents

- **Erreur de permission sur le script d'entrée** :
  Si vous voyez `permission denied` sur `ollama-entrypoint.sh`, lancez :
  ```sh
  chmod +x ollama-entrypoint.sh
  ```
  puis relancez Docker Compose.

- **Erreur "exec format error"** :
  Vérifiez que le script a des fins de ligne Unix (LF) et commence bien par `#!/bin/sh`.

- **Erreur 404 sur l'IA** :
  Attendez la fin du téléchargement du modèle.

### Pour Windows

Si vous êtes sur Windows (hors WSL), il se peut que les permissions ne soient pas appliquées automatiquement. Suivez les instructions ci-dessus dans un terminal compatible (Git Bash, WSL, etc).

---

Pour toute question ou problème, consultez les logs Ollama ou contactez l'équipe projet.
