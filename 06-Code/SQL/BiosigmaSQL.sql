/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     17/05/2025 11:29:56                          */
/*==============================================================*/


drop table if exists ACTIONS;

drop table if exists ACTIVITY;

drop table if exists AMBIENTALPLAN;

drop table if exists EVENTS;

drop table if exists EVIDENCE;

drop table if exists LOCATIONS;

drop table if exists MONITORING;

drop table if exists PERMIT;

drop table if exists PROFILES;

drop table if exists PROJECT;

drop table if exists REMINDER;

drop table if exists SUPERVISITONPERIOD;

drop table if exists USERS;

Create database biosigma_db;
/*==============================================================*/
/* Table: PROFILES                                               */
/*==============================================================*/

create table PROFILES
(
   PROFILES_ID           int not null Auto_increment,
   PROFILES_NAME         varchar(64) not null,
   PROFILES_READPROJECTS boolean,
   PROFILES_CREATEPROJECTS boolean,
   PROFILES_UPDATEPROJECTS boolean,
   PROFILES_DELETEPROJECTS boolean,
   PROFILES_READAMBIENTALPLANS boolean,
   PROFILES_CREATEAMBIENTALPLANS boolean,
   PROFILES_UPDATEAMBIENTALPLANS boolean,
   PROFILES_DELETEAMBIENTALPLANS boolean,
   PROFILES_READMONITORINGS boolean,
   PROFILES_WRITEMONITORINGS boolean,
   PROFILES_UPDATEMONITORINGS boolean,
   PROFILES_DELETEMONITORINGS boolean,
   PROFILES_CREATEACTIVITIES boolean,
   PROFILES_READACTIVITIES boolean,
   PROFILES_UPDATEACTIVITIES boolean,
   PROFILES_DELETEACTIVITIES boolean,
   PROFILES_CREATEEVENTS boolean,
   PROFILES_READEVENTS   boolean,
   PROFILES_UPDATEEVENTS boolean,
   PROFILES_DELETEEVENTS boolean,
   PROFILES_CREATEUSERS  boolean,
   PROFILES_READUSERS    boolean,
   PROFILES_UPDATEUSERS  boolean,
   PROFILES_DELETEUSERS  boolean,
   PROFILES_CREATEPROFILES boolean,
   PROFILES_UPDATEPROFILES boolean,
   PROFILES_READPROFILES boolean,
   PROFILES_DELETEPROFILES boolean,
   PROFILES_READACTIONS  boolean,
   PROFILES_READSUPERVISIONPERIOD boolean,
   PROFILES_CREATESUPERVISIONPERIOD boolean,
   PROFILES_DELETESUPERVISIONPERIOD boolean,
   PROFILES_UPDATESUPERVISIONPERIOD boolean,
   PROFILES_READPERMIT   boolean,
   PROFILES_CREATEPERMIT boolean,
   PROFILES_UPDATEPERMIT boolean,
   PROFILES_DELETEPERMIT boolean,
   PROFILES_READREMINDER boolean,
   PROFILES_CREATEREMINDER boolean,
   PROFILES_DELETEREMINDER boolean,
   PROFILES_UPDATEREMINDER boolean,
   primary key (PROFILES_ID)
);

/*==============================================================*/
/* Table: USERS                                                  */
/*==============================================================*/
create table USERS
(
   USERS_ID              int not null Auto_increment,
   PROFILES_ID           int not null,
   USERS_NAME            varchar(64) not null,
   USERS_SURNAME         varchar(64) not null,
   USERS_BORNDATE        date not null,
   USERS_EMAIL           varchar(128) not null,
   USERS_PHONENUMBER     varchar(16) not null,
   USERS_USERS            varchar(64) not null,
   USERS_PASSWORD        varchar(128) not null,
   primary key (USERS_ID)
);

/*==============================================================*/
/* Table: ACTIONS                                               */
/*==============================================================*/
create table ACTIONS
(
   ACTIONS_ID           int not null Auto_increment,
   USERS_ID              int not null,
   ACTIONS_DESCRIPTION  varchar(256) not null,
   ACTIONS_DATE         date not null,
   primary key (ACTIONS_ID)
);

/*==============================================================*/
/* Table: ACTIVITY                                              */
/*==============================================================*/
create table ACTIVITY
(
   ACTIVITY_ID          int not null Auto_increment,
   AMBIENTALPLAN_ID     int not null,
   USERS_ID              int not null,
   ACTIVITY_NAME        varchar(64) not null,
   ACTIVITY_OBJECTIVE   varchar(64) not null,
   ACTIVITY_TYPE        varchar(128) not null,
   ACTIVITY_DATE        date not null,
   primary key (ACTIVITY_ID)
);

/*==============================================================*/
/* Table: AMBIENTALPLAN                                         */
/*==============================================================*/
create table AMBIENTALPLAN
(
   AMBIENTALPLAN_ID     int not null Auto_increment,
   PROJECT_ID           int not null,
   AMBIENTALPLAN_NAME   varchar(128) not null,
   AMBIENTALPLAN_STARTDATE date not null,
   AMBIENTALPLAN_ENDDATE date not null,
   AMBIENTALPLAN_DESCRIPTION varchar(512) not null,
   AMBIENTALPLAN_TYPE   varchar(64) not null,
   AMBIENTALPLAN_OBJECTIVE varchar(64) not null,
   primary key (AMBIENTALPLAN_ID)
);

