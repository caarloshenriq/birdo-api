# Birdo API

## Resumo

A **Birdo API** é uma plataforma de rede social projetada para facilitar a criação e o gerenciamento de perfis, postagens e interações entre usuários. Ela oferece funcionalidades como cadastro de usuários, criação de postagens, interações como curtidas e comentários, além de funcionalidades de conexão entre usuários.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de execução JavaScript no lado do servidor.
- **Express**: Framework minimalista para Node.js, utilizado para criar a estrutura da API.
- **TypeScript**: Superconjunto de JavaScript que adiciona tipagem estática e outros recursos avançados.
- **Prisma**: ORM moderno que simplifica o acesso e manipulação de banco de dados.
- **Docker**: Plataforma de contêinerização utilizada para empacotar a aplicação e suas dependências.
- **PostgreSQL**: Banco de dados relacional utilizado para persistência dos dados.

## Como Rodar

Siga os passos abaixo para rodar a aplicação Birdo pela primeira vez.

### Pré-requisitos

Certifique-se de ter os seguintes itens instalados:

- **Docker** (e Docker Compose) instalado em sua máquina.
- **Node.js** e **npm** ou **yarn** instalados.

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/birdo-api.git
cd birdo-api
```

### 2. Rodar com Docker

A aplicação está configurada para ser executada facilmente com Docker. Para subir o ambiente:

```bash
docker-compose up --build
```

Esse comando irá:

1. Construir a imagem da aplicação Node.js.
2. Criar e configurar um contêiner PostgreSQL para o banco de dados.
3. Subir ambos os contêineres e executar a aplicação.

### 3. Rodar as Migrações do Prisma

Com a aplicação rodando, você precisa aplicar as migrações do banco de dados para garantir que todas as tabelas estejam corretamente criadas. Execute o seguinte comando:

```bash
docker-compose exec app npx prisma migrate deploy
```

Esse comando aplicará todas as migrações existentes.

### 4. Acesse a Aplicação

A API estará disponível em http://localhost:3000. Você pode testar os endpoints utilizando ferramentas como Postman ou Insomnia.
