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


-- Deleting 8,9 from collacations
DELETE FROM public.characteristics WHERE id = '8' OR id = '9';


-- Char_Expansions NORMALIZE


--
-- PostgreSQL database dump complete
--