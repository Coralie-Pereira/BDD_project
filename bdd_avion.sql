USE AvionPapier;


DROP TABLE IF EXISTS lignes_commande;
DROP TABLE IF EXISTS commandes;
DROP TABLE IF EXISTS fournisseurs_produits;
DROP TABLE IF EXISTS produits;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS fournisseurs;
DROP TABLE IF EXISTS clients;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);


CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description_reference TEXT,
    prix_unitaire FLOAT NOT NULL,
    quantite_stock INT NOT NULL,
    categorie_id INT,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE
);


CREATE TABLE fournisseurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

CREATE TABLE fournisseurs_produits (
    fournisseur_id INT,
    produit_id INT,
    PRIMARY KEY (fournisseur_id, produit_id) ,
    FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id)ON DELETE CASCADE, 
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);


CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    adresse TEXT,
    email VARCHAR(255) NOT NULL
);


CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    nom VARCHAR(10) NOT NULL,
    date_commande DATE NOT NULL,
    total FLOAT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);


CREATE TABLE lignes_commande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT,
    produit_id INT,
    quantite INT NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);







INSERT INTO clients (nom, prenom, adresse, email) VALUES
('Lemoine', 'Sophie', '8 Rue de la Gare, Caen', 'sophie.lemoine@example.com'),
('Boucher', 'Antoine', '29 Avenue de la Liberté, Le Mans', 'antoine.boucher@example.com'),
('Delmar', 'Hélène', '61 Rue des Charentes, Niort', 'helene.delmar@example.com'),
('Fritz', 'Michel', '74 Rue des Érables, Grenoble', 'michel.fritz@example.com'),
('Langlois', 'Nathalie', '85 Rue de la Paix, Tours', 'nathalie.langlois@example.com'),
('Pires', 'Romain', '20 Avenue de la Concorde, Ajaccio', 'romain.pires@example.com'),
('Lemoine', 'Pierre', '17 Rue de la Forêt, Clermont-Ferrand', 'pierre.lemoine@example.com'),
('Barros', 'Olivia', '63 Boulevard Clemenceau, Toulouse', 'olivia.barros@example.com'),
('Ribeiro', 'Mélissa', '52 Chemin de la Mer, La Rochelle', 'melissa.ribeiro@example.com'),
('Masson', 'Éric', '4 Place du Général, Paris', 'eric.masson@example.com'),
('Leclerc', 'Nicolas', '10 Boulevard de l’Égalité, Lyon', 'nicolas.leclerc@example.com'),
('Brunet', 'Sophie', '89 Rue du Palais, Marseille', 'sophie.brunet@example.com'),
('Dufresne', 'Julien', '55 Avenue du Nord, Lille', 'julien.dufresne@example.com'),
('Faure', 'Juliette', '27 Rue de Verdun, Nice', 'juliette.faure@example.com'),
('Dupuis', 'Alice', '24 Rue des Tuileries, Angers', 'alice.dupuis@example.com'),
('Morin', 'Adrien', '46 Place des Halles, Reims', 'adrien.morin@example.com'),
('Lemoine', 'Valérie', '13 Avenue des Amandiers, Bordeaux', 'valerie.lemoine@example.com'),
('Laurent', 'Marc', '69 Boulevard République, Metz', 'marc.laurent@example.com'),
('Gros', 'Pierre', '77 Avenue de la Gare, Poitiers', 'pierre.gros@example.com'),
('Picard', 'Isabelle', '18 Rue des Sapins, Perpignan', 'isabelle.picard@example.com'),
('Besson', 'Charlotte', '33 Rue du Vieux-Port, Marseille', 'charlotte.besson@example.com'),
('Vasseur', 'Pauline', '55 Boulevard La Fayette, Amiens', 'pauline.vasseur@example.com'),
('Lemoine', 'Frédéric', '23 Rue Saint-Germain, Lyon', 'frederic.lemoine@example.com'),
('Fournier', 'Hugo', '49 Rue de la Liberté, Toulouse', 'hugo.fournier@example.com'),
('Dupuis', 'Léa', '17 Boulevard Voltaire, Grenoble', 'lea.dupuis@example.com'),
('Bordier', 'Jacques', '12 Rue de la Paix, Rennes', 'jacques.bordier@example.com'),
('Bailly', 'Florence', '28 Avenue des Champs, Paris', 'florence.bailly@example.com'),
('Carpentier', 'Geoffrey', '44 Rue de la Mer, Nantes', 'geoffrey.carpentier@example.com'),
('Caron', 'Émilie', '23 Rue des Fleurs, Saint-Étienne', 'emilie.caron@example.com'),
('Perrier', 'Henri', '59 Rue des Pruniers, Rouen', 'henri.perrier@example.com'),
('Maillard', 'Caroline', '67 Rue de Paris, Lille', 'caroline.maillard@example.com'),
('Blondel', 'Christophe', '39 Rue de l’Église, Strasbourg', 'christophe.blondel@example.com'),
('Perrot', 'Jean-Pierre', '11 Rue des Roseaux, Dijon', 'jeanpierre.perrot@example.com'),
('Benoit', 'Céline', '31 Avenue des Lilas, Bordeaux', 'celine.benoit@example.com'),
('Chauvin', 'Michel', '7 Rue des Champs, Paris', 'michel.chauvin@example.com'),
('Roy', 'Sylvain', '15 Rue du Moulin, Marseille', 'sylvain.roy@example.com'),
('Rousseau', 'Vincent', '50 Boulevard des Tuileries, Nantes', 'vincent.rousseau@example.com'),
('Marchand', 'Bernadette', '20 Rue Victor Hugo, Lyon', 'bernadette.marchand@example.com'),
('Schmidt', 'Valérie', '37 Rue Saint-Jacques, Lille', 'valerie.schmidt@example.com'),
('Tanguy', 'Julien', '42 Boulevard de l’Europe, Caen', 'julien.tanguy@example.com'),
('Jacquet', 'Pierre', '50 Rue des Rosiers, Reims', 'pierre.jacquet@example.com'),
('Lemoine', 'Bernadette', '61 Rue des Bois, Nantes', 'bernadette.lemoine@example.com');



INSERT INTO categories (nom) VALUES 
('Jets Modernes'),
('Planeurs Ultra-Légers'),
('Avions en Papier'),
('Modèles Classiques Vintage'),
('Avions Militaires Historiques'),
('Concepts Futuristes'),
('Kits Débutants'),
('Séries Avancées'),
('Éditions Limitées Rares'),
('Objets de Collection');


INSERT INTO produits (nom, description_reference, prix_unitaire, quantite_stock, categorie_id) VALUES
('Jet A1', 'High-speed jet model with advanced aerodynamics.', 15.99, 100, 1),
('Jet B2', 'Compact jet with exceptional maneuverability.', 12.49, 80, 1),
('Glider G1', 'Smooth glider for long-distance flights.', 10.99, 120, 2),
('Glider G2', 'Lightweight glider with improved stability.', 8.49, 150, 2),
('Paper Plane P1', 'Classic paper plane for all ages.', 1.99, 300, 3),
('Paper Plane P2', 'Decorative paper plane with unique designs.', 2.49, 250, 3),
('Classic Model C1', 'Vintage airplane model for collectors.', 20.99, 50, 4),
('Classic Model C2', '1940s-style airplane replica.', 25.99, 40, 4),
('Military Model M1', 'WWII fighter jet replica.', 30.99, 35, 5),
('Military Model M2', 'Modern stealth bomber model.', 45.99, 20, 5),
('Futuristic Design F1', 'Sci-fi inspired aircraft with sleek design.', 50.99, 15, 6),
('Futuristic Design F2', 'Conceptual model of a spaceship.', 60.99, 10, 6),
('Beginner Series B1', 'Easy-to-build airplane kit for beginners.', 5.99, 200, 7),
('Beginner Series B2', 'Beginner-friendly airplane with instructions.', 6.49, 180, 7),
('Advanced Series A1', 'Advanced model with intricate details.', 35.99, 25, 8),
('Advanced Series A2', 'High-complexity model for experts.', 40.99, 15, 8),
('Limited Edition L1', 'Exclusive model with a unique serial number.', 75.99, 5, 9),
('Limited Edition L2', 'Rare model, only 50 units produced.', 100.99, 3, 9),
('Collector’s Item CI1', 'Handcrafted collector’s airplane.', 150.99, 2, 10),
('Collector’s Item CI2', 'Limited collector’s edition with certificate.', 200.99, 1, 10),
('Jet A3', 'Jet model with enhanced speed and design.', 17.99, 90, 1),
('Glider G3', 'Premium glider for expert pilots.', 12.99, 100, 2),
('Paper Plane P3', 'Foldable paper plane with instructions.', 1.49, 350, 3),
('Classic Model C3', '1950s era model with realistic features.', 22.99, 30, 4),
('Military Model M3', 'Replica of a historic battle airplane.', 33.99, 20, 5),
('Futuristic Design F3', 'Prototype model of futuristic aircraft.', 55.99, 7, 6),
('Beginner Series B3', 'Simplified kit for first-time builders.', 4.99, 210, 7),
('Advanced Series A3', 'Complex design for skilled enthusiasts.', 38.99, 18, 8),
('Limited Edition L3', 'Exclusive golden model.', 120.99, 4, 9),
('Collector’s Item CI3', 'Custom-made collector’s piece.', 250.99, 1, 10),
('Jet A4', 'Aerodynamic model with special paint.', 18.99, 85, 1),
('Glider G4', 'Stylish glider with unique patterns.', 9.99, 110, 2),
('Paper Plane P4', 'Eco-friendly paper plane.', 1.29, 300, 3),
('Classic Model C4', 'Nostalgic model for enthusiasts.', 24.99, 25, 4),
('Military Model M4', 'Detailed replica of a fighter jet.', 40.99, 15, 5),
('Futuristic Design F4', 'Innovative model with LED lights.', 65.99, 8, 6),
('Beginner Series B4', 'Quick assembly model for kids.', 3.99, 220, 7),
('Advanced Series A4', 'Highly detailed airplane model.', 42.99, 10, 8),
('Limited Edition L4', 'Special anniversary edition.', 130.99, 2, 9),
('Collector’s Item CI4', 'Luxury handcrafted model.', 300.99, 1, 10),
('Jet A5', 'Compact jet with streamlined design.', 14.99, 95, 1),
('Glider G5', 'Lightweight glider for long-distance.', 11.49, 130, 2),
('Paper Plane P5', 'Colorful paper plane for children.', 1.79, 320, 3),
('Classic Model C5', 'Retro airplane with unique markings.', 21.99, 40, 4),
('Military Model M5', 'Stealth aircraft replica.', 35.99, 18, 5),
('Futuristic Design F5', 'Ultra-modern airplane concept.', 70.99, 5, 6),
('Beginner Series B5', 'Educational airplane building kit.', 6.99, 190, 7),
('Advanced Series A5', 'Master-level airplane kit.', 45.99, 8, 8),
('Limited Edition L5', 'Rare silver edition model.', 140.99, 3, 9),
('Collector’s Item CI5', 'Exclusive gem-encrusted model.', 500.99, 1, 10);





