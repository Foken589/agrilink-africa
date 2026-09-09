-- Seed Data for AgriLink Africa
-- Rich realistic pan-African agricultural operational data

INSERT INTO organizations (id, name, org_type, registration_number, country)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Ogun Agribusiness Cooperative Federation', 'cooperative', 'OG/COOP/2019/8492', 'Nigeria'),
  ('00000000-0000-0000-0000-000000000002', 'Rift Valley Smallholders Alliance', 'cooperative', 'KE/RVA/2021/1104', 'Kenya')
ON CONFLICT DO NOTHING;

-- Seed Market Prices across African Agricultural Hubs
INSERT INTO market_prices (id, commodity_name, category, market_name, city, country, state_region, wholesale_price, retail_price, unit_of_measure, currency, price_date, data_source_type, verification_badge, price_trend_pct, notes)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Live Broiler (Table Size)', 'Poultry', 'Mile 12 Market', 'Lagos', 'Nigeria', 'Lagos State', 5800.00, 6500.00, 'bird (2.0 - 2.4kg)', 'NGN', CURRENT_DATE, 'verified_bulletin', 'Verified Exchange / Field Team', 2.4, 'Supply steady; feed cost pressure maintaining firm prices.'),
  ('11111111-0000-0000-0000-000000000002', 'African Catfish (Fresh Live)', 'Aquaculture', 'Ketu Fish Market', 'Lagos', 'Nigeria', 'Lagos State', 3200.00, 3600.00, 'kg (1kg+ size)', 'NGN', CURRENT_DATE, 'verified_bulletin', 'Verified Exchange / Field Team', -1.2, 'Harvest surge from Epe & Ogun river clusters.'),
  ('11111111-0000-0000-0000-000000000003', 'White Maize (Dry Grain)', 'Grains & Cereals', 'Dawanau Grain Market', 'Kano', 'Nigeria', 'Kano State', 78000.00, 84000.00, '100kg bag', 'NGN', CURRENT_DATE, 'aggregator_receipt', 'Aggregator Trade Audited', 4.5, 'Institutional buying by poultry feed millers active.'),
  ('11111111-0000-0000-0000-000000000004', 'Soybean (Clean Grain)', 'Grains & Cereals', 'Bodija Market', 'Ibadan', 'Nigeria', 'Oyo State', 88000.00, 95000.00, '100kg bag', 'NGN', CURRENT_DATE, 'verified_bulletin', 'Verified Exchange / Field Team', 1.8, 'High industrial processing demand.'),
  ('11111111-0000-0000-0000-000000000005', 'Table Eggs (Jumbo Crate)', 'Poultry', 'Wakulima Market', 'Nairobi', 'Kenya', 'Nairobi County', 480.00, 550.00, 'crate (30 eggs)', 'KES', CURRENT_DATE, 'verified_bulletin', 'Verified Exchange / Field Team', 0.0, 'Stable supply from Kiambu & Machakos layers.'),
  ('11111111-0000-0000-0000-000000000006', 'Raw Cow Milk (Bulk Chilled)', 'Dairy', 'Naivasha Dairy Hub', 'Nakuru', 'Kenya', 'Rift Valley', 52.00, 65.00, 'litre', 'KES', CURRENT_DATE, 'aggregator_receipt', 'Aggregator Trade Audited', -3.1, 'Favourable rainy season pasture boosted morning yields.'),
  ('11111111-0000-0000-0000-000000000007', 'Yellow Cassava Tubers', 'Tubers & Roots', 'Agbogbloshie Market', 'Accra', 'Ghana', 'Greater Accra', 380.00, 450.00, '50kg sack', 'GHS', CURRENT_DATE, 'user_submitted', 'Farmer Crowd-sourced Sample', 1.1, 'Reported by Eastern Region aggregators.'),
  ('11111111-0000-0000-0000-000000000008', 'Matooke (Green Plantain)', 'Plantains & Bananas', 'Owino Market', 'Kampala', 'Uganda', 'Central Region', 28000.00, 35000.00, 'large bunch (30kg)', 'UGX', CURRENT_DATE, 'verified_bulletin', 'Verified Exchange / Field Team', -5.0, 'Heavy deliveries from Western Uganda farms.')
ON CONFLICT DO NOTHING;

-- Seed Categories
INSERT INTO produce_categories (id, name, slug, icon, description)
VALUES
  ('22222222-0000-0000-0000-000000000001', 'Poultry & Birds', 'poultry', 'Egg', 'Live broilers, layers, cockerels, turkeys, day-old chicks, and table eggs'),
  ('22222222-0000-0000-0000-000000000002', 'Aquaculture & Fish', 'aquaculture', 'Fish', 'Catfish, Tilapia, fingerlings, juveniles, broodstock, and smoked fish'),
  ('22222222-0000-0000-0000-000000000003', 'Livestock & Ruminants', 'livestock', 'Beef', 'Cattle, goats, sheep, pigs, rabbits, and dairy products'),
  ('22222222-0000-0000-0000-000000000004', 'Grains, Cereals & Legumes', 'grains', 'Wheat', 'Maize, soybeans, sorghum, millet, cowpea, and rice'),
  ('22222222-0000-0000-0000-000000000005', 'Roots & Tubers', 'tubers', 'Carrot', 'Cassava, white yam, sweet potatoes, and plantains'),
  ('22222222-0000-0000-0000-000000000006', 'Vegetables & Fruits', 'horticulture', 'Apple', 'Fresh tomatoes, habanero peppers, onions, watermelon, and leafy greens')
ON CONFLICT DO NOTHING;
