/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     17/05/2025 11:29:56                          */
/*==============================================================*/


drop table if exists ACTIONS;

drop table if exists ACTIVITY;

drop table if exists AMBIENTALPLAN;

drop table if exists EVENT;

drop table if exists EVIDENCE;

drop table if exists LOCATION;

drop table if exists MONITORING;

drop table if exists PERMIT;

drop table if exists PROFILE;

drop table if exists PROJECT;

drop table if exists REMINDER;

drop table if exists SUPERVISITONPERIOD;

drop table if exists USER;

/*==============================================================*/
/* Table: ACTIONS                                               */
/*==============================================================*/
create table ACTIONS
(
   ACTIONS_ID           int not null,
   USER_ID              int not null,
   ACTIONS_DESCRIPTION  varchar(256) not null,
   ACTIONS_DATE         date not null,
   primary key (ACTIONS_ID)
);

/*==============================================================*/
/* Table: ACTIVITY                                              */
/*==============================================================*/
create table ACTIVITY
(
   ACTIVITY_ID          int not null,
   AMBIENTALPLAN_ID     int not null,
   USER_ID              int not null,
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
   AMBIENTALPLAN_ID     int not null,
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
/* Table: EVENT                                                 */
/*==============================================================*/
create table EVENT
(
   EVENT_ID             int not null,
   USER_ID              int not null,
   EVENT_NAME           varchar(64) not null,
   EVENT_STARTDATE      date not null,
   EVENT_ENDDATE        date not null,
   EVENT_DESCRIPTION    varchar(64) not null,
   primary key (EVENT_ID)
);

/*==============================================================*/
/* Table: EVIDENCE                                              */
/*==============================================================*/
create table EVIDENCE
(
   EVIDENCE_ID          int not null,
   SUPERVISITONPERIOD_ID int not null,
   EVIDENCE_NAME        varchar(64) not null,
   EVIDENCE_DATE        date not null,
   EVIDENCE_IMG         longblob not null,
   primary key (EVIDENCE_ID)
);

/*==============================================================*/
/* Table: LOCATION                                              */
/*==============================================================*/
create table LOCATION
(
   LOCATION_ID          int not null,
   ACTIVITY_ID          int not null,
   LOCATION_NAME        varchar(64) not null,
   LOCATION_LATITUDE    varchar(128) not null,
   LOCATION_ALTITUDE    varchar(128) not null,
   LOCATION_LENGHT      varchar(128) not null,
   primary key (LOCATION_ID)
);

/*==============================================================*/
/* Table: MONITORING                                            */
/*==============================================================*/
create table MONITORING
(
   MONITORING_ID        int not null,
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
   PERMIT_ID            int not null,
   PROJECT_ID           int not null,
   PERMIT_NAME          varchar(128) not null,
   PERMIT_DESCRIPTION   varchar(256) not null,
   PERMIT_ARCHIVE       varchar(256) not null,
   primary key (PERMIT_ID)
);

/*==============================================================*/
/* Table: PROFILE                                               */
/*==============================================================*/
create table PROFILE
(
   PROFILE_ID           int not null,
   PROFILE_READPROJECTS bool,
   PROFILE_CREATEPROJECTS bool,
   PROFILE_UPDATEPROJECTS bool,
   PROFILE_DELETEPROJECTS bool,
   PROFILE_READAMBIENTALPLANS bool,
   PROFILE_CREATEAMBIENTALPLANS bool,
   PROFILE_UPDATEAMBIENTALPLANS bool,
   PROFILE_DELETEAMBIENTALPLANS bool,
   PROFILE_READMONITORINGS bool,
   PROFILE_WRITEMONITORINGS bool,
   PROFILE_UPDATEMONITORINGS bool,
   PROFILE_DELETEMONITORINGS bool,
   PROFILE_CREATEACTIVITYS bool,
   PROFILE_READACTIVITY bool,
   PROFILE_UPDATEACTIVITYS bool,
   PROFILE_CREATEEVENTS bool,
   PROFILE_READEVENTS   bool,
   PROFILE_UPDATEEVENTS bool,
   PROFILE_DELETEEVENTS bool,
   PROFILE_CREATEUSERS  bool,
   PROFILE_READUSERS    bool,
   PROFILE_UPDATEUSERS  bool,
   PROFILE_DELETEUSERS  bool,
   PROFILE_CREATEPROFILES bool,
   PROFILE_UPDATEPROFILES bool,
   PROFILE_READPROFILES bool,
   PROFILE_DELETEPROFILES bool,
   PROFILE_READACTIONS  bool,
   PROFILE_READSUPERVISIONPERIOD bool,
   PROFILE_CREATESUPERVISIONPERIOD bool,
   PROFILE_DELETESUPERVISIONPERIOD bool,
   PROFILE_UPDATESUPERVISIONPERIOD bool,
   PROFILE_READPERMIT   bool,
   PROFILE_CREATEPERMIT bool,
   PROFILE_UPDATEPERMIT bool,
   PROFILE_DELETEPERMIT bool,
   PROFILE_READREMINDER bool,
   PROFILE_CREATEREMINDER bool,
   PROFILE_DELETEREMINDER bool,
   PROFILE_UPDATEREMINDER bool,
   primary key (PROFILE_ID)
);

/*==============================================================*/
/* Table: PROJECT                                               */
/*==============================================================*/
create table PROJECT
(
   PROJECT_ID           int not null,
   USER_ID              int not null,
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
   REMINDER_ID          int not null,
   USER_ID              int not null,
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
   SUPERVISITONPERIOD_ID int not null,
   ACTIVITY_ID          int not null,
   SUPERVISITONPERIOD_STARTDATE date not null,
   SUPERVISITONPERIOD_ENDDATE date not null,
   primary key (SUPERVISITONPERIOD_ID)
);

/*==============================================================*/
/* Table: USER                                                  */
/*==============================================================*/
create table USER
(
   USER_ID              int not null,
   PROFILE_ID           int not null,
   USER_NAME            varchar(64) not null,
   USER_SURNAME         varchar(64) not null,
   USER_BORNDATE        date not null,
   USER_EMAIL           varchar(128) not null,
   USER_PHONENUMBER     varchar(16) not null,
   USER_USER            varchar(64) not null,
   USER_PASSWORD        varchar(128) not null,
   primary key (USER_ID)
);

alter table ACTIONS add constraint FK_DOES foreign key (USER_ID)
      references USER (USER_ID) on delete restrict on update restrict;

alter table ACTIVITY add constraint FK_GENERATES foreign key (AMBIENTALPLAN_ID)
      references AMBIENTALPLAN (AMBIENTALPLAN_ID) on delete restrict on update restrict;

alter table ACTIVITY add constraint FK_ISCREATEDBY foreign key (USER_ID)
      references USER (USER_ID) on delete restrict on update restrict;

alter table AMBIENTALPLAN add constraint FK_MANAGES foreign key (PROJECT_ID)
      references PROJECT (PROJECT_ID) on delete restrict on update restrict;

alter table EVENT add constraint FK_PROGRAMS foreign key (USER_ID)
      references USER (USER_ID) on delete restrict on update restrict;

alter table EVIDENCE add constraint FK_NEEDS foreign key (SUPERVISITONPERIOD_ID)
      references SUPERVISITONPERIOD (SUPERVISITONPERIOD_ID) on delete restrict on update restrict;

alter table LOCATION add constraint FK_ISIN foreign key (ACTIVITY_ID)
      references ACTIVITY (ACTIVITY_ID) on delete restrict on update restrict;

alter table MONITORING add constraint FK_HAS foreign key (PROJECT_ID)
      references PROJECT (PROJECT_ID) on delete restrict on update restrict;

alter table PERMIT add constraint FK_REQUIRES foreign key (PROJECT_ID)
      references PROJECT (PROJECT_ID) on delete restrict on update restrict;

alter table PROJECT add constraint FK_BELONGSTO foreign key (USER_ID)
      references USER (USER_ID) on delete restrict on update restrict;

alter table REMINDER add constraint FK_CREATES foreign key (USER_ID)
      references USER (USER_ID) on delete restrict on update restrict;

alter table SUPERVISITONPERIOD add constraint FK_CONTAINS foreign key (ACTIVITY_ID)
      references ACTIVITY (ACTIVITY_ID) on delete restrict on update restrict;

alter table USER add constraint FK_HASA foreign key (PROFILE_ID)
      references PROFILE (PROFILE_ID) on delete restrict on update restrict;

