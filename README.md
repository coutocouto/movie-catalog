# Another movie API

Uma CRUD de filmes

## Tecnologias usadas

- **TypeScript**:
- **Nest.js**
- **TypeORM**
- **Swagger**
- **Docker**
- **Redis**
- **PostgreSQL**

### Pré-requisitos

- Docker e Docker Compose
- Node.js e Yarn

### Instalação

Clone o repositório:

```bash
git clone https://github.com/coutocouto/movie-catalog.git
cd movie-catalog
```

Instale as dependerias usando yarn:

```bash
yarn install
```

### Configuração

Copie o env.example para um .env e preencha os valores

```bash
cp .env.example .env
```

### Rodando docker

Suba os containers do Docker necessários para rodar

```bash
docker-compose up -d
```

### Rodando a aplicação

Para rodar aplicação use:

```bash
yarn start
```

### Acessando a aplicação

- A Aplicação vai estar rodando em: [http://localhost:3000](http://localhost:3000)
- Acesse a documentação da API em : [http://localhost:3000/api/](http://localhost:3000/api/)
