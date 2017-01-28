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


-- New Field for collocations -> characteristic_preposition
CREATE TYPE enum_characteristic_preposition_type AS ENUM (
    'prepositional',
    'non-prepositional'
);

ALTER TABLE ONLY collocations
    ADD COLUMN characteristic_preposition enum_characteristic_preposition_type;
--

--
-- New Fields for collocations -> characteristic_substantive
--
CREATE TYPE enum_characteristic_substantive_lg_type AS ENUM (
    'appellative',
    'own'
);

ALTER TABLE ONLY collocations
    ADD COLUMN characteristic_substantive_lg enum_characteristic_substantive_lg_type;
--
--
CREATE TYPE enum_characteristic_substantive_lg_explicit_type AS ENUM (
    'real',
    'specific',
    'collective',
    'abstract'
);

ALTER TABLE ONLY collocations
    ADD COLUMN characteristic_substantive_lg_explicit enum_characteristic_substantive_lg_explicit_type;
--
--
CREATE TYPE enum_characteristic_substantive_animacy_type AS ENUM (
    'animated',
    'not-animated'
);

ALTER TABLE ONLY collocations
    ADD COLUMN characteristic_substantive_animacy enum_characteristic_substantive_animacy_type;
--
--
CREATE TYPE enum_characteristic_substantive_case_type AS ENUM (
    'nominative',
    'genitive',
    'dative',
    'accusative',
    'instrumental',
    'prepositional'
);

ALTER TABLE ONLY collocations
    ADD COLUMN characteristic_substantive_case enum_characteristic_substantive_case_type;
--
-- PostgreSQL database dump complete
--