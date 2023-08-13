CREATE TABLE pool (
  adapter_id VARCHAR,
  chain VARCHAR,
  controller VARCHAR,
  id VARCHAR PRIMARY KEY,
  index VARCHAR,
  investment_type VARCHAR,
  project_id VARCHAR,
  stats JSONB,
  raw JSONB,
  FOREIGN KEY (project_id) REFERENCES protocol(id)
);
