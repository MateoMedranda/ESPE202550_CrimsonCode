-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-05-2025 a las 23:17:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `biosigma_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actions`
--

CREATE TABLE `actions` (
  `ACTIONS_ID` int(11) NOT NULL,
  `USERS_ID` int(11) NOT NULL,
  `ACTIONS_DESCRIPTION` varchar(256) NOT NULL,
  `ACTIONS_DATE` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `activity`
--

CREATE TABLE `activity` (
  `ACTIVITY_ID` int(11) NOT NULL,
  `AMBIENTALPLAN_ID` int(11) NOT NULL,
  `USERS_ID` int(11) NOT NULL,
  `ACTIVITY_NAME` varchar(64) NOT NULL,
  `ACTIVITY_OBJECTIVE` varchar(64) NOT NULL,
  `ACTIVITY_TYPE` varchar(128) NOT NULL,
  `ACTIVITY_DATE` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ambientalplan`
--

CREATE TABLE `ambientalplan` (
  `AMBIENTALPLAN_ID` int(11) NOT NULL,
  `PROJECT_ID` int(11) NOT NULL,
  `AMBIENTALPLAN_NAME` varchar(128) NOT NULL,
  `AMBIENTALPLAN_DESCRIPTION` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `events`
--

CREATE TABLE `events` (
  `EVENTS_ID` int(11) NOT NULL,
  `USERS_ID` int(11) NOT NULL,
  `EVENTS_NAME` varchar(64) NOT NULL,
  `EVENTS_STARTDATE` date NOT NULL,
  `EVENTS_ENDDATE` date NOT NULL,
  `EVENTS_DESCRIPTION` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evidence`
--

CREATE TABLE `evidence` (
  `EVIDENCE_ID` int(11) NOT NULL,
  `SUPERVISITONPERIOD_ID` int(11) NOT NULL,
  `EVIDENCE_NAME` varchar(64) NOT NULL,
  `EVIDENCE_DATE` date NOT NULL,
  `EVIDENCE_IMG` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locations`
--

CREATE TABLE `locations` (
  `LOCATIONS_ID` int(11) NOT NULL,
  `ACTIVITY_ID` int(11) NOT NULL,
  `LOCATIONS_NAME` varchar(64) NOT NULL,
  `LOCATIONS_LATITUDE` varchar(128) NOT NULL,
  `LOCATIONS_ALTITUDE` varchar(128) NOT NULL,
  `LOCATIONS_LENGHT` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `monitoring`
--

CREATE TABLE `monitoring` (
  `MONITORING_ID` int(11) NOT NULL,
  `PROJECT_ID` int(11) NOT NULL,
  `MONITORING_NAME` char(255) NOT NULL,
  `MONITORING_DESCRIPTION` varchar(512) NOT NULL,
  `MONITORING_EVIDENCE` varchar(512) NOT NULL,
  `MONITORING_OBSERVATIONS` varchar(512) NOT NULL,
  `MONITORING_IMAGE` char(255) NOT NULL,
  `MONITORING_FOLDER` char(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `monitoring`
--

INSERT INTO `monitoring` (`MONITORING_ID`, `PROJECT_ID`, `MONITORING_NAME`, `MONITORING_DESCRIPTION`, `MONITORING_EVIDENCE`, `MONITORING_OBSERVATIONS`, `MONITORING_IMAGE`, `MONITORING_FOLDER`) VALUES
(1, 1, 'Monitoreo de PH', 'monitoreo para conocer el estado del agua', 'Monitoreo_de_PH_20250520_231132.pdf', 'el estado del agua se encuentra 7 puntos por debajo del promedio', 'img_682cf004d2d4a.png', 'Monitoreo_de_PH_20250520_231132');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permit`
--

CREATE TABLE `permit` (
  `PERMIT_ID` int(11) NOT NULL,
  `PROJECT_ID` int(11) NOT NULL,
  `PERMIT_NAME` varchar(128) NOT NULL,
  `PERMIT_DESCRIPTION` varchar(256) NOT NULL,
  `PERMIT_ARCHIVE` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profiles`
--

CREATE TABLE `profiles` (
  `PROFILES_ID` int(11) NOT NULL,
  `PROFILES_NAME` varchar(64) NOT NULL,
  `PROFILES_READPROJECTS` tinyint(1) ,
  `PROFILES_CREATEPROJECTS` tinyint(1) ,
  `PROFILES_UPDATEPROJECTS` tinyint(1) ,
  `PROFILES_DELETEPROJECTS` tinyint(1) ,
  `PROFILES_READAMBIENTALPLANS` tinyint(1) ,
  `PROFILES_CREATEAMBIENTALPLANS` tinyint(1) ,
  `PROFILES_UPDATEAMBIENTALPLANS` tinyint(1) ,
  `PROFILES_DELETEAMBIENTALPLANS` tinyint(1) ,
  `PROFILES_READMONITORINGS` tinyint(1) ,
  `PROFILES_WRITEMONITORINGS` tinyint(1) ,
  `PROFILES_UPDATEMONITORINGS` tinyint(1) ,
  `PROFILES_DELETEMONITORINGS` tinyint(1) ,
  `PROFILES_CREATEACTIVITIES` tinyint(1) ,
  `PROFILES_READACTIVITIES` tinyint(1) ,
  `PROFILES_UPDATEACTIVITIES` tinyint(1) ,
  `PROFILES_DELETEACTIVITIES` tinyint(1) ,
  `PROFILES_CREATEEVENTS` tinyint(1) ,
  `PROFILES_READEVENTS` tinyint(1) ,
  `PROFILES_UPDATEEVENTS` tinyint(1) ,
  `PROFILES_DELETEEVENTS` tinyint(1) ,
  `PROFILES_CREATEUSERS` tinyint(1) ,
  `PROFILES_READUSERS` tinyint(1) ,
  `PROFILES_UPDATEUSERS` tinyint(1) ,
  `PROFILES_DELETEUSERS` tinyint(1) ,
  `PROFILES_CREATEPROFILES` tinyint(1) ,
  `PROFILES_UPDATEPROFILES` tinyint(1) ,
  `PROFILES_READPROFILES` tinyint(1) ,
  `PROFILES_DELETEPROFILES` tinyint(1) ,
  `PROFILES_READACTIONS` tinyint(1) ,
  `PROFILES_READSUPERVISIONPERIOD` tinyint(1) ,
  `PROFILES_CREATESUPERVISIONPERIOD` tinyint(1) ,
  `PROFILES_DELETESUPERVISIONPERIOD` tinyint(1),
  `PROFILES_UPDATESUPERVISIONPERIOD` tinyint(1) ,
  `PROFILES_READPERMIT` tinyint(1) ,
  `PROFILES_CREATEPERMIT` tinyint(1) ,
  `PROFILES_UPDATEPERMIT` tinyint(1) ,
  `PROFILES_DELETEPERMIT` tinyint(1) ,
  `PROFILES_READREMINDER` tinyint(1) ,
  `PROFILES_CREATEREMINDER` tinyint(1) ,
  `PROFILES_DELETEREMINDER` tinyint(1) ,
  `PROFILES_UPDATEREMINDER` tinyint(1) ,
  `PROFILES_STATE` varchar(32) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `project`
--

CREATE TABLE `project` (
  `PROJECT_ID` int(11) NOT NULL,
  `PROJECT_NAME` varchar(128) NOT NULL,
  `PROJECT_STARTDATE` date NOT NULL,
  `PROJECT_STATE` char(64) NOT NULL,
  `PROJECT_LOCATION` char(128) NOT NULL,
  `PROJECT_IMAGE` char(255) NOT NULL,
  `PROJECT_DESCRIPTION` char(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `project`
--

INSERT INTO `project` (`PROJECT_ID`, `PROJECT_NAME`, `PROJECT_STARTDATE`, `PROJECT_STATE`, `PROJECT_LOCATION`, `PROJECT_IMAGE`, `PROJECT_DESCRIPTION`) VALUES
(1, 'HidroAbanico', '2025-05-15', 'En progreso', 'Macas', '682cefefe45b0.png', 'proyecto sobre hidroeléctrica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `project_customer`
--

CREATE TABLE `project_customer` (
  `USERS_ID` int(11) DEFAULT NULL,
  `PROJECT_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reminder`
--

CREATE TABLE `reminder` (
  `REMINDER_ID` int(11) NOT NULL,
  `PROJECT_ID` int(11) NOT NULL,
  `REMINDER_REGISTERDATE` date NOT NULL,
  `REMINDER_TOREMEMBERDATE` date NOT NULL,
  `REMINDER_TITLE` varchar(32) NOT NULL,
  `REMINDER_CONTENT` varchar(128) NOT NULL,
  `REMINDER_STATE` varchar(32) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `supervisitonperiod`
--

CREATE TABLE `supervisitonperiod` (
  `SUPERVISITONPERIOD_ID` int(11) NOT NULL,
  `ACTIVITY_ID` int(11) NOT NULL,
  `SUPERVISITONPERIOD_STARTDATE` date NOT NULL,
  `SUPERVISITONPERIOD_ENDDATE` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `USERS_ID` int(11) NOT NULL,
  `PROFILES_ID` int(11) NOT NULL,
  `USERS_NAME` varchar(64) NOT NULL,
  `USERS_SURNAME` varchar(64) NOT NULL,
  `USERS_PERSONAL_ID` varchar(11) NOT NULL,
  `USERS_BORNDATE` date NOT NULL,
  `USERS_EMAIL` varchar(128) NOT NULL,
  `USERS_PHONENUMBER` varchar(16) NOT NULL,
  `USERS_USERS` varchar(64) NOT NULL,
  `USERS_PASSWORD` varchar(128) NOT NULL,
  `USERS_STATE` varchar(32) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actions`
--
ALTER TABLE `actions`
  ADD PRIMARY KEY (`ACTIONS_ID`),
  ADD KEY `FK_DOES` (`USERS_ID`);

--
-- Indices de la tabla `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`ACTIVITY_ID`),
  ADD KEY `FK_GENERATES` (`AMBIENTALPLAN_ID`),
  ADD KEY `FK_ISCREATEDBY` (`USERS_ID`);

--
-- Indices de la tabla `ambientalplan`
--
ALTER TABLE `ambientalplan`
  ADD PRIMARY KEY (`AMBIENTALPLAN_ID`),
  ADD KEY `FK_MANAGES` (`PROJECT_ID`);

--
-- Indices de la tabla `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`EVENTS_ID`),
  ADD KEY `FK_PROGRAMS` (`USERS_ID`);

--
-- Indices de la tabla `evidence`
--
ALTER TABLE `evidence`
  ADD PRIMARY KEY (`EVIDENCE_ID`),
  ADD KEY `FK_NEEDS` (`SUPERVISITONPERIOD_ID`);

--
-- Indices de la tabla `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`LOCATIONS_ID`),
  ADD KEY `FK_ISIN` (`ACTIVITY_ID`);

--
-- Indices de la tabla `monitoring`
--
ALTER TABLE `monitoring`
  ADD PRIMARY KEY (`MONITORING_ID`),
  ADD KEY `FK_HAS` (`PROJECT_ID`);

--
-- Indices de la tabla `permit`
--
ALTER TABLE `permit`
  ADD PRIMARY KEY (`PERMIT_ID`),
  ADD KEY `FK_REQUIRES` (`PROJECT_ID`);

--
-- Indices de la tabla `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`PROFILES_ID`);

--
-- Indices de la tabla `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`PROJECT_ID`);

--
-- Indices de la tabla `project_customer`
--
ALTER TABLE `project_customer`
  ADD KEY `FK_REFERENCE_13` (`USERS_ID`),
  ADD KEY `FK_REFERENCE_14` (`PROJECT_ID`);

--
-- Indices de la tabla `reminder`
--
ALTER TABLE `reminder`
  ADD PRIMARY KEY (`REMINDER_ID`),
  ADD KEY `FK_CREATES` (`PROJECT_ID`);

--
-- Indices de la tabla `supervisitonperiod`
--
ALTER TABLE `supervisitonperiod`
  ADD PRIMARY KEY (`SUPERVISITONPERIOD_ID`),
  ADD KEY `FK_CONTAINS` (`ACTIVITY_ID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`USERS_ID`),
  ADD KEY `FK_HASA` (`PROFILES_ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actions`
--
ALTER TABLE `actions`
  MODIFY `ACTIONS_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `activity`
--
ALTER TABLE `activity`
  MODIFY `ACTIVITY_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ambientalplan`
--
ALTER TABLE `ambientalplan`
  MODIFY `AMBIENTALPLAN_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `events`
--
ALTER TABLE `events`
  MODIFY `EVENTS_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evidence`
--
ALTER TABLE `evidence`
  MODIFY `EVIDENCE_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `locations`
--
ALTER TABLE `locations`
  MODIFY `LOCATIONS_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `monitoring`
--
ALTER TABLE `monitoring`
  MODIFY `MONITORING_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `permit`
--
ALTER TABLE `permit`
  MODIFY `PERMIT_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `profiles`
--
ALTER TABLE `profiles`
  MODIFY `PROFILES_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `project`
--
ALTER TABLE `project`
  MODIFY `PROJECT_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reminder`
--
ALTER TABLE `reminder`
  MODIFY `REMINDER_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `supervisitonperiod`
--
ALTER TABLE `supervisitonperiod`
  MODIFY `SUPERVISITONPERIOD_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `USERS_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actions`
--
ALTER TABLE `actions`
  ADD CONSTRAINT `FK_DOES` FOREIGN KEY (`USERS_ID`) REFERENCES `users` (`USERS_ID`);

--
-- Filtros para la tabla `activity`
--
ALTER TABLE `activity`
  ADD CONSTRAINT `FK_GENERATES` FOREIGN KEY (`AMBIENTALPLAN_ID`) REFERENCES `ambientalplan` (`AMBIENTALPLAN_ID`),
  ADD CONSTRAINT `FK_ISCREATEDBY` FOREIGN KEY (`USERS_ID`) REFERENCES `users` (`USERS_ID`);

--
-- Filtros para la tabla `ambientalplan`
--
ALTER TABLE `ambientalplan`
  ADD CONSTRAINT `FK_MANAGES` FOREIGN KEY (`PROJECT_ID`) REFERENCES `project` (`PROJECT_ID`);

--
-- Filtros para la tabla `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `FK_PROGRAMS` FOREIGN KEY (`USERS_ID`) REFERENCES `users` (`USERS_ID`);

--
-- Filtros para la tabla `evidence`
--
ALTER TABLE `evidence`
  ADD CONSTRAINT `FK_NEEDS` FOREIGN KEY (`SUPERVISITONPERIOD_ID`) REFERENCES `supervisitonperiod` (`SUPERVISITONPERIOD_ID`);

--
-- Filtros para la tabla `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `FK_ISIN` FOREIGN KEY (`ACTIVITY_ID`) REFERENCES `activity` (`ACTIVITY_ID`);

--
-- Filtros para la tabla `monitoring`
--
ALTER TABLE `monitoring`
  ADD CONSTRAINT `FK_HAS` FOREIGN KEY (`PROJECT_ID`) REFERENCES `project` (`PROJECT_ID`);

--
-- Filtros para la tabla `permit`
--
ALTER TABLE `permit`
  ADD CONSTRAINT `FK_REQUIRES` FOREIGN KEY (`PROJECT_ID`) REFERENCES `project` (`PROJECT_ID`);

--
-- Filtros para la tabla `project_customer`
--
ALTER TABLE `project_customer`
  ADD CONSTRAINT `FK_REFERENCE_13` FOREIGN KEY (`USERS_ID`) REFERENCES `users` (`USERS_ID`),
  ADD CONSTRAINT `FK_REFERENCE_14` FOREIGN KEY (`PROJECT_ID`) REFERENCES `project` (`PROJECT_ID`);

--
-- Filtros para la tabla `reminder`
--
ALTER TABLE `reminder`
  ADD CONSTRAINT `FK_CREATES` FOREIGN KEY (`PROJECT_ID`) REFERENCES `project` (`PROJECT_ID`);

--
-- Filtros para la tabla `supervisitonperiod`
--
ALTER TABLE `supervisitonperiod`
  ADD CONSTRAINT `FK_CONTAINS` FOREIGN KEY (`ACTIVITY_ID`) REFERENCES `activity` (`ACTIVITY_ID`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_HASA` FOREIGN KEY (`PROFILES_ID`) REFERENCES `profiles` (`PROFILES_ID`);
COMMIT;

INSERT INTO `profiles`(
  `PROFILES_NAME`, `PROFILES_READPROJECTS`, `PROFILES_CREATEPROJECTS`, `PROFILES_UPDATEPROJECTS`, `PROFILES_DELETEPROJECTS`,
  `PROFILES_READAMBIENTALPLANS`, `PROFILES_CREATEAMBIENTALPLANS`, `PROFILES_UPDATEAMBIENTALPLANS`, `PROFILES_DELETEAMBIENTALPLANS`,
  `PROFILES_READMONITORINGS`, `PROFILES_WRITEMONITORINGS`, `PROFILES_UPDATEMONITORINGS`, `PROFILES_DELETEMONITORINGS`,
  `PROFILES_CREATEACTIVITIES`, `PROFILES_READACTIVITIES`, `PROFILES_UPDATEACTIVITIES`, `PROFILES_DELETEACTIVITIES`,
  `PROFILES_CREATEEVENTS`, `PROFILES_READEVENTS`, `PROFILES_UPDATEEVENTS`, `PROFILES_DELETEEVENTS`,
  `PROFILES_CREATEUSERS`, `PROFILES_READUSERS`, `PROFILES_UPDATEUSERS`, `PROFILES_DELETEUSERS`,
  `PROFILES_CREATEPROFILES`, `PROFILES_UPDATEPROFILES`, `PROFILES_READPROFILES`, `PROFILES_DELETEPROFILES`,
  `PROFILES_READACTIONS`, `PROFILES_READSUPERVISIONPERIOD`, `PROFILES_CREATESUPERVISIONPERIOD`, `PROFILES_DELETESUPERVISIONPERIOD`,
  `PROFILES_UPDATESUPERVISIONPERIOD`, `PROFILES_READPERMIT`, `PROFILES_CREATEPERMIT`, `PROFILES_UPDATEPERMIT`, `PROFILES_DELETEPERMIT`,
  `PROFILES_READREMINDER`, `PROFILES_CREATEREMINDER`, `PROFILES_DELETEREMINDER`, `PROFILES_UPDATEREMINDER`
) VALUES (
  'Administrador', 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1,
  1,1,1,1, 1,1,1,1, 1,1,1,1,
  1,1,1,1, 1,1,1,1, 1,1,1,1,1
);


INSERT INTO `users`( `PROFILES_ID`, `USERS_NAME`, `USERS_SURNAME`, `USERS_PERSONAL_ID`, `USERS_BORNDATE`, `USERS_EMAIL`, `USERS_PHONENUMBER`, `USERS_USERS`, `USERS_PASSWORD`) VALUES (
  1,
  'Juan',
  'Pérez',
  '0650160205',
  '1990-01-01',
  'juan@example.com',
  '123456789',
  'admin',      -- este será el username que escribes en el login
  '1234'        -- y esta la contraseña
);

