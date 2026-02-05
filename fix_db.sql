-- Create or Update User for 127.0.0.1 specifically
CREATE USER IF NOT EXISTS 'editodo'@'127.0.0.1' IDENTIFIED BY 'dbEdit0d0!@';
ALTER USER 'editodo'@'127.0.0.1' IDENTIFIED BY 'dbEdit0d0!@';
GRANT ALL PRIVILEGES ON editodo.* TO 'editodo'@'127.0.0.1';

-- Also ensure % user works
CREATE USER IF NOT EXISTS 'editodo'@'%' IDENTIFIED BY 'dbEdit0d0!@';
ALTER USER 'editodo'@'%' IDENTIFIED BY 'dbEdit0d0!@';
GRANT ALL PRIVILEGES ON editodo.* TO 'editodo'@'%';

FLUSH PRIVILEGES;
