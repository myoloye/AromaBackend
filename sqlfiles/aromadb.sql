CREATE TABLE User(
    id integer auto_increment primary key,
    username varchar(255) not null,
    email varchar(255) not null,
    password_digest varchar(255) not null,
    about varchar(300),
    unique key(email),
    unique key(username)
);

CREATE TABLE Token(
    id integer auto_increment primary key,
    token varchar(255) not null,
    unique key(token)
);

CREATE TABLE Recipe(
    id integer auto_increment primary key,
    title varchar(150) not null,
    description varchar(500),
    duration varchar(10) not null,
    image_url varchar(300),
    user_id integer,
    source_url varchar(300),
    source varchar(50),
    score decimal(8, 3) default '0',
    likes integer not null default '0',
    dislikes integer not null default '0',
    spoonacular_id integer,
    foreign key (user_id) references User(id)
);

CREATE TABLE Ingredient(
    id integer,
    name varchar(50),
    primary key(id, name);
);

CREATE TABLE Similar_Ingredient(
    ingredient_name varchar(30) not null,
    ingredient_id integer not null,
    foreign key (ingredient_id) references Ingredient(id),
    primary key (ingredient_name, ingredient_id)
);

CREATE TABLE Votes(
    id integer auto_increment primary key,
    user_id integer not null,
    recipe_id integer not null,
    type char(1) not null,
    foreign key (user_id) references User(id),
    foreign key (recipe_id) references Recipe(id),
    unique key (user_id, recipe_id)
);

CREATE TABLE Recipe_User_Saved(
    id integer auto_increment primary key,
    user_id integer not null,
    recipe_id integer not null,
    foreign key (user_id) references User(id),
    foreign key (recipe_id) references Recipe(id)
);

CREATE TABLE Category(
    id integer auto_increment primary key,
    name varchar(30) not null
);

CREATE TABLE Category_User(
    id integer auto_increment primary key,
    user_id integer not null,
    category_id integer not null,
    foreign key (user_id) references User(id),
    foreign key (category_id) references Category(id),
    unique key(user_id, category_id)
);

CREATE TABLE Category_Recipe(
    id integer auto_increment primary key,
    recipe_id integer not null,
    category_id integer not null,
    foreign key (recipe_id) references Recipe(id),
    foreign key (category_id) references Category(id),
    unique key(recipe_id, category_id)
);

CREATE TABLE Ingredient_Recipe(
    id integer auto_increment primary key,
    ingredient_id integer not null,
    recipe_id integer not null,
    original_string varchar(150) not null,
    us_amount decimal(8, 3) not null,
    us_unit varchar(15) not null,
    metric_amount decimal(8, 3) not null,
    metric_unit varchar(15) not null,
    extra_info varchar(150),
    foreign key(recipe_id) references Recipe(id),
    foreign key(ingredient_id) references Ingredient(id)
);

CREATE TABLE Instruction(
    id integer auto_increment primary key,
    recipe_id integer not null,
    step_num integer not null,
    instruction varchar(300) not null,
    unique key(recipe_id, step_num),
    foreign key (recipe_id) references Recipe(id)
);

CREATE TABLE Comment(
    id integer auto_increment primary key,
    recipe_id integer not null,
    user_id integer not null,
    comment varchar(300) not null,
    time_added timestamp not null default current_timestamp,
    foreign key(recipe_id) references Recipe(id),
    foreign key(user_id) references User(id)
);

