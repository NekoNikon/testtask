--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bosses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bosses (
    e_id integer NOT NULL,
    b_id integer NOT NULL
);


ALTER TABLE public.bosses OWNER TO postgres;

--
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    id integer NOT NULL,
    fname character varying(256) NOT NULL,
    sname character varying(255) NOT NULL,
    tname character varying(255),
    address text NOT NULL,
    "position" text NOT NULL,
    department text NOT NULL
);


ALTER TABLE public.employee OWNER TO postgres;

--
-- Name: employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employee_id_seq OWNER TO postgres;

--
-- Name: employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_id_seq OWNED BY public.employee.id;


--
-- Name: employee id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee ALTER COLUMN id SET DEFAULT nextval('public.employee_id_seq'::regclass);


--
-- Data for Name: bosses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bosses (e_id, b_id) FROM stdin;
18	19
\.


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (id, fname, sname, tname, address, "position", department) FROM stdin;
20	Никон	Долгушин	Львович	Дубровное	инжинер прогаммист	IT
19	Петров	Петров	Петров	Петропавловск	Team lead	IT
18	Иван	Иванов	Иванович	Петропавловск	Программист, джун	IT
\.


--
-- Name: employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_id_seq', 27, true);


--
-- PostgreSQL database dump complete
--

