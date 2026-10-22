insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_token, recovery_token, email_change_token_new, email_change, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'manager@example.com', extensions.crypt('password', extensions.gen_salt('bf')), now(), '', '', '', '', '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'agent@example.com', extensions.crypt('password', extensions.gen_salt('bf')), now(), '', '', '', '', '{"provider":"email","providers":["email"]}', '{}', now(), now());

insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values
  ('11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', '{"sub":"11111111-1111-4111-8111-111111111111","email":"manager@example.com","email_verified":true}', 'email', now(), now(), now()),
  ('22222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', '{"sub":"22222222-2222-4222-8222-222222222222","email":"agent@example.com","email_verified":true}', 'email', now(), now(), now());

insert into public.agent (id, first_name, last_name, role)
values
  ('11111111-1111-4111-8111-111111111111', 'Sophie', 'Lambert', 'manager'),
  ('22222222-2222-4222-8222-222222222222', 'Julien', 'Moreau', 'agent');

insert into public.listing (title, description, transaction_type, property_type, price, surface_area, land_area, rooms, bedrooms, energy_class, address, postal_code, city, department_code, latitude, longitude, published, agent_id)
values
  ('Haussmannian apartment near the Marais', 'Bright 3-room apartment on the 4th floor with elevator, moldings and parquet.', 'sale', 'apartment', 890000, 78, null, 3, 2, 'D', '12 rue de Turenne', '75004', 'Paris', '75', 48.8556, 2.3631, true, '22222222-2222-4222-8222-222222222222'),
  ('Studio close to Montmartre', 'Furnished studio, ideal for a student, charges included.', 'rent', 'apartment', 950, 22, null, 1, 0, 'E', '5 rue Lepic', '75018', 'Paris', '75', 48.8841, 2.3337, true, '11111111-1111-4111-8111-111111111111'),
  ('Family house in Croix-Rousse', 'Renovated house with a small garden and a garage.', 'sale', 'house', 640000, 140, 300, 6, 4, 'C', '8 rue d''Austerlitz', '69004', 'Lyon', '69', 45.7743, 4.8318, true, '22222222-2222-4222-8222-222222222222'),
  ('Building plot near Bordeaux', 'Serviced plot, ready to build.', 'sale', 'land', 185000, null, 800, null, null, null, 'Chemin de Lescure', '33600', 'Pessac', '33', 44.8067, -0.6311, true, '11111111-1111-4111-8111-111111111111'),
  ('Sea view villa in Ajaccio', 'Villa with pool overlooking the Gulf of Ajaccio.', 'sale', 'house', 1250000, 210, 1500, 7, 5, 'B', 'Route des Sanguinaires', '20000', 'Ajaccio', '2A', 41.9058, 8.6553, true, '22222222-2222-4222-8222-222222222222'),
  ('Shop in Bordeaux city centre', 'Retail space with a large window, coming soon.', 'rent', 'commercial', 2400, 95, null, 2, 0, 'F', '40 rue Sainte-Catherine', '33000', 'Bordeaux', '33', 44.8386, -0.5737, false, '11111111-1111-4111-8111-111111111111'),
  ('Loft with terrace in Boulogne-Billancourt', 'Top-floor loft with a 30 m² terrace, two parking spaces and a cellar.', 'sale', 'apartment', 1150000, 112, null, 4, 3, 'C', '45 rue de Silly', '92100', 'Boulogne-Billancourt', '92', 48.8337, 2.2401, true, '22222222-2222-4222-8222-222222222222'),
  ('Two-room flat in Neuilly-sur-Seine', 'Quiet two-room flat on a courtyard, close to the metro.', 'rent', 'apartment', 2100, 52, null, 2, 1, 'D', '18 rue de Chartres', '92200', 'Neuilly-sur-Seine', '92', 48.8853, 2.2649, true, '11111111-1111-4111-8111-111111111111'),
  ('Office space in La Part-Dieu', 'Open-plan offices with meeting rooms, next to the railway station.', 'rent', 'commercial', 4800, 180, null, 6, 0, 'C', '20 boulevard Vivier-Merle', '69003', 'Lyon', '69', 45.7607, 4.8590, true, '22222222-2222-4222-8222-222222222222'),
  ('Provençal bastide in Marseille', 'Stone bastide with a pool and olive trees, a rare find in the city.', 'sale', 'house', 980000, 190, 2000, 8, 5, 'D', '12 chemin de Château-Gombert', '13013', 'Marseille', '13', 43.3505, 5.4342, true, '11111111-1111-4111-8111-111111111111'),
  ('Apartment overlooking the Old Port', 'Three-room apartment with a balcony facing the harbour.', 'rent', 'apartment', 1350, 65, null, 3, 2, 'E', '7 quai du Port', '13002', 'Marseille', '13', 43.2965, 5.3698, true, '22222222-2222-4222-8222-222222222222'),
  ('Belle Époque flat on the Promenade des Anglais', 'High ceilings and a sea view from every room.', 'sale', 'apartment', 720000, 85, null, 3, 2, 'E', '101 promenade des Anglais', '06000', 'Nice', '06', 43.6950, 7.2650, true, '11111111-1111-4111-8111-111111111111'),
  ('Restaurant premises in Vieux-Nice', 'Restaurant with a fitted kitchen and a terrace licence.', 'sale', 'commercial', 450000, 120, null, 3, 0, 'G', '15 rue Droite', '06300', 'Nice', '06', 43.6982, 7.2777, false, '22222222-2222-4222-8222-222222222222'),
  ('Stone house in the Chartrons', 'Bordeaux stone house with a patio, near the quays.', 'sale', 'house', 845000, 160, 120, 6, 4, 'C', '30 rue Notre-Dame', '33000', 'Bordeaux', '33', 44.8530, -0.5700, true, '22222222-2222-4222-8222-222222222222'),
  ('Student studio on the Île de Nantes', 'Furnished studio near the university, charges included.', 'rent', 'apartment', 560, 20, null, 1, 0, 'F', '4 boulevard de la Prairie-au-Duc', '44200', 'Nantes', '44', 47.2063, -1.5640, true, '11111111-1111-4111-8111-111111111111'),
  ('Flemish townhouse in Vieux-Lille', 'Brick townhouse with a small courtyard and a vaulted cellar.', 'sale', 'house', 560000, 150, 80, 6, 4, 'E', '22 rue de la Monnaie', '59800', 'Lille', '59', 50.6406, 3.0620, true, '22222222-2222-4222-8222-222222222222'),
  ('Building plot near Toulouse', 'Flat serviced plot in a quiet residential area.', 'sale', 'land', 210000, null, 1100, null, null, null, 'Chemin de Borde-Rouge', '31200', 'Toulouse', '31', 43.6300, 1.4600, true, '11111111-1111-4111-8111-111111111111'),
  ('Apartment near the Capitole', 'Pink-brick building, three rooms with exposed beams.', 'rent', 'apartment', 980, 58, null, 3, 2, 'D', '8 rue du Taur', '31000', 'Toulouse', '31', 43.6058, 1.4425, true, '11111111-1111-4111-8111-111111111111'),
  ('New-build apartment in Port Marianne', 'Low-energy apartment with a loggia and a parking space.', 'sale', 'apartment', 345000, 68, null, 3, 2, 'A', '120 avenue Raymond Dugrand', '34000', 'Montpellier', '34', 43.6030, 3.8990, true, '22222222-2222-4222-8222-222222222222'),
  ('Half-timbered apartment in La Petite France', 'Character apartment overlooking the canals.', 'sale', 'apartment', 430000, 90, null, 4, 2, 'D', '5 rue des Moulins', '67000', 'Strasbourg', '67', 48.5800, 7.7400, true, '22222222-2222-4222-8222-222222222222'),
  ('Shop on the Place des Lices', 'Corner shop on the market square, high footfall.', 'rent', 'commercial', 1900, 75, null, 2, 0, 'E', '12 place des Lices', '35000', 'Rennes', '35', 48.1130, -1.6830, true, '11111111-1111-4111-8111-111111111111'),
  ('Chalet with lake view in Annecy', 'Timber chalet with a garden overlooking the lake.', 'sale', 'house', 1480000, 220, 1800, 8, 5, 'B', '3 chemin des Crêts', '74940', 'Annecy', '74', 45.9190, 6.1430, true, '11111111-1111-4111-8111-111111111111'),
  ('Seafront land in Bastia', 'Coastal plot with a building permit, pending survey.', 'sale', 'land', 320000, null, 2500, null, null, null, 'Route du Cap', '20200', 'Bastia', '2B', 42.7200, 9.4600, false, '22222222-2222-4222-8222-222222222222'),
  ('Creole villa in Saint-Denis', 'Villa with a veranda and a tropical garden.', 'rent', 'house', 2200, 140, 600, 5, 3, 'C', '25 rue de Paris', '97400', 'Saint-Denis', '974', -20.8789, 55.4481, true, '11111111-1111-4111-8111-111111111111');

insert into public.listing_image (listing_id, path, position, alt)
select listing.id, listing.id || '/' || n || '.jpg', n, listing.title || ', photo ' || (n + 1)
from public.listing
cross join generate_series(0, listing.id % 3) as n
where listing.published;
