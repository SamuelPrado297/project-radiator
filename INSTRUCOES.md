# Instruções para Execução do Sistema de Estoque de Radiadores

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)

## Passo a Passo para Execução

### 1. Configuração do Banco de Dados

1. Acesse o MySQL e crie um banco de dados:
   ```sql
   CREATE DATABASE radiadores_db;
   ```

2. Importe o script de inicialização:
   ```
   mysql -u seu_usuario -p radiadores_db < database/init.sql
   ```
   Ou execute o conteúdo do arquivo `database/init.sql` em seu cliente MySQL.

### 2. Instalação de Dependências

No diretório raiz do projeto, execute:

```
npm install
```

Este comando instalará todas as dependências necessárias listadas no arquivo `package.json`.

### 3. Configuração do Ambiente

Verifique as configurações de conexão com o banco de dados no arquivo `server.js`. Se necessário, altere os parâmetros de conexão:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'radiadores_db'
};
```

### 4. Execução do Servidor

Para iniciar o servidor, execute:

```
npm start
```

Ou, para desenvolvimento com reinicialização automática:

```
npm run dev
```

### 5. Acesso ao Sistema

Abra o navegador e acesse:

```
http://localhost:3000
```

## Estrutura de Arquivos

- `public/`: Contém todos os arquivos do frontend
  - `index.html`: Página inicial
  - `busca.html`: Página de busca por marca/modelo
  - `radiadores.html`: Catálogo completo de radiadores
  - `cadastro.html`: Formulário de cadastro de radiadores
  - `css/`: Estilos CSS
  - `js/`: Scripts JavaScript
  - `img/`: Imagens e logos

- `server.js`: Arquivo principal do servidor Express
- `database/`: Scripts SQL para o banco de dados

## Funcionalidades Principais

1. **Visualização de Marcas**: Na página inicial, todas as marcas de carros são exibidas.
2. **Busca de Radiadores**: É possível buscar radiadores por marca e modelo de carro.
3. **Catálogo Completo**: Visualização de todos os radiadores cadastrados.
4. **Cadastro de Radiadores**: Formulário para adicionar novos radiadores ao sistema.

## Solução de Problemas

- **Erro de conexão com o banco de dados**: Verifique se o MySQL está em execução e se as credenciais estão corretas.
- **Erro ao iniciar o servidor**: Verifique se a porta 3000 não está sendo usada por outro processo.
- **Imagens não aparecem**: Verifique se os arquivos de imagem estão no diretório `public/img/`.

## Suporte

Em caso de dúvidas ou problemas, consulte a documentação completa em `DOCUMENTACAO.md`.