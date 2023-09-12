-- Create the ENUM types
CREATE TYPE difficulty_enum AS ENUM ('Easy', 'Intermediate', 'Advanced');
CREATE TYPE type_enum AS ENUM ('EGD', 'FSM');

-- Create the Model table
CREATE TABLE Model (
    modelID serial PRIMARY KEY,
    modelName VARCHAR(255) NOT NULL,
    difficulty difficulty_enum NOT NULL,
    type type_enum NOT NULL
);

-- Insert some sample data (optional)
INSERT INTO Model (modelName, difficulty, type)
VALUES
    ('FSM', 'Easy', 'EGD'),
    ('Customer', 'Easy', 'FSM'),
    ('BankAccount', 'Intermediate', 'FSM'),
    ('Louvre', 'Intermediate', 'EGD'),
    ('Boeing', 'Advanced', 'EGD'),
    ('Kinepolis', 'Advanced', 'FSM');