INSERT INTO fournisseurs (nom) VALUES
('AéroTech Industries'),
('WingMasters Inc.'),
('SkyBound Supplies'),
('AirFrame Crafts'),
('FlightDesign Co.'),
('PaperWings Ltd.'),
('GlideTech Solutions'),
('Vintage Air Models'),
('JetSet Manufacturers'),
('Futuristic Flyers'),
('Precision Parts Corp.'),
('Aviator Essentials'),
('Propeller Partners'),
('Military Replicas LLC'),
('Classic Aero Supplies'),
('CloudNine Designs'),
('AirBase Components'),
('Elite Model Kits'),
('AirCraft Artisans'),
('Horizon Wings Ltd.'),
('SkyLine Suppliers'),
('Golden Wings Fabrication'),
('Airborne Innovations'),
('ModelCraft Works'),
('Ace Aviation Kits');


INSERT INTO fournisseurs_produits (fournisseur_id, produit_id) VALUES
(1, 1),
(1, 5),
(1, 10),
(1, 15),
(1, 20),
(2, 2),
(2, 6),
(2, 11),
(2, 16),
(2, 21),
(3, 3),
(3, 7),
(3, 12),
(3, 17),
(3, 22),
(4, 4),
(4, 8),
(4, 13),
(4, 18),
(4, 23),
(5, 5),
(5, 9),
(5, 14),
(5, 19),
(5, 24),
(6, 6),
(6, 10),
(6, 15),
(6, 20),
(6, 25),
(7, 7),
(7, 11),
(7, 16),
(7, 21),
(8, 8),
(8, 12),
(8, 17),
(8, 22),
(9, 9),
(9, 13),
(9, 18),
(10, 10),
(10, 14),
(10, 19),
(10, 24),
(11, 11),
(11, 20),
(12, 12),
(12, 25),
(13, 1),
(13, 15),
(14, 5),
(14, 10),
(15, 20);


