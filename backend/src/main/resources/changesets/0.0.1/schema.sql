create table if not exists users (
  user_id BIGINT not null AUTO_INCREMENT,
  name VARCHAR(50) not null,
  age varchar(11) not null,
	salary double not null,
  username VARCHAR(50) unique not null,
  password VARCHAR(120) not null,
  email VARCHAR(50) unique not null,
  primary key (user_id)
) engine=InnoDB DEFAULT CHARSET=UTF8MB4;

create table if not exists roles (
  role_id BIGINT not null AUTO_INCREMENT,
  name VARCHAR(10) unique not null,
  primary key (role_id)
) engine=InnoDB DEFAULT CHARSET=UTF8MB4;

create table if not exists user_roles (
  user_id bigint not null,
  role_id bigint not null,
  foreign key (user_id) references users(user_id),
  foreign key (role_id) references roles(role_id)
) engine=InnoDB DEFAULT CHARSET=UTF8MB4;