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


CREATE TYPE enum_characteristic_type AS ENUM (
    'attribute',
    'divider'
);

ALTER TABLE ONLY characteristics
    ADD COLUMN type enum_characteristic_type DEFAULT 'attribute'::enum_characteristic_type NOT NULL;

UPDATE characteristics SET type = 'attribute';

UPDATE pg_attribute SET atttypmod = 104
WHERE attrelid = 'characteristics'::regclass
AND attname = 'characteristic';

--
-- Data for Name: characteristics; Type: TABLE DATA; Schema: public;
--
COPY characteristics (id, characteristic, type) FROM stdin;
8	однородное прилагательное	attribute
9	однородное местоимение	attribute
10	неоднородное прилагательное	attribute
11	приложение  attribute
12	частица divider
13	союз  divider
14	предлог divider
15	глагол	divider
16	существительное	divider
17	прилагательное	divider
18	причастие	divider
19	местоимение	divider
\.


--
-- Data for Name: expansion_for_characteristics; Type: TABLE DATA; Schema: public;
--
--
-- Data for Name: texts; Type: TABLE DATA; Schema: public;
--
-- COPY  (id, expansion, characteristic_id) FROM stdin;
--
-- PostgreSQL database dump complete
--
