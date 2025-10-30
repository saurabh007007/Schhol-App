# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## docker runing db

```bash
docker run --name schoool-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=school \
  -e POSTGRES_DB=schooldb \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  -d postgres:16


```
