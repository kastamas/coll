--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

UPDATE characteristics SET characteristic = 'однородные прилагательные' WHERE id = 8;
UPDATE characteristics SET characteristic = 'однородные   местоимения' WHERE id = 9;
UPDATE characteristics SET characteristic = 'неоднородные прилагательные' WHERE id = 10;

ALTER TABLE ONLY collocations
    ADD COLUMN characteristic_attr1_explicit integer DEFAULT null;

ALTER TABLE ONLY collocations
    ADD COLUMN  characteristic_attr2_explicit integer DEFAULT null;

--
-- PostgreSQL database dump complete heh
--
