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
