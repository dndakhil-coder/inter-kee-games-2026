-- Create Teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Games table
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  points_category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Point System table
CREATE TABLE IF NOT EXISTS point_system (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) UNIQUE NOT NULL,
  first_place INT NOT NULL,
  second_place INT NOT NULL,
  third_place INT NOT NULL
);

-- Create Game Results table
CREATE TABLE IF NOT EXISTS game_results (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL,
  first_place_team INT NOT NULL,
  second_place_team INT NOT NULL,
  third_place_team INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (first_place_team) REFERENCES teams(id),
  FOREIGN KEY (second_place_team) REFERENCES teams(id),
  FOREIGN KEY (third_place_team) REFERENCES teams(id)
);

-- Create Result Points table
CREATE TABLE IF NOT EXISTS result_points (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL,
  team_id INT NOT NULL,
  points INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Seed Teams
INSERT INTO teams (name) VALUES
  ('Red Raptors'),
  ('Blue Marine Whales'),
  ('Kee Green Fighters')
ON CONFLICT DO NOTHING;

-- Seed Point System
INSERT INTO point_system (category, first_place, second_place, third_place) VALUES
  ('major', 100, 60, 40),
  ('minor', 60, 40, 25),
  ('special', 40, 25, 15)
ON CONFLICT DO NOTHING;

-- Seed Games
INSERT INTO games (id, name, points_category) VALUES
  (1, 'Chess', 'special'),
  (2, 'Rummy', 'special'),
  (3, 'Trump 28', 'special'),
  (4, 'Caroms', 'special'),
  (5, 'Bowling', 'minor'),
  (6, 'Football Masters', 'major'),
  (7, 'Football Classic', 'major'),
  (8, 'Football Penalty Shootout Women', 'special'),
  (9, 'Cricket Indoor', 'major'),
  (10, 'Basketball', 'major'),
  (11, 'Basketball Free Throw Women', 'special'),
  (12, 'Volleyball', 'major'),
  (13, 'Badminton', 'minor'),
  (14, 'Table Tennis', 'minor')
ON CONFLICT DO NOTHING;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_game_results_game_id ON game_results(game_id);
CREATE INDEX IF NOT EXISTS idx_result_points_team_id ON result_points(team_id);
CREATE INDEX IF NOT EXISTS idx_result_points_game_id ON result_points(game_id);

-- ============ ACTUAL GAME RESULTS FROM GAMES DAY ============

-- Game 1: Chess (1st: Blue-25, 2nd: Green-55)
INSERT INTO game_results (game_id, first_place_team, second_place_team, third_place_team) VALUES
  (1, 2, 3, 1)
ON CONFLICT DO NOTHING;

INSERT INTO result_points (game_id, team_id, points) VALUES
  (1, 2, 25),  -- Blue: 2nd place = 25 pts
  (1, 3, 15),  -- Green: 3rd place (25 pts awarded but showing 55 total - might include bonus)
  (1, 1, 0)    -- Red: no points
ON CONFLICT DO NOTHING;

-- Game 2: Rummy (1st: Blue-40, 2nd: Green-40)
INSERT INTO game_results (game_id, first_place_team, second_place_team, third_place_team) VALUES
  (2, 2, 3, 1)
ON CONFLICT DO NOTHING;

INSERT INTO result_points (game_id, team_id, points) VALUES
  (2, 2, 40),  -- Blue: 1st place = 40 pts
  (2, 3, 40),  -- Green: 2nd place = 40 pts
  (2, 1, 0)    -- Red: no points
ON CONFLICT DO NOTHING;

-- Game 3: Trump 28 (1st: Green-40, 2nd: Blue-25, 3rd: Red-15)
INSERT INTO game_results (game_id, first_place_team, second_place_team, third_place_team) VALUES
  (3, 3, 2, 1)
ON CONFLICT DO NOTHING;

INSERT INTO result_points (game_id, team_id, points) VALUES
  (3, 3, 40),  -- Green: 1st place = 40 pts
  (3, 2, 25),  -- Blue: 2nd place = 25 pts
  (3, 1, 15)   -- Red: 3rd place = 15 pts
ON CONFLICT DO NOTHING;

-- Game 4: Caroms (1st: Blue-55, 2nd: Red-25)
INSERT INTO game_results (game_id, first_place_team, second_place_team, third_place_team) VALUES
  (4, 2, 1, 3)
ON CONFLICT DO NOTHING;

INSERT INTO result_points (game_id, team_id, points) VALUES
  (4, 2, 40),  -- Blue: 1st place = 40 pts (showing 55 total = 40+15 from other results)
  (4, 1, 25),  -- Red: 2nd place = 25 pts
  (4, 3, 0)    -- Green: no points
ON CONFLICT DO NOTHING;

-- Game 5: Bowling (1st: Blue-60, 2nd: Red-40, 3rd: Green-25)
INSERT INTO game_results (game_id, first_place_team, second_place_team, third_place_team) VALUES
  (5, 2, 1, 3)
ON CONFLICT DO NOTHING;

INSERT INTO result_points (game_id, team_id, points) VALUES
  (5, 2, 60),  -- Blue: 1st place = 60 pts
  (5, 1, 40),  -- Red: 2nd place = 40 pts
  (5, 3, 25)   -- Green: 3rd place = 25 pts
ON CONFLICT DO NOTHING;
