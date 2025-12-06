# Time Tracker V2

A FOSS time tracker. This can be used to track how much time is spent on different activities.

Remaking this project so it has more features + a more polished UX/UI

V1: https://github.com/not-a-ethan/time-tracker

## Dev

### Databse

This project uses a PostgreSQL databse. Below is the quries to create all the tables.

#### User table

```sql
CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "name" text NOT NULL
);
```

#### Project table

```sql
CREATE TABLE "projects" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq"),
  "name" text NOT NULL,
  "description" text,
  "color" text NOT NULL,
  "owner" integer NOT NULL,
  "collaborators" text NOT NULL
);
```

`collaborators` column should be a comma seperated list of user IDs.

#### Time Entry table

```sql
CREATE TABLE "timeentries" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "timeentries_id_seq"),
  "projectid" integer NOT NULL,
  "name" text NOT NULL,
  "starttime" integer NOT NULL,
  "endtime" integer,
  "owner" integer NOT NULL
);
```

### Envirment varibles

```env
GITHUB_ID=<GH OAuth app id>
GITHUB_SECRET=<GH OAuth app secret>

NEXTAUTH_URL=<URL of deployed app (including protocal)>
AUTH_SECRET=<See https://next-auth.js.org/configuration/options#nextauth_secret>

PGHost=<PostgreSQL host>
PGPORT=5432
PGDATABASE=<PostgreSQL databse>
PGUSER=<PostgreSQL user>
PGPASSWORD=<PostgreSQL user password>
```