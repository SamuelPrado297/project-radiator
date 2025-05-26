const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const { z } = require('zod');

// Configuração do aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'ftha297',
  database: 'radiadores_db'
};

// Pool de conexões com o banco de dados
let pool;

async function initializeDatabase() {
  try {
    // Criar conexão sem selecionar banco de dados
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Verificar se o banco de dados existe, se não, criar
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.end();

    // Criar pool de conexões com o banco de dados
    pool = mysql.createPool(dbConfig);

    // Criar tabelas se não existirem
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marcas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        logo VARCHAR(255)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS modelos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        marca_id INT NOT NULL,
        nome VARCHAR(100) NOT NULL,
        FOREIGN KEY (marca_id) REFERENCES marcas(id)
      );
    `);

    await pool.query(`
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
    `);

    // Inserir algumas marcas de exemplo
    const marcas = [
      { nome: 'Volkswagen', logo: 'vw.png' },
      { nome: 'Ford', logo: 'ford.png' },
      { nome: 'Chevrolet', logo: 'chevrolet.png' },
      { nome: 'Toyota', logo: 'toyota.png' },
      { nome: 'Honda', logo: 'honda.png' },
      { nome: 'Renault', logo: 'renault.png' },
      { nome: 'Fiat', logo: 'fiat.png' },
      { nome: 'Nissan', logo: 'nissan.png' }
    ];

    for (const marca of marcas) {
      const [rows] = await pool.query('SELECT id FROM marcas WHERE nome = ?', [marca.nome]);
      if (rows.length === 0) {
        await pool.query('INSERT INTO marcas (nome, logo) VALUES (?, ?)', [marca.nome, marca.logo]);
      }
    }

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    process.exit(1);
  }
}

// Esquemas de validação com Zod
const radiadorSchema = z.object({
  numero_peca: z.string().min(1, 'Número da peça é obrigatório'),
  marca_id: z.number().int().positive('Marca inválida'),
  modelo_id: z.number().int().positive('Modelo inválido'),
  descricao: z.string().optional(),
  preco: z.number().positive('Preço deve ser um valor positivo'),
  quantidade_estoque: z.number().int().nonnegative('Quantidade em estoque não pode ser negativa')
});

// Rotas da API

// Obter todas as marcas
app.get('/api/marcas', async (req, res) => {
  try {
    const [marcas] = await pool.query('SELECT * FROM marcas ORDER BY nome');
    res.json(marcas);
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    res.status(500).json({ error: 'Erro ao buscar marcas' });
  }
});

// Obter modelos por marca
app.get('/api/modelos/:marcaId', async (req, res) => {
  try {
    const marcaId = parseInt(req.params.marcaId);
    const [modelos] = await pool.query('SELECT * FROM modelos WHERE marca_id = ? ORDER BY nome', [marcaId]);
    res.json(modelos);
  } catch (error) {
    console.error('Erro ao buscar modelos:', error);
    res.status(500).json({ error: 'Erro ao buscar modelos' });
  }
});

// Obter todos os radiadores
app.get('/api/radiadores', async (req, res) => {
  try {
    const [radiadores] = await pool.query(`
      SELECT r.*, m.nome as marca_nome, mo.nome as modelo_nome 
      FROM radiadores r
      JOIN marcas m ON r.marca_id = m.id
      JOIN modelos mo ON r.modelo_id = mo.id
      ORDER BY r.data_cadastro DESC
    `);
    res.json(radiadores);
  } catch (error) {
    console.error('Erro ao buscar radiadores:', error);
    res.status(500).json({ error: 'Erro ao buscar radiadores' });
  }
});

// Obter radiadores por marca
app.get('/api/radiadores/marca/:marcaId', async (req, res) => {
  try {
    const marcaId = parseInt(req.params.marcaId);
    const [radiadores] = await pool.query(`
      SELECT r.*, m.nome as marca_nome, mo.nome as modelo_nome 
      FROM radiadores r
      JOIN marcas m ON r.marca_id = m.id
      JOIN modelos mo ON r.modelo_id = mo.id
      WHERE r.marca_id = ?
      ORDER BY mo.nome
    `, [marcaId]);
    res.json(radiadores);
  } catch (error) {
    console.error('Erro ao buscar radiadores por marca:', error);
    res.status(500).json({ error: 'Erro ao buscar radiadores por marca' });
  }
});

// Cadastrar novo radiador
app.post('/api/radiadores', async (req, res) => {
  try {
    // Validar dados com Zod
    const validatedData = radiadorSchema.parse(req.body);
    
    // Inserir no banco de dados
    const [result] = await pool.query(`
      INSERT INTO radiadores 
      (numero_peca, marca_id, modelo_id, descricao, preco, quantidade_estoque) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      validatedData.numero_peca,
      validatedData.marca_id,
      validatedData.modelo_id,
      validatedData.descricao || '',
      validatedData.preco,
      validatedData.quantidade_estoque
    ]);
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Radiador cadastrado com sucesso' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    
    console.error('Erro ao cadastrar radiador:', error);
    res.status(500).json({ error: 'Erro ao cadastrar radiador' });
  }
});

// Atualizar estoque de radiador
app.put('/api/radiadores/:id/estoque', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { quantidade_estoque } = req.body;
    
    // Validar quantidade
    const quantidadeSchema = z.number().int().nonnegative('Quantidade em estoque não pode ser negativa');
    const validatedQuantidade = quantidadeSchema.parse(quantidade_estoque);
    
    await pool.query('UPDATE radiadores SET quantidade_estoque = ? WHERE id = ?', [validatedQuantidade, id]);
    
    res.json({ message: 'Estoque atualizado com sucesso' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Quantidade inválida', 
        details: error.errors 
      });
    }
    
    console.error('Erro ao atualizar estoque:', error);
    res.status(500).json({ error: 'Erro ao atualizar estoque' });
  }
});

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();