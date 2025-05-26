-- Script de inicialização do banco de dados para o Sistema de Estoque de Radiadores

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS radiadores_db;

-- Usar o banco de dados
USE radiadores_db;

-- Criar tabela de marcas
CREATE TABLE IF NOT EXISTS marcas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  logo VARCHAR(255)
);

-- Criar tabela de modelos
CREATE TABLE IF NOT EXISTS modelos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  FOREIGN KEY (marca_id) REFERENCES marcas(id)
);

-- Criar tabela de radiadores
CREATE TABLE IF NOT EXISTS radiadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_peca VARCHAR(50) NOT NULL,
  marca_id INT NOT NULL,
  modelo_id INT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  quantidade_estoque INT NOT NULL DEFAULT 0,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (marca_id) REFERENCES marcas(id),
  FOREIGN KEY (modelo_id) REFERENCES modelos(id)
);

-- Inserir marcas
INSERT INTO marcas (nome, logo) VALUES
('Volkswagen', 'vw.png'),
('Ford', 'ford.png'),
('Chevrolet', 'chevrolet.png'),
('Toyota', 'toyota.png'),
('Honda', 'honda.png'),
('Renault', 'renault.png'),
('Fiat', 'fiat.png'),
('Nissan', 'nissan.png');

-- Inserir modelos para Volkswagen
INSERT INTO modelos (marca_id, nome) VALUES
(1, 'Gol'),
(1, 'Fox'),
(1, 'Polo'),
(1, 'Golf'),
(1, 'Jetta');

-- Inserir modelos para Ford
INSERT INTO modelos (marca_id, nome) VALUES
(2, 'Ka'),
(2, 'Fiesta'),
(2, 'Focus'),
(2, 'EcoSport'),
(2, 'Ranger');

-- Inserir modelos para Chevrolet
INSERT INTO modelos (marca_id, nome) VALUES
(3, 'Onix'),
(3, 'Prisma'),
(3, 'Cruze'),
(3, 'S10'),
(3, 'Tracker');

-- Inserir alguns radiadores de exemplo
INSERT INTO radiadores (numero_peca, marca_id, modelo_id, descricao, preco, quantidade_estoque) VALUES
('VW001', 1, 1, 'Radiador para Volkswagen Gol 1.0 2010-2020', 350.00, 5),
('VW002', 1, 3, 'Radiador para Volkswagen Polo 1.6 2018-2023', 420.00, 3),
('FD001', 2, 7, 'Radiador para Ford Fiesta 1.0 2015-2019', 380.00, 2),
('FD002', 2, 8, 'Radiador para Ford Focus 2.0 2016-2019', 450.00, 4),
('CH001', 3, 11, 'Radiador para Chevrolet Onix 1.0 2017-2023', 320.00, 6),
('CH002', 3, 13, 'Radiador para Chevrolet Cruze 1.8 2016-2020', 520.00, 2);