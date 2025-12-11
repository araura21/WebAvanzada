-- Crear usuario de prueba en la base de datos sis_academico
-- Usuario: admin
-- Contraseña: admin123 (hash con bcrypt - cost 10)

USE sis_academico;

-- Insertar usuario de prueba
INSERT INTO usuarios (usuario, password, rol, createdAt, updatedAt) VALUES 
('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Fm', 'admin', NOW(), NOW());

-- Alternativa: Si prefieres otro usuario
-- INSERT INTO usuarios (usuario, password, rol, createdAt, updatedAt) VALUES 
-- ('profesor', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Fm', 'profesor', NOW(), NOW());

-- Verificar que se insertó correctamente
SELECT * FROM usuarios;
