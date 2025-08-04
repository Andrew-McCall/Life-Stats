CREATE TABLE counter (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE event (
  id SERIAL PRIMARY KEY,
  counter_id INT NOT NULL REFERENCES counter(id) ON DELETE CASCADE,
  increment INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW counter_summary AS
SELECT
  c.id,
  c.name,
  c.description,
  COALESCE(SUM(e.increment), 0) AS event_total,
  COUNT(e.id) AS event_count
FROM counter c
LEFT JOIN event e ON e.counter_id = c.id
GROUP BY c.id, c.name, c.description;

CREATE INDEX idx_event_counter_id ON event(counter_id);
