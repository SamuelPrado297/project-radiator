# Documentação do Sistema de Estoque de Radiadores

## Visão Geral

Este sistema foi desenvolvido para atender às necessidades de uma loja de radiadores, permitindo o gerenciamento de estoque, catalogação de produtos e interface para clientes. O projeto segue as especificações detalhadas no Termo de Abertura do Projeto (TAP).

## Estrutura do Projeto

### Frontend

O frontend do sistema foi desenvolvido utilizando HTML, CSS e JavaScript puro, seguindo os wireframes apresentados no TAP. As principais páginas são:

1. **Página Inicial (index.html)**: Apresenta as marcas de carros disponíveis e opções para buscar radiadores.
2. **Página de Busca (busca.html)**: Permite filtrar radiadores por marca e modelo de carro.
3. **Página de Catálogo (radiadores.html)**: Exibe todos os radiadores disponíveis no sistema.
4. **Página de Cadastro (cadastro.html)**: Formulário para cadastro de novos radiadores no sistema.

### Backend

O backend foi implementado utilizando Node.js com Express, fornecendo uma API RESTful para o frontend. As principais funcionalidades são:

1. **Gerenciamento de Marcas**: Listagem de marcas de carros disponíveis.
2. **Gerenciamento de Modelos**: Listagem de modelos por marca.
3. **Gerenciamento de Radiadores**: CRUD completo para radiadores, incluindo busca por marca/modelo.

### Banco de Dados

O sistema utiliza MySQL para armazenamento de dados, com as seguintes tabelas:

1. **marcas**: Armazena informações sobre as marcas de carros.
2. **modelos**: Armazena os modelos de carros, relacionados às marcas.
3. **radiadores**: Armazena informações sobre os radiadores, incluindo número da peça, preço e estoque.

## Requisitos Atendidos

- Sistema de estoque dos radiadores e suas peças
- Seleção de radiadores por marca de carro
- Catálogo de radiadores com informações detalhadas
- Opções de contato para venda

## Como Executar o Sistema

### Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)

### Passos para Execução

1. **Configuração do Banco de Dados**:
   - Crie um banco de dados MySQL chamado `radiadores_db`
   - Execute o script de inicialização em `database/init.sql`

2. **Instalação de Dependências**:
   ```
   npm install
   ```

3. **Configuração do Ambiente**:
   - Verifique as configurações de conexão com o banco de dados no arquivo `server.js`

4. **Execução do Servidor**:
   ```
   npm start
   ```

5. **Acesso ao Sistema**:
   - Abra o navegador e acesse: `http://localhost:3000`

## Partes Interessadas

Conforme definido no TAP, as principais partes interessadas são:

- **Dono da oficina**: Responsável pelo negócio, com poder alto e interesse alto.
- **Clientes finais**: Usuários do site, com poder médio e interesse alto.
- **Desenvolvedor**: Responsável pela implementação, com poder alto e interesse alto.
- **Fornecedores de peças**: Indiretamente impactados, com poder baixo e interesse médio.

## Orçamento

O orçamento total estimado para o projeto é de R$ 7.950,00, dividido em:

- Desenvolvimento Frontend: R$ 3.000,00
- Desenvolvimento Backend: R$ 3.000,00
- Hospedagem e Domínio: R$ 150,00
- Manutenção e Atualizações: R$ 800,00

## Validação de Dados

O sistema utiliza a biblioteca Zod para validação de dados no backend, garantindo a integridade das informações armazenadas no banco de dados.

## Considerações de Segurança

- Validação de entrada de dados no frontend e backend
- Proteção contra injeção SQL através do uso de consultas parametrizadas
- Sanitização de dados de entrada

## Melhorias Futuras

- Implementação de autenticação de usuários
- Área administrativa para gerenciamento de estoque
- Integração com sistemas de pagamento
- Relatórios de vendas e estoque
- Notificações de estoque baixo