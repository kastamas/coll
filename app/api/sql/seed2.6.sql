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


-- ALter Types for ENUM
ALTER TYPE enum_characteristic_substantive_case_type ADD VALUE 'vocative';--Для нового звательного падежа

-- Запрос на добавление
ALTER TYPE enum_chardacteristic_relation_to_main ADD VALUE 'distant_prepos';--Для нового звательного падежа

-- Запрос на доп Enum
ALTER TYPE enum_characteristic_relation_to_main ADD VALUE 'distant_postpos';

-- Update --
UPDATE collocations  SET characteristic_relation_to_main = 'distant_prepos' WHERE characteristic_relation_to_main = 'distant';

--
-- PostgreSQL database dump complete
--