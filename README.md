# Arandu API [WIP]

This is the backend for the application that manages events' CFPs

## Local setup

### 1. Node && dependencies

The project uses Node 12 or above, and you can either install it manually or use [nvm](https://github.com/nvm-sh/nvm) as there's a `.nvmrc` file.

You can use either `Yarn` or `NPM` for the dependencies, but have in mind that we use `Yarn`, so if you are planning on changing dependencies, you'll probably want to use it too.

```sh
yarn
#OR npm i
```

### 2. Database && ENV

The API uses a PostgreSQL database, and you can setup it manually or use the `docker-compose.yml` on the repository.

There's an `.env.example` file you can copy with the variables ready for Docker database, but if you are going with the manual approach, you can't remove the variables above the `# API` comment.

In any case, here's a reference table for the variables:

| Var | Default value |
| --- | ------------- |
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `5432` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | - |
| `DB_NAME` | `arandu` |
| `DB_LOGGING` | - |

> `DB_LOGGING` is a _"boolean"_, if `true`, it will print the queries on the terminal.

### 3. Database && setup

Once the variables for the database connection are ready, you can use the DB CLI commands in order to create the tables and add some dummy data.

```sh
yarn cli:dev db --help
# OR npm run yarn cli:dev db --help
```

There you'll see the commands for entities synchronization and seeding; you should run both.

```sh
yarn cli:dev db sync
# OR npm run yarn cli:dev db sync
yarn cli:dev db seed
# OR npm run yarn cli:dev db seed
```

### 4. App && Env

For now, there's only one variable for the "the application itself", and that's the `PORT`, needed to specify in which HTTP port will the server run.

**Make sure your env has a `PORT` variable**.

### 5. Running the application

```sh
yarn start:dev
# OR npm run start:dev
```

### 6. Postman collection

On the `/meta` directory you'll find a [Postman](https://www.postman.com/) collection you can import in order to play with some of the endpoints. It only has one variable you have to update and that's the base URL of the API.