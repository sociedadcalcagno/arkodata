-- Initial commercial suggestions from the Academy planning brief.
-- These are editable starting values, not approved final tariffs.
-- Courses remain unpublished and promotions stay disabled until content and dates are approved.
INSERT INTO academy_courses (
  slug,
  title,
  category,
  status,
  is_free,
  regular_price_clp,
  launch_price_clp,
  promotion_enabled,
  currency,
  tax_treatment
)
VALUES
  ('inteligencia-artificial', 'Inteligencia Artificial aplicada', 'IA y automatización', 'coming_soon', false, 39900, 24900, false, 'CLP', 'pending_review'),
  ('automatizacion-workflows', 'Automatización (n8n, RPA, workflows)', 'IA y automatización', 'coming_soon', false, 49900, 29900, false, 'CLP', 'pending_review'),
  ('business-intelligence', 'Business Intelligence / Power BI', 'Datos y analítica', 'coming_soon', false, 39900, 24900, false, 'CLP', 'pending_review'),
  ('bases-datos-sql', 'Bases de Datos / SQL / PostgreSQL', 'Datos y desarrollo', 'coming_soon', false, 34900, 19900, false, 'CLP', 'pending_review'),
  ('desarrollo-web-apis', 'Desarrollo de Software / APIs', 'Datos y desarrollo', 'coming_soon', false, 49900, 29900, false, 'CLP', 'pending_review'),
  ('cloud-devops', 'Cloud & DevOps', 'Datos y desarrollo', 'coming_soon', false, 49900, 29900, false, 'CLP', 'pending_review'),
  ('gestion-documental', 'Gestión Documental / OCR / IA', 'Negocio y operaciones', 'coming_soon', false, 39900, 24900, false, 'CLP', 'pending_review'),
  ('tecnologia-salud', 'Salud / Gestión de Honorarios Médicos', 'Negocio y operaciones', 'coming_soon', false, 49900, 29900, false, 'CLP', 'pending_review')
ON CONFLICT (slug) DO NOTHING;
