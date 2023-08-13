CREATE TABLE protocol (
  id VARCHAR PRIMARY KEY,
  chain VARCHAR,
  logo VARCHAR,
  site_url VARCHAR,
  pool_stats JSONB,
  tag_ids VARCHAR[],
  raw JSONB
);
