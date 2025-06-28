/*==============================================================*/
/* DBMS name:      PostgreSQL 8                                 */
/* Created on:     28/6/2025 11:29:29                           */
/*==============================================================*/
/*==============================================================*/
/* Table: actions                                               */
/*==============================================================*/
create table actions (
   ACTIONS_ID           SERIAL               not null,
   USERS_ID             INT4                 not null,
   ACTIONS_DESCRIPTION  VARCHAR(256)         not null,
   ACTIONS_DATE         DATE                 not null,
   constraint PK_ACTIONS primary key (ACTIONS_ID)
);

/*==============================================================*/
/* Table: activity                                              */
/*==============================================================*/
create table activity (
   ACTIVITY_ID          SERIAL               not null,
   ENVIRONMENTALPLAN_ID INT4                 not null,
   ACTIVITY_ASPECT      VARCHAR(255)         not null,
   ACTIVITY_IMPACT      VARCHAR(255)         not null,
   ACTIVITY_MEASURE     VARCHAR(255)         not null,
   ACTIVITY_VERIFICATION VARCHAR(255)        not null,
   ACTIVITY_FRECUENCY   VARCHAR(255)         not null,
   CREATEDAT            TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
   UPDATEDAT            TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
   constraint PK_ACTIVITY primary key (ACTIVITY_ID)
);

/*==============================================================*/
/* Table: control                                               */
/*==============================================================*/
create table control (
   CONTROL_ID           SERIAL               not null,
   ACTIVITY_ID          INT4                 not null,
   CONTROL_CREATEDBY    VARCHAR(255)         not null,
   CONTROL_CRITERION    VARCHAR(128)         not null,
   CONTROL_OBSERVATION  VARCHAR(255)         not null,
   CONTROL_EVIDENCE     VARCHAR(512)         not null,
   CONTROL_VERIFICATION VARCHAR(255)         not null,
   CREATEDAT            TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
   UPDATEDAT            TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
   constraint PK_CONTROL primary key (CONTROL_ID)
);

/*==============================================================*/
/* Table: environmentalplan                                     */
/*==============================================================*/
create table environmentalplan (
   ENVIRONMENTALPLAN_ID SERIAL               not null,
   PROJECT_ID           INT4                 not null,
   ENVIRONMENTALPLAN_NAME VARCHAR(128)        not null,
   ENVIRONMENTALPLAN_DESCRIPTION VARCHAR(512) not null,
   ENVIRONMENTALPLAN_STAGE VARCHAR(255)        not null,
   ENVIRONMENTALPLAN_PROCESS VARCHAR(255)      not null,
   CREATEDAT            TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
   UPDATEDAT            TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
   constraint PK_ENVIRONMENTALPLAN primary key (ENVIRONMENTALPLAN_ID)
);

/*==============================================================*/
/* Table: events                                                */
/*==============================================================*/
create table events (
   EVENTS_ID            SERIAL               not null,
   USERS_ID             INT4                 not null,
   EVENTS_NAME          VARCHAR(64)          not null,
   EVENTS_STARTDATE     DATE                 not null,
   EVENTS_ENDDATE       DATE                 not null,
   EVENTS_DESCRIPTION   VARCHAR(64)          not null,
   constraint PK_EVENTS primary key (EVENTS_ID)
);

/*==============================================================*/
/* Table: monitoring                                            */
/*==============================================================*/
create table monitoring (
   MONITORING_ID        SERIAL               not null,
   PROJECT_ID           INT4                 not null,
   MONITORING_NAME      CHAR(255)            not null,
   MONITORING_DESCRIPTION VARCHAR(512)       not null,
   MONITORING_EVIDENCE  VARCHAR(512)         not null,
   MONITORING_OBSERVATIONS VARCHAR(512)      not null,
   MONITORING_IMAGE     CHAR(255)            not null,
   MONITORING_FOLDER    CHAR(255)            not null,
   constraint PK_MONITORING primary key (MONITORING_ID)
);

/*==============================================================*/
/* Table: permit                                                */
/*==============================================================*/
create table permit (
   PERMIT_ID            SERIAL               not null,
   PROJECT_ID           INT4                 not null,
   PERMIT_NAME          VARCHAR(128)         not null,
   PERMIT_DESCRIPTION   VARCHAR(256)         not null,
   PERMIT_ARCHIVE       VARCHAR(256)         not null,
   constraint PK_PERMIT primary key (PERMIT_ID)
);

