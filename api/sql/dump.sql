SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

CREATE SEQUENCE IF NOT EXISTS texts_ids
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TYPE enum_texts_status AS ENUM (
    'd',
    'u',
	'a'
);

CREATE TABLE IF NOT EXISTS texts (
    id integer DEFAULT nextval('texts_ids'::regclass) NOT NULL,
    text character(100000) NOT NULL,
	title character(100) NOT NULL,
    status enum_texts_status DEFAULT 'u'::enum_texts_status NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

ALTER TABLE ONLY texts
    ADD CONSTRAINT texts_pkey PRIMARY KEY (id);
	
CREATE SEQUENCE IF NOT EXISTS collacations_ids
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TYPE enum_collacations_charact_1 AS ENUM (
    '3xmem',
    'distant',
	'interpos',
	'postpos',
	'prepos',
	'attach'
);

CREATE TABLE IF NOT EXISTS collacations (
    id integer DEFAULT nextval('collacations_ids'::regclass) NOT NULL,
    status enum_texts_status DEFAULT 'u'::enum_texts_status NOT NULL,
	collacation character(100) NOT NULL,
    charact_1 enum_collacations_charact_1 DEFAULT NULL,
	charact_2 integer[] DEFAULT ARRAY[]::integer[] NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    text_id integer
);

ALTER TABLE ONLY collacations
    ADD CONSTRAINT collacations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY collacations
    ADD CONSTRAINT collacations_text_id_fkey FOREIGN KEY (text_id) REFERENCES texts(id) ON UPDATE CASCADE ON DELETE CASCADE;
	
CREATE SEQUENCE IF NOT EXISTS characteristics_ids
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE IF NOT EXISTS characteristics (
    id integer DEFAULT nextval('characteristics_ids'::regclass) NOT NULL,
    characteristic character(50),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

ALTER TABLE ONLY characteristics
    ADD CONSTRAINT characteristics_pkey PRIMARY KEY (id);
	
CREATE FUNCTION on_create() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  BEGIN
    EXECUTE format('UPDATE %I SET "created_at" = now(), "updated_at" = now() WHERE id = $1.id', TG_TABLE_NAME) USING NEW;
    RETURN NULL;
  END;
$_$;

CREATE FUNCTION on_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  BEGIN
    IF OLD.updated_at = NEW.updated_at THEN
      EXECUTE format('UPDATE %I SET "updated_at" = now() WHERE id = $1.id', TG_TABLE_NAME) USING NEW;
    END IF;
    RETURN NULL;
  END;
$_$;

CREATE TRIGGER on_text_create AFTER INSERT ON texts FOR EACH ROW EXECUTE PROCEDURE on_create();
CREATE TRIGGER on_collacation_create AFTER INSERT ON collacations FOR EACH ROW EXECUTE PROCEDURE on_create();
CREATE TRIGGER on_characteristic_create AFTER INSERT ON characteristics FOR EACH ROW EXECUTE PROCEDURE on_create();

CREATE TRIGGER on_text_update AFTER UPDATE ON texts FOR EACH ROW EXECUTE PROCEDURE on_update();
CREATE TRIGGER on_collacation_update AFTER UPDATE ON collacations FOR EACH ROW EXECUTE PROCEDURE on_update();
CREATE TRIGGER on_characteristic_update AFTER UPDATE ON characteristics FOR EACH ROW EXECUTE PROCEDURE on_update();