INSERT INTO commandes (id, client_id, nom, date_commande, total) VALUES
(1, 1, 'CMD001', '2025-01-10', 150.50),
(2, 2, 'CMD002', '2025-01-11', 75.00),
(3, 3, 'CMD003', '2025-01-12', 200.00),
(4, 4, 'CMD004', '2025-01-13', 320.99),
(5, 5, 'CMD005', '2025-01-14', 50.00),
(6, 6, 'CMD006', '2025-01-15', 600.00),
(7, 7, 'CMD007', '2025-01-16', 120.75),
(8, 8, 'CMD008', '2025-01-17', 90.50),
(9, 9, 'CMD009', '2025-01-18', 240.00),
(10, 10, 'CMD010', '2025-01-19', 180.00),
(11, 11, 'CMD011', '2025-01-20', 95.50),
(12, 12, 'CMD012', '2025-01-21', 45.75),
(13, 13, 'CMD013', '2025-01-22', 110.20),
(14, 14, 'CMD014', '2025-01-23', 155.90),
(15, 15, 'CMD015', '2025-01-24', 305.30),
(16, 16, 'CMD016', '2025-01-25', 275.80),
(17, 17, 'CMD017', '2025-01-26', 400.40),
(18, 18, 'CMD018', '2025-01-27', 95.90),
(19, 19, 'CMD019', '2025-01-28', 250.00),
(20, 20, 'CMD020', '2025-01-29', 80.75),
(21, 21, 'CMD021', '2025-01-30', 150.60),
(22, 22, 'CMD022', '2025-01-31', 275.00),
(23, 23, 'CMD023', '2025-02-01', 220.40),
(24, 24, 'CMD024', '2025-02-02', 105.50),
(25, 25, 'CMD025', '2025-02-03', 90.00);






INSERT INTO lignes_commande (id, commande_id, produit_id, quantite) VALUES
(1, 1, 3, 2),
(2, 1, 7, 1),
(3, 2, 5, 3),
(4, 2, 8, 2),
(5, 3, 10, 1),
(6, 3, 12, 4),
(7, 4, 15, 2),
(8, 4, 18, 1),
(9, 5, 20, 3),
(10, 5, 22, 1),
(11, 6, 25, 5),
(12, 6, 30, 2),
(13, 7, 32, 3),
(14, 7, 35, 2),
(15, 8, 37, 1),
(16, 8, 40, 4),
(17, 9, 42, 2),
(18, 9, 45, 3),
(19, 10, 47, 2),
(20, 10, 50, 1),
(21, 11, 1, 3),
(22, 11, 5, 2),
(23, 12, 9, 1),
(24, 12, 13, 4),
(25, 13, 14, 2),
(26, 13, 17, 3),
(27, 14, 19, 1),
(28, 14, 23, 2),
(29, 15, 27, 3),
(30, 15, 29, 2),
(31, 16, 31, 1),
(32, 16, 34, 4),
(33, 17, 36, 3),
(34, 17, 38, 2),
(35, 18, 41, 1),
(36, 18, 43, 4),
(37, 19, 46, 3),
(38, 19, 49, 2),
(39, 20, 2, 1),
(40, 20, 6, 3),
(41, 21, 11, 2),
(42, 21, 16, 4),
(43, 22, 21, 1),
(44, 22, 24, 2),
(45, 23, 28, 3),
(46, 23, 33, 2),
(47, 24, 39, 1),
(48, 24, 44, 4),
(49, 25, 48, 3),
(50, 25, 4, 2);