/*==============================================================*/
/* Table: profiles                                              */
/*==============================================================*/
create table profiles (
   PROFILES_ID          SERIAL               not null,
   PROFILES_NAME        VARCHAR(64)          not null,
   PROFILES_READPROJECTS BOOL                 null,
   PROFILES_CREATEPROJECTS BOOL                 null,
   PROFILES_UPDATEPROJECTS BOOL                 null,
   PROFILES_DELETEPROJECTS BOOL                 null,
   PROFILES_READAMBIENTALPLANS BOOL                 null,
   PROFILES_CREATEAMBIENTALPLANS BOOL                 null,
   PROFILES_UPDATEAMBIENTALPLANS BOOL                 null,
   PROFILES_DELETEAMBIENTALPLANS BOOL                 null,
   PROFILES_READMONITORINGS BOOL                 null,
   PROFILES_WRITEMONITORINGS BOOL                 null,
   PROFILES_UPDATEMONITORINGS BOOL                 null,
   PROFILES_DELETEMONITORINGS BOOL                 null,
   PROFILES_CREATEACTIVITIES BOOL                 null,
   PROFILES_READACTIVITIES BOOL                 null,
   PROFILES_UPDATEACTIVITIES BOOL                 null,
   PROFILES_DELETEACTIVITIES BOOL                 null,
   PROFILES_CREATEEVENTS BOOL                 null,
   PROFILES_READEVENTS  BOOL                 null,
   PROFILES_UPDATEEVENTS BOOL                 null,
   PROFILES_DELETEEVENTS BOOL                 null,
   PROFILES_CREATEUSERS BOOL                 null,
   PROFILES_READUSERS   BOOL                 null,
   PROFILES_UPDATEUSERS BOOL                 null,
   PROFILES_DELETEUSERS BOOL                 null,
   PROFILES_CREATEPROFILES BOOL                 null,
   PROFILES_UPDATEPROFILES BOOL                 null,
   PROFILES_READPROFILES BOOL                 null,
   PROFILES_DELETEPROFILES BOOL                 null,
   PROFILES_READACTIONS BOOL                 null,
   PROFILES_READCONTROL BOOL                 null,
   PROFILES_CREATECONTROL BOOL                 null,
   PROFILES_DELETECONTROL BOOL                 null,
   PROFILES_UPDATECONTROL BOOL                 null,
   PROFILES_READPERMIT  BOOL                 null,
   PROFILES_CREATEPERMIT BOOL                 null,
   PROFILES_UPDATEPERMIT BOOL                 null,
   PROFILES_DELETEPERMIT BOOL                 null,
   PROFILES_READREMINDER BOOL                 null,
   PROFILES_CREATEREMINDER BOOL                 null,
   PROFILES_DELETEREMINDER BOOL                 null,
   PROFILES_UPDATEREMINDER BOOL                 null,
   PROFILES_STATE       VARCHAR(32)          null default 'ACTIVE',
   constraint PK_PROFILES primary key (PROFILES_ID)
);

/*==============================================================*/
/* Table: project                                               */
/*==============================================================*/
create table project (
   PROJECT_ID           SERIAL               not null,
   PROJECT_NAME         VARCHAR(128)         not null,
   PROJECT_STARTDATE    DATE                 not null,
   PROJECT_STATE        CHAR(64)             not null,
   PROJECT_LOCATION     CHAR(128)            not null,
   PROJECT_IMAGE        CHAR(255)            not null,
   PROJECT_DESCRIPTION  CHAR(255)            not null,
   constraint PK_PROJECT primary key (PROJECT_ID)
);

/*==============================================================*/
/* Table: project_customer                                      */
/*==============================================================*/
create table project_customer (
   USERS_ID             INT4                 null default NULL,
   PROJECT_ID           INT4                 null default NULL
);

/*==============================================================*/
/* Table: reminder                                              */
/*==============================================================*/
create table reminder (
   REMINDER_ID          SERIAL               not null,
   PROJECT_ID           INT4                 not null,
   REMINDER_REGISTERDATE DATE                 null default CURRENT_TIMESTAMP,
   REMINDER_TOREMEMBERDATE DATE                 not null,
   REMINDER_TITLE       VARCHAR(32)          not null,
   REMINDER_CONTENT     VARCHAR(128)         not null,
   REMINDER_STATE       VARCHAR(32)          null default 'ACTIVE',
   constraint PK_REMINDER primary key (REMINDER_ID)
);

/*==============================================================*/
/* Table: users                                                 */
/*==============================================================*/
create table users (
   USERS_ID             SERIAL               not null,
   PROFILES_ID          INT4                 not null,
   USERS_NAME           VARCHAR(64)          not null,
   USERS_SURNAME        VARCHAR(64)          not null,
   USERS_PERSONAL_ID    VARCHAR(11)          not null,
   USERS_BORNDATE       DATE                 not null,
   USERS_EMAIL          VARCHAR(128)         not null,
   USERS_PHONENUMBER    VARCHAR(16)          not null,
   USERS_USERS          VARCHAR(64)          not null,
   USERS_PASSWORD       VARCHAR(128)         not null,
   USERS_STATE          VARCHAR(32)          null default 'ACTIVE',
   constraint PK_USERS primary key (USERS_ID)
);

alter table actions
   add constraint FK_DOES foreign key (USERS_ID)
      references users (USERS_ID);

alter table activity
   add constraint FK_GENERATES foreign key (ENVIRONMENTALPLAN_ID)
      references environmentalplan (ENVIRONMENTALPLAN_ID);

alter table control
   add constraint FK_CONTAINS foreign key (ACTIVITY_ID)
      references activity (ACTIVITY_ID);

alter table environmentalplan
   add constraint FK_MANAGES foreign key (PROJECT_ID)
      references project (PROJECT_ID);

alter table events
   add constraint FK_PROGRAMS foreign key (USERS_ID)
      references users (USERS_ID);

alter table monitoring
   add constraint FK_HAS foreign key (PROJECT_ID)
      references project (PROJECT_ID);

alter table permit
   add constraint FK_REQUIRES foreign key (PROJECT_ID)
      references project (PROJECT_ID);

alter table project_customer
   add constraint FK_REFERENCE_13 foreign key (USERS_ID)
      references users (USERS_ID);

alter table project_customer
   add constraint FK_PROJECT__REFERENCE_PROJECT foreign key (PROJECT_ID)
      references project (PROJECT_ID)
      on delete restrict on update restrict;

alter table reminder
   add constraint FK_CREATES foreign key (PROJECT_ID)
      references project (PROJECT_ID);

alter table users
   add constraint FK_HASA foreign key (PROFILES_ID)
      references profiles (PROFILES_ID);
