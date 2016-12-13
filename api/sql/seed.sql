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

--
-- Data for Name: characteristics; Type: TABLE DATA; Schema: public;
--
COPY characteristics (id, characteristic) FROM stdin;
1	нечленное прилагательное
2	членное прилагательное
3	существительное
4	нечленное причастие
5	членное причастие
6	местоимение
7	числительное
\.

--
-- Data for Name: expansion_for_characteristics; Type: TABLE DATA; Schema: public;
--
COPY characteristics_expansion (id, expansion, characteristic_id) FROM stdin;
1	конкретное	3
2	абстрактное	3
3	вещественное	3
4	качественное	1
5	относительное	1
6	притяжательное	1
7	качественное	2
8	относительное	2
9	притяжательное	2
10	относительное	6
11	неопределенное	6
12	притяжательное 	6
13	вопросительное	6
14	отрицательное	6
15	определительное	6
16	указательное	6
17	страдательное	4
18	действительное	4
19	страдательное	5
20	действительное	5
21	порядковое	7
22	количественное	7
\.

--
-- Data for Name: texts; Type: TABLE DATA; Schema: public;
--
COPY  (id, expansion, characteristic_id) FROM stdin;
--
-- PostgreSQL database dump complete
--
