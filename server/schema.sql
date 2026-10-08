CREATE TABLE IF NOT EXISTS employees (
  firebase_uid VARCHAR(128) NOT NULL PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  phone VARCHAR(40) NULL,
  position VARCHAR(120) NULL,
  department VARCHAR(120) NULL,
  role ENUM('admin', 'operator') NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  last_activity TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX employees_role_status_idx (role, status)
);

CREATE TABLE IF NOT EXISTS inventory_state (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  payload JSON NOT NULL,
  legacy_imported_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT inventory_state_singleton CHECK (id = 1)
);

INSERT INTO inventory_state (id, payload)
VALUES (1, JSON_OBJECT('products', JSON_ARRAY(), 'transactions', JSON_ARRAY(), 'suppliers', JSON_ARRAY()))
ON DUPLICATE KEY UPDATE id = id;
