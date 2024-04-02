# Desafio - Sistema de Gerenciamento de Biblioteca

## Objetivo

Desenvolver um sistema de gerenciamento de biblioteca utilizando
a última versão do TypeScript. O foco será criar um CRUD que se
conecta a um banco de dados, podendo ser NoSQL ou SQL.

## Requisitos Funcionais

Disponibilizar uma API que tenha funcionalidades de CRUD para um app frontend

Estrutura do Livro:

- Titulo
- Autor
- ISBN
- Ano de Publicação
- Editora

Criar uma entidade editoria é opcional, mas se tiver colocar uma listagem da lista de livros do editor

## Requisitos Técnicos

- Desenvolvimento do projeto utilizando a versão mais recente do TypeScript para garantir que o código esteja atualizado.
- Integração do sistema a um banco de dados SQL ou NoSQL.

## Ferramentas Utilizadas

- Web Framework: [Hono](https://hono.dev/)
- Database: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- Query Builder: [Kysely](https://kysely.dev/)
- Typescript Runner: [tsx](https://github.com/privatenumber/tsx)
- Testes: Node Test Runner (Nativo)
- Schema Validato: [Zod](https://zod.dev/)
