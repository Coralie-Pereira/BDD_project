- ReadMe examen Base de Donées

<!-- Pour l'insatallation et démarrage du serveur / Initiation a la base de données. -->

- Clôner le projet depuis le dépôt git
- Créer le fichier .env
- Depuis le fichier .env.example et renommez-le en .env. Ce fichier contient les configurations nécessaires pour connecter votre application à la base de données.

Exemple de contenu du fichier .env :

    DB_HOST=localhost
    DB_USERNAME=username
    DB_PASSWORD=password
    DB_DATABASE=Avion
    DB_PORT=port
    API_KEY=key

Une fois votre fichier .env configuré, lancez la commande suivante pour initialiser la base de données :

- npm run start:db

Ensuite installez toutes les dépendances du projet en exécutant la commande suivante :

- npm install

Une fois que les dépendances sont installer faite la commande suivante pour démarrer le serveur :

- npm run dev

Maintenant via l'URL suivante le serveur doit être en cours d'éxécution :

[Api] - http://localhost:3001/

La documentation interactive de l'API est disponible à l'adresse suivante :

http://localhost:3001/api-docs

Une fois cette étape faite :

- Générer une clé API aléatoire
- Ajouter la clé API dans le fichier .env pour la mettre dans le .env
- Ajouter la clé API dans les requêtes :
  - Pour envoyer a chaque requêtes HTTP il faut l'en-tête x-api-key avec la clé API

Concernant les failles de sécurités :

- Faille : Il n'y a pas d'authentification en deux facteurs donc si quelqu'un connaît l'url de l'api c'est une porte ouverte.
- Solution : Pour corrigé ce problème on pourrait mettre en place une authentification avec des clés API pour controler l'accès. Et utiliser un middleware pour vérifier la validité de la clé API dans l'en-tête x-api-key des requêtes HTTP.

- Faille : Les routes présentent un risque d'injection SQL si il y a quelqu"un de mal intentionnée il pourrait compromettre l'intégrité de la base de données.
- Solution : Pour corrigé ce problème on pourait utiliser des requêtes préparées ou des ORM qui séparent les données des instructions SQL.

- Faille : Utilisation de champs non uniques pour les requêtes.Dans le cas de la suppression d'un client via son email, si plusieurs clients partagent le même email, tous seront supprimés.
- Solution : Rendre chaques colonnes uniques pour les requêtes complexe comme la suppression ou l'ajout d'un champ.

<!-- /////////////////////////////////// -->

- Mon schema de la BDD est disponnible dans le dossier image 'schema bdd.png'x. Ainsi que le script de ma bdd, elle se trouve parmi les dossiers elle est intitulé ' bdd_avion.sql '.