/*==============================================================*/
/* Table: EVENTS                                                 */
/*==============================================================*/
create table EVENTS
(
   EVENTS_ID             int not null Auto_increment,
   USERS_ID              int not null,
   EVENTS_NAME           varchar(64) not null,
   EVENTS_STARTDATE      date not null,
   EVENTS_ENDDATE        date not null,
   EVENTS_DESCRIPTION    varchar(64) not null,
   primary key (EVENTS_ID)
);

/*==============================================================*/
/* Table: EVIDENCE                                              */
/*==============================================================*/
create table EVIDENCE
(
   EVIDENCE_ID          int not null Auto_increment,
   SUPERVISITONPERIOD_ID int not null,
   EVIDENCE_NAME        varchar(64) not null,
   EVIDENCE_DATE        date not null,
   EVIDENCE_IMG         longblob not null,
   primary key (EVIDENCE_ID)
);

/*==============================================================*/
/* Table: LOCATIONS                                              */
/*==============================================================*/
create table LOCATIONS
(
   LOCATIONS_ID          int not null Auto_increment,
   ACTIVITY_ID          int not null,
   LOCATIONS_NAME        varchar(64) not null,
   LOCATIONS_LATITUDE    varchar(128) not null,
   LOCATIONS_ALTITUDE    varchar(128) not null,
   LOCATIONS_LENGHT      varchar(128) not null,
   primary key (LOCATIONS_ID)
);

/*==============================================================*/
/* Table: MONITORING                                            */
/*==============================================================*/
create table MONITORING
(
   MONITORING_ID        int not null Auto_increment,
   PROJECT_ID           int not null,
   MONITORING_DESCRIPTION varchar(512) not null,
   MONITORING_DATE      date not null,
   MONITORING_EVIDENCE  varchar(512) not null,
   MONITORING_OBSERVATIONS varchar(512) not null,
   primary key (MONITORING_ID)
);

/*==============================================================*/
/* Table: PERMIT                                                */
/*==============================================================*/
create table PERMIT
(
   PERMIT_ID            int not null Auto_increment,
   PROJECT_ID           int not null,
   PERMIT_NAME          varchar(128) not null,
   PERMIT_DESCRIPTION   varchar(256) not null,
   PERMIT_ARCHIVE       varchar(256) not null,
   primary key (PERMIT_ID)
);


/*==============================================================*/
/* Table: PROJECT                                               */
/*==============================================================*/
create table PROJECT
(
   PROJECT_ID           int not null Auto_increment,
   USERS_ID              int not null,
   PROJECT_NAME         varchar(128) not null,
   PROJECT_STARTDATE    date not null,
   PROJECT_ENDDATE      date not null,
   PROJECT_CUSTOMER     char(10),
   primary key (PROJECT_ID)
);

/*==============================================================*/
/* Table: REMINDER                                              */
/*==============================================================*/
create table REMINDER
(
   REMINDER_ID          int not null Auto_increment,
   USERS_ID              int not null,
   REMINDER_REGISTERDATE date,
   REMINDER_TOREMEMBERDATE date not null,
   REMINDER_CONTENT     varchar(128) not null,
   primary key (REMINDER_ID)
);

/*==============================================================*/
/* Table: SUPERVISITONPERIOD                                    */
/*==============================================================*/
create table SUPERVISITONPERIOD
(
   SUPERVISITONPERIOD_ID int not null Auto_increment,
   ACTIVITY_ID          int not null,
   SUPERVISITONPERIOD_STARTDATE date not null,
   SUPERVISITONPERIOD_ENDDATE date not null,
   primary key (SUPERVISITONPERIOD_ID)
);



alter table ACTIONS add constraint FK_DOES foreign key (USERS_ID)
      references USERS (USERS_ID) on delete restrict on update restrict;

alter table ACTIVITY add constraint FK_GENERATES foreign key (AMBIENTALPLAN_ID)
      references AMBIENTALPLAN (AMBIENTALPLAN_ID) on delete restrict on update restrict;

alter table ACTIVITY add constraint FK_ISCREATEDBY foreign key (USERS_ID)
      references USERS (USERS_ID) on delete restrict on update restrict;

alter table AMBIENTALPLAN add constraint FK_MANAGES foreign key (PROJECT_ID)
      references PROJECT (PROJECT_ID) on delete restrict on update restrict;

alter table EVENTS add constraint FK_PROGRAMS foreign key (USERS_ID)
      references USERS (USERS_ID) on delete restrict on update restrict;

alter table EVIDENCE add constraint FK_NEEDS foreign key (SUPERVISITONPERIOD_ID)
      references SUPERVISITONPERIOD (SUPERVISITONPERIOD_ID) on delete restrict on update restrict;

alter table LOCATIONS add constraint FK_ISIN foreign key (ACTIVITY_ID)
      references ACTIVITY (ACTIVITY_ID) on delete restrict on update restrict;

alter table MONITORING add constraint FK_HAS foreign key (PROJECT_ID)
      references PROJECT (PROJECT_ID) on delete restrict on update restrict;

alter table PERMIT add constraint FK_REQUIRES foreign key (PROJECT_ID)
      references PROJECT (PROJECT_ID) on delete restrict on update restrict;

alter table PROJECT add constraint FK_BELONGSTO foreign key (USERS_ID)
      references USERS (USERS_ID) on delete restrict on update restrict;

alter table REMINDER add constraint FK_CREATES foreign key (USERS_ID)
      references USERS (USERS_ID) on delete restrict on update restrict;

alter table SUPERVISITONPERIOD add constraint FK_CONTAINS foreign key (ACTIVITY_ID)
      references ACTIVITY (ACTIVITY_ID) on delete restrict on update restrict;

alter table USERS add constraint FK_HASA foreign key (PROFILES_ID)
      references PROFILES (PROFILES_ID) on delete restrict on update restrict;

