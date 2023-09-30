-- Adminer 4.8.1 PostgreSQL 15.4 dump

DROP TABLE IF EXISTS "permamessages";
DROP SEQUENCE IF EXISTS permamessages_id_seq;
CREATE SEQUENCE permamessages_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."permamessages" (
    "id" integer DEFAULT nextval('permamessages_id_seq') NOT NULL,
    "channel_id" character varying(32) NOT NULL,
    "sent_message_id" character varying(32),
    "content" text NOT NULL,
    CONSTRAINT "permamessages_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "welcome_channels";
DROP SEQUENCE IF EXISTS welcome_channels_id_seq;
CREATE SEQUENCE welcome_channels_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."welcome_channels" (
    "id" integer DEFAULT nextval('welcome_channels_id_seq') NOT NULL,
    "channel_id" character varying(32) NOT NULL,
    CONSTRAINT "welcome_channels_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


-- 2023-09-30 22:14:54.557823+02
