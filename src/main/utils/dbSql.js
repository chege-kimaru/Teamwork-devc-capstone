const dbCreateSql = `
create table users
(
    id serial primary key,
    email varchar(255) not null,
    password varchar(255) not null,
    role integer not null default 2,
    createdAt timestamp not null default now(),
    updatedAt timestamp not null default now()
);

create table employees
(
    id integer primary key references users(id),
    firstName varchar(255) not null,
    lastName varchar(255) not null,
    gender varchar(10) not null,
    jobRole varchar(255) not null,
    department varchar(255) not null,
    address varchar(255) null,
    createdAt timestamp not null default now(),
    updatedAt timestamp not null default now()
);

create table gifs
(
    id serial primary key,
    employeeId integer not null references employees(id),
    title varchar(255) not null,
    imageUrl varchar(255) not null,
    status integer not null default 1,
    createdAt timestamp not null default now(),
    updatedAt timestamp not null default now()
);

create table articles
(
    id serial primary key,
    employeeId integer not null references employees(id),
    title varchar(255) not null,
    article text not null,
    tags varchar(255) null,
    status integer not null default 1,
    createdAt timestamp not null default now(),
    updatedAt timestamp not null default now()
);

create table gifComments
(
    id serial primary key,
    employeeId integer not null references employees(id),
    gifId integer not null references gifs(id),
    commentm text not null,
    status integer not null default 1,
    createdAt timestamp not null default now(),
    updatedAt timestamp not null default now()
);

create table articleComments
(
    id serial primary key,
    employeeId integer not null references employees(id),
    articleId integer not null references articles(id),
    commentm text not null,
    status integer not null default 1,
    createdAt timestamp not null default now(),
    updatedAt timestamp not null default now()
);

create table inappropriateFlags
(
    id serial primary key,
    employeeId integer not null references employees(id),
    articleId integer null references articles(id),
    gifId integer null references gifs(id),
    gifCommentId integer null references gifComments(id),
    articleCommentId integer null references articleComments(id),
    createdAt timestamp not null default now(),
    updatedAt timestamp not null default now()
);`;

const dbDropSql = `
drop table if exists inappropriateFlags;
drop table if exists articleComments;
drop table if exists gifComments;
drop table if exists articles;
drop table if exists gifs;
drop table if exists employees;
drop table if exists users;
drop table if exists usersm;
`;

export default {
  dbCreateSql, dbDropSql,
};
