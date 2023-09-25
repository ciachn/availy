/* ******************************************************************************************* */
DROP TABLE IF EXISTS ##directives;
DROP TABLE IF EXISTS ##sessions;
DROP TABLE IF EXISTS ##user_privileges;
DROP TABLE IF EXISTS ##privileges;
DROP TABLE IF EXISTS ##users;


/* ********************************************************** */
CREATE TABLE ##users
(
    user_id int unsigned primary key auto_increment,
    created datetime default null,

    is_active tinyint not null default 1,
    index idx_is_active (is_active),

    is_authorized tinyint not null default 1,

    name varchar(256) default '',
    phone varchar(32) default '',

    username varchar(256) not null,
    index idx_username (is_active, username),

    password varchar(96) not null
)
ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=1;


CREATE TABLE ##privileges
(
    privilege_id int unsigned primary key,
    name varchar(128) not null unique key
)
ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO ##privileges (privilege_id, name) VALUES (1, 'family');
INSERT INTO ##privileges (privilege_id, name) VALUES (2, 'work');


CREATE TABLE ##user_privileges
(
    user_id int unsigned not null,
    foreign key (user_id) references ##users (user_id),

    privilege_id int unsigned not null,
    foreign key (privilege_id) references ##privileges (privilege_id),

    primary key (user_id, privilege_id),

    tag tinyint default 0,
    index idx_tag (user_id, tag)
)
ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


/* ******************************************************************************************* */
CREATE TABLE ##sessions
(
	session_id varchar(48) primary key unique not null,

	created datetime default null,
	last_activity datetime default null,

	device_id varchar(48) default null,
    index idx_device_id (device_id),

	user_id int unsigned default null,
	foreign key (user_id) references ##users (user_id),

	data varchar(8192) default null
)
ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


/* ******************************************************************************************* */
CREATE TABLE ##directives
(
	subject_id int unsigned not null default 0,
	type varchar(128) not null,
    primary key (subject_id, type),

	modified datetime,

	s_value varchar(8192) default null,
	i_value int default 0,
	t_value blob default null
)
ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=1;
