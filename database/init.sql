CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE late_justification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE leave_request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE audit_log_gravity AS ENUM ('null', 'low', 'medium', 'high', 'fatal');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255),
    role user_role NOT NULL DEFAULT 'employee',
    profile_picture VARCHAR(255),
    contract_start_date DATE NOT NULL,
    contract_end_date DATE DEFAULT NULL,
    team_id INT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    id_manager INT NOT NULL REFERENCES users(id),
    department_id INT NOT NULL REFERENCES departments(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE teams ADD FOREIGN KEY (id_manager) REFERENCES users(id);
ALTER TABLE teams ADD FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE users ADD FOREIGN KEY (team_id) REFERENCES teams(id);

CREATE TABLE employee_schedules (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    day_of_week INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, day_of_week)
);

CREATE TABLE time_entries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    h_in TIMESTAMPTZ NOT NULL,
    h_out TIMESTAMPTZ,
    scheduled_start_at TIMESTAMPTZ NOT NULL,
    scheduled_end_at TIMESTAMPTZ NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_stats (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_worked_minutes INT NOT NULL DEFAULT 0,
    average_lateness_minutes DECIMAL(8,2) NOT NULL DEFAULT 0,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, period_start, period_end)
);

CREATE TABLE late_justifications (
    id SERIAL PRIMARY KEY,
    time_entry_id INT NOT NULL UNIQUE REFERENCES time_entries(id),
    user_id INT NOT NULL REFERENCES users(id),
    manager_id INT NOT NULL REFERENCES users(id),
    reason TEXT NOT NULL,
    status late_justification_status NOT NULL DEFAULT 'pending',
    manager_comment TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    manager_id INT NOT NULL REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status leave_request_status NOT NULL DEFAULT 'pending',
    manager_comment TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON leave_requests (user_id, created_at);
CREATE INDEX ON leave_requests (manager_id, status);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (provider, provider_user_id)
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    gravity audit_log_gravity NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
