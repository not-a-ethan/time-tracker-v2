# Time Tracker V2

A FOSS time tracker. This can be used to track how much time is spent on different activities.

V1: https://github.com/not-a-ethan/time-tracker

## Dev

### Databse

This project uses a PostgreSQL databse. Below is the quries to create all the tables.

#### User table

```sql
CREATE TABLE "users" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq"),
  "githubId" integer NOT NULL UNIQUE,
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
CREATE TABLE "timeEntries" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "timeEntries_id_seq"),
  "projectId" integer NOT NULL,
  "name" text NOT NULL,
  "startTime" integer NOT NULL,
  "endTime" integer,
  "owner" integer NOT NULL
);
```