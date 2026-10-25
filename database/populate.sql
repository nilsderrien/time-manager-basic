-- Jeu de données de développement (sans mot de passe : connexion via Microsoft ou reset).
INSERT INTO departments (name) VALUES ('Engineering'), ('Human Resources');

INSERT INTO users (first_name, last_name, email, phone_number, role, contract_start_date) VALUES
    ('Alice', 'Martin', 'alice.martin@example.com', NULL, 'admin', '2024-01-01'),
    ('Bruno', 'Durand', 'bruno.durand@example.com', '0600000001', 'manager', '2024-02-01'),
    ('Chloé', 'Petit', 'chloe.petit@example.com', NULL, 'employee', '2025-03-01'),
    ('David', 'Leroy', 'david.leroy@example.com', NULL, 'employee', '2025-09-01');

INSERT INTO teams (name, id_manager, department_id) VALUES
    ('Backend', (SELECT id FROM users WHERE email = 'bruno.durand@example.com'),
                (SELECT id FROM departments WHERE name = 'Engineering'));

UPDATE users SET team_id = (SELECT id FROM teams WHERE name = 'Backend')
WHERE email IN ('bruno.durand@example.com', 'chloe.petit@example.com', 'david.leroy@example.com');

INSERT INTO employee_schedules (user_id, day_of_week, start_time, end_time)
SELECT u.id, d, '09:00', '17:00'
FROM users u, generate_series(1, 5) AS d
WHERE u.role = 'employee';

INSERT INTO time_entries (user_id, h_in, h_out, scheduled_start_at, scheduled_end_at, date)
SELECT u.id,
       (CURRENT_DATE - 1)::timestamp + interval '9 hours 10 minutes',
       (CURRENT_DATE - 1)::timestamp + interval '17 hours',
       (CURRENT_DATE - 1)::timestamp + interval '9 hours',
       (CURRENT_DATE - 1)::timestamp + interval '17 hours',
       CURRENT_DATE - 1
FROM users u
WHERE u.role = 'employee';

INSERT INTO late_justifications (time_entry_id, user_id, manager_id, reason)
SELECT te.id, te.user_id, (SELECT id FROM users WHERE email = 'bruno.durand@example.com'), 'Transport en retard'
FROM time_entries te
JOIN users u ON u.id = te.user_id
WHERE u.email = 'chloe.petit@example.com';

INSERT INTO leave_requests (user_id, manager_id, start_date, end_date)
SELECT u.id, (SELECT id FROM users WHERE email = 'bruno.durand@example.com'),
       CURRENT_DATE + 30, CURRENT_DATE + 34
FROM users u WHERE u.email = 'david.leroy@example.com';

INSERT INTO audit_logs (actor_user_id, target_type, target_id, gravity, action, message)
SELECT id, 'user', id, 'low', 'seed', 'Jeu de données initial chargé'
FROM users WHERE email = 'alice.martin@example.com';
