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

-- NEW FOR CHARACTERISTICS EXPANSIONS
COPY characteristics_expansion (id, expansion, characteristic_id) FROM stdin;
23	личное	6
24	возвратное	6
\.

-- NEW FOR CHARACTERISTICS
COPY characteristics (id, characteristic, type) FROM stdin;
20	числительное	divider
\.


--
-- PostgreSQL database dump complete
--