DELIMITER //
CREATE FUNCTION calculateScore(id integer) returns DECIMAL(8, 3)
BEGIN
DECLARE score DECIMAL(8, 3);
    DECLARE likes INTEGER;
    DECLARE dislikes INTEGER;
    DECLARE glikes INTEGER;
    DECLARE gdislikes INTEGER;
    DECLARE r decimal(8, 3);
    DECLARE v integer;
    DECLARE m decimal(8, 3);
    DECLARE c decimal(8, 3);
    DECLARE gv integer;

    SET m = 1;

    SELECT Recipe.likes into likes from Recipe where Recipe.id = id;
    SELECT Recipe.dislikes into dislikes from Recipe where Recipe.id = id;
    SET v = likes + dislikes;
    SELECT count(*) into glikes from Votes where type = 'l';
    Select count(*) into gdislikes from Votes where type = 'd';
    SET gv = glikes + gdislikes;
    IF (v = 0) THEN
    	SET r = 0;
    ELSE
    	SET r = CAST(likes as DECIMAL(8, 3)) / v;
    END IF;
    SET c = CAST(glikes as DECIMAL(8, 3)) / (gv);
    SET score = ((CAST(v as DECIMAL(8, 3)) / (v + m)) * r) + ((m / (v + m)) * c);

    RETURN (score);
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION hasFood(id integer, food varchar(30)) returns INTEGER
BEGIN
    DECLARE numMatches INTEGER;

    SELECT count(*) into numMatches FROM ingredient_recipe WHERE ingredient_id IN (SELECT ingredient_id FROM similaringredient WHERE ingredient_name = food) AND recipe_id = id;

    IF (numMatches > 0) THEN
    	SET numMatches = 1;
    END IF;

    RETURN (numMatches);
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION getVote(uid integer, rid integer) returns char(1)
BEGIN
    DECLARE vote char(1);
    SELECT type into vote from votes where user_id = uid and recipe_id = rid;
    IF (type IS NULL) THEN
        SET vote = 'n';
    END IF;

    RETURN (vote);
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION hasSaved(uid integer, rid integer) returns boolean
BEGIN
    DECLARE saved boolean;
    DECLARE tempid integer;
    SELECT id into tempid from recipe_user_saved where user_id = uid and recipe_id = rid;
    IF (tempid IS NULL) THEN
        SET saved = 0;
    ELSE
        SET saved = 1;
    END IF;

    RETURN (saved);
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER changeScoresInsert AFTER INSERT ON Votes FOR EACH ROW BEGIN
    DECLARE num_likes INTEGER;
    DECLARE num_dislikes INTEGER;
    DECLARE v_finished INTEGER DEFAULT 0;
    DECLARE v_recipe_id INTEGER;
    DECLARE recipe_cursor CURSOR FOR
        SELECT id FROM Recipe;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_finished = 1;
    SELECT likes into num_likes from Recipe where id = NEW.recipe_id;
    SELECT dislikes into num_dislikes from Recipe where id = NEW.recipe_id;
    IF (NEW.type = 'l') THEN
        UPDATE Recipe SET likes = num_likes + 1 where id = NEW.recipe_id;
    ELSE
        UPDATE Recipe SET dislikes = num_dislikes + 1 where id = NEW.recipe_id;
    END IF;
    OPEN recipe_cursor;
    get_recipes: LOOP
        FETCH recipe_cursor INTO v_recipe_id;
        IF (v_finished = 1) THEN
            LEAVE get_recipes;
        END IF;
        UPDATE Recipe SET score = calculateScore(v_recipe_id) where id = v_recipe_id;
    END LOOP get_recipes;
    CLOSE recipe_cursor;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER changeScoresDelete AFTER DELETE ON Votes FOR EACH ROW BEGIN
    DECLARE num_likes INTEGER;
    DECLARE num_dislikes INTEGER;
    DECLARE v_finished INTEGER DEFAULT 0;
    DECLARE v_recipe_id INTEGER;
    DECLARE recipe_cursor CURSOR FOR
        SELECT id FROM Recipe;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_finished = 1;
    SELECT likes into num_likes from Recipe where id = OLD.recipe_id;
    SELECT dislikes into num_dislikes from Recipe where id = OLD.recipe_id;
    IF (Old.type = 'l') THEN
        UPDATE Recipe SET likes = num_likes - 1 where id = OLD.recipe_id;
    ELSE
        UPDATE Recipe SET dislikes = num_dislikes - 1 where id = OLD.recipe_id;
    END IF;
    OPEN recipe_cursor;
    get_recipes: LOOP
        FETCH recipe_cursor INTO v_recipe_id;
        IF (v_finished = 1) THEN
            LEAVE get_recipes;
        END IF;
        UPDATE Recipe SET score = calculateScore(v_recipe_id) where id = v_recipe_id;
    END LOOP get_recipes;
    CLOSE recipe_cursor;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER changeScoresUpdate AFTER UPDATE ON Votes FOR EACH ROW BEGIN
    DECLARE num_likes INTEGER;
    DECLARE num_dislikes INTEGER;
    DECLARE v_finished INTEGER DEFAULT 0;
    DECLARE v_recipe_id INTEGER;
    DECLARE recipe_cursor CURSOR FOR
        SELECT id FROM Recipe;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_finished = 1;
    SELECT likes into num_likes from Recipe where id = OLD.recipe_id;
    SELECT dislikes into num_dislikes from Recipe where id = OLD.recipe_id;
    IF (Old.type = 'l' AND NEW.type = 'd') THEN
        UPDATE Recipe SET likes = num_likes - 1 where id = OLD.recipe_id;
        UPDATE Recipe SET dislikes = num_dislikes + 1 where id = OLD.recipe_id;
    END IF;
    IF (OLD.type = 'd' AND NEW.type = 'l') THEN
        UPDATE Recipe SET dislikes = num_dislikes - 1 where id = OLD.recipe_id;
        UPDATE Recipe SET likes = num_likes + 1 where id = OLD.recipe_id;
    END IF;
    OPEN recipe_cursor;
    get_recipes: LOOP
        FETCH recipe_cursor INTO v_recipe_id;
        IF (v_finished = 1) THEN
            LEAVE get_recipes;
        END IF;
        UPDATE Recipe SET score = calculateScore(v_recipe_id) where id = v_recipe_id;
    END LOOP get_recipes;
    CLOSE recipe_cursor;
END//
DELIMITER ;
