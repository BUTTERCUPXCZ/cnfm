-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for cnfm_dashboard
DROP DATABASE IF EXISTS `cnfm_dashboard`;
CREATE DATABASE IF NOT EXISTS `cnfm_dashboard` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `cnfm_dashboard`;

-- Dumping structure for table cnfm_dashboard.cable_cuts
DROP TABLE IF EXISTS `cable_cuts`;
CREATE TABLE IF NOT EXISTS `cable_cuts` (
  `cut_id` varchar(256) NOT NULL,
  `distance` varchar(256) NOT NULL,
  `cut_type` varchar(256) NOT NULL,
  `fault_date` varchar(256) NOT NULL,
  `simulated` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `depth` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.data_updates
DROP TABLE IF EXISTS `data_updates`;
CREATE TABLE IF NOT EXISTS `data_updates` (
  `update_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(256) NOT NULL,
  `description` varchar(256) NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`update_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.previous_utilization
DROP TABLE IF EXISTS `previous_utilization`;
CREATE TABLE IF NOT EXISTS `previous_utilization` (
  `site` varchar(50) NOT NULL,
  `cable` varchar(50) NOT NULL,
  `a_side` varchar(255) NOT NULL,
  `port_a_side` varchar(50) NOT NULL,
  `z_side` varchar(50) NOT NULL,
  `port_b_side` varchar(50) NOT NULL,
  `bearer_id` varchar(255) NOT NULL,
  `globe_circuit_id` varchar(255) NOT NULL,
  `handover_document` varchar(255) NOT NULL,
  `trunk_type` varchar(10) NOT NULL,
  `link` varchar(50) NOT NULL,
  `mbps_capacity` int(50) NOT NULL,
  `gbps_capacity` int(50) NOT NULL,
  `percent_utilization` float(10,2) NOT NULL,
  `remarks` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sea_us_rpl_s1
DROP TABLE IF EXISTS `sea_us_rpl_s1`;
CREATE TABLE IF NOT EXISTS `sea_us_rpl_s1` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `planned_target_burial_depth` varchar(256) NOT NULL,
  `route_features` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sea_us_rpl_s2
DROP TABLE IF EXISTS `sea_us_rpl_s2`;
CREATE TABLE IF NOT EXISTS `sea_us_rpl_s2` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `body_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `lay_direction` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `burial_method` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `route_features` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sea_us_rpl_s3
DROP TABLE IF EXISTS `sea_us_rpl_s3`;
CREATE TABLE IF NOT EXISTS `sea_us_rpl_s3` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `planned_target_burial_depth` varchar(256) NOT NULL,
  `route_features` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sea_us_rpl_s4
DROP TABLE IF EXISTS `sea_us_rpl_s4`;
CREATE TABLE IF NOT EXISTS `sea_us_rpl_s4` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `lay_direction` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `burial_method` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `route_features` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL,
  `ignore_1` varchar(256) NOT NULL,
  `ignore_2` varchar(256) NOT NULL,
  `ignore_3` varchar(256) NOT NULL,
  `ignore_4` varchar(256) NOT NULL,
  `ignore_5` varchar(256) NOT NULL,
  `ignore_6` varchar(256) NOT NULL,
  `ignore_7` varchar(256) NOT NULL,
  `ignore_8` varchar(256) NOT NULL,
  `ignore_9` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sea_us_rpl_s5
DROP TABLE IF EXISTS `sea_us_rpl_s5`;
CREATE TABLE IF NOT EXISTS `sea_us_rpl_s5` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `lay_direction` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `burial_method` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `route_features` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sea_us_rpl_s6
DROP TABLE IF EXISTS `sea_us_rpl_s6`;
CREATE TABLE IF NOT EXISTS `sea_us_rpl_s6` (
  `ref` varchar(256) NOT NULL,
  `ship_operation` varchar(256) NOT NULL,
  `date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_line_no` varchar(256) NOT NULL,
  `cable_armour_type` varchar(256) NOT NULL,
  `cable_armour_length` varchar(256) NOT NULL,
  `section_length` varchar(256) NOT NULL,
  `total_length` varchar(256) NOT NULL,
  `kp` varchar(256) NOT NULL,
  `slack_between_positions` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `corr_depth` varchar(256) NOT NULL,
  `chart_no` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s1
DROP TABLE IF EXISTS `sjc_rpl_s1`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s1` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s10
DROP TABLE IF EXISTS `sjc_rpl_s10`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s10` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s11
DROP TABLE IF EXISTS `sjc_rpl_s11`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s11` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s12
DROP TABLE IF EXISTS `sjc_rpl_s12`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s12` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s13
DROP TABLE IF EXISTS `sjc_rpl_s13`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s13` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s3
DROP TABLE IF EXISTS `sjc_rpl_s3`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s3` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s4
DROP TABLE IF EXISTS `sjc_rpl_s4`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s4` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s5
DROP TABLE IF EXISTS `sjc_rpl_s5`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s5` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s6
DROP TABLE IF EXISTS `sjc_rpl_s6`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s6` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s7
DROP TABLE IF EXISTS `sjc_rpl_s7`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s7` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s8
DROP TABLE IF EXISTS `sjc_rpl_s8`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s8` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.sjc_rpl_s9
DROP TABLE IF EXISTS `sjc_rpl_s9`;
CREATE TABLE IF NOT EXISTS `sjc_rpl_s9` (
  `pos_no` varchar(256) NOT NULL,
  `event` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `latitude2` varchar(256) NOT NULL,
  `latitude3` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `longitude2` varchar(256) NOT NULL,
  `longitude3` varchar(256) NOT NULL,
  `decimal_latitude` varchar(256) NOT NULL,
  `radians_latitude` varchar(256) NOT NULL,
  `sin_latitude` varchar(256) NOT NULL,
  `meridional_parts` varchar(256) NOT NULL,
  `distance_from_equator` varchar(256) NOT NULL,
  `decimal_longitude` varchar(256) NOT NULL,
  `difference_in_latitude` varchar(256) NOT NULL,
  `difference_in_mps` varchar(256) NOT NULL,
  `difference_in_edist` varchar(256) NOT NULL,
  `difference_in_longitude` varchar(256) NOT NULL,
  `course` varchar(256) NOT NULL,
  `distance_in_nmiles` varchar(256) NOT NULL,
  `bearing` varchar(256) NOT NULL,
  `between_positions` varchar(256) NOT NULL,
  `cumulative_total` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `cable_between_positions` varchar(256) NOT NULL,
  `cable_cumulative_total` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cumulative_by_type` varchar(256) NOT NULL,
  `cable_totals_by_type` varchar(256) NOT NULL,
  `approx_depth` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `fibre_type` varchar(256) NOT NULL,
  `lay_vessel` varchar(256) NOT NULL,
  `date_installed` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `a` varchar(256) NOT NULL,
  `aa` varchar(256) NOT NULL,
  `ee` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s1
DROP TABLE IF EXISTS `tgnia_rpl_s1`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s1` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s10
DROP TABLE IF EXISTS `tgnia_rpl_s10`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s10` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s11
DROP TABLE IF EXISTS `tgnia_rpl_s11`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s11` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s12
DROP TABLE IF EXISTS `tgnia_rpl_s12`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s12` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s2
DROP TABLE IF EXISTS `tgnia_rpl_s2`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s2` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s3
DROP TABLE IF EXISTS `tgnia_rpl_s3`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s3` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s4
DROP TABLE IF EXISTS `tgnia_rpl_s4`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s4` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s5
DROP TABLE IF EXISTS `tgnia_rpl_s5`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s5` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s6
DROP TABLE IF EXISTS `tgnia_rpl_s6`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s6` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s7
DROP TABLE IF EXISTS `tgnia_rpl_s7`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s7` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s8
DROP TABLE IF EXISTS `tgnia_rpl_s8`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s8` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.tgnia_rpl_s9
DROP TABLE IF EXISTS `tgnia_rpl_s9`;
CREATE TABLE IF NOT EXISTS `tgnia_rpl_s9` (
  `line_no` varchar(256) NOT NULL,
  `vessel_name` varchar(256) NOT NULL,
  `operation_date` varchar(256) NOT NULL,
  `latitude` varchar(256) NOT NULL,
  `longitude` varchar(256) NOT NULL,
  `remarks` varchar(256) NOT NULL,
  `repeater` varchar(256) NOT NULL,
  `cable_type` varchar(256) NOT NULL,
  `cable_id` varchar(256) NOT NULL,
  `cable_each_event` varchar(256) NOT NULL,
  `cable_each_repeater` varchar(256) NOT NULL,
  `cable_cumm` varchar(256) NOT NULL,
  `route_each_event` varchar(256) NOT NULL,
  `route_distance_cumm` varchar(256) NOT NULL,
  `slack` varchar(256) NOT NULL,
  `burial_depth` varchar(256) NOT NULL,
  `water_depth` varchar(256) NOT NULL,
  `comments` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(255) NOT NULL AUTO_INCREMENT,
  `user_fname` varchar(256) NOT NULL,
  `user_lname` varchar(256) NOT NULL,
  `user_email` varchar(256) NOT NULL,
  `user_password` varchar(256) NOT NULL,
  `user_role` varchar(50) NOT NULL DEFAULT 'User',
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table cnfm_dashboard.utilization
DROP TABLE IF EXISTS `utilization`;
CREATE TABLE IF NOT EXISTS `utilization` (
  `site` varchar(50) NOT NULL,
  `cable` varchar(50) NOT NULL,
  `a_side` varchar(255) NOT NULL,
  `port_a_side` varchar(50) NOT NULL,
  `z_side` varchar(50) NOT NULL,
  `port_b_side` varchar(50) NOT NULL,
  `bearer_id` varchar(255) NOT NULL,
  `globe_circuit_id` varchar(255) NOT NULL,
  `handover_document` varchar(255) NOT NULL,
  `trunk_type` varchar(10) NOT NULL,
  `link` varchar(50) NOT NULL,
  `mbps_capacity` int(50) NOT NULL,
  `gbps_capacity` int(50) NOT NULL,
  `percent_utilization` float(10,2) NOT NULL,
  `remarks` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong1
DROP TRIGGER IF EXISTS `before_insert_clean_latlong1`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong1` BEFORE INSERT ON `sjc_rpl_s1` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong10
DROP TRIGGER IF EXISTS `before_insert_clean_latlong10`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong10` BEFORE INSERT ON `sjc_rpl_s10` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong11
DROP TRIGGER IF EXISTS `before_insert_clean_latlong11`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong11` BEFORE INSERT ON `sjc_rpl_s11` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong12
DROP TRIGGER IF EXISTS `before_insert_clean_latlong12`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong12` BEFORE INSERT ON `sjc_rpl_s12` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong13
DROP TRIGGER IF EXISTS `before_insert_clean_latlong13`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong13` BEFORE INSERT ON `sjc_rpl_s13` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong3
DROP TRIGGER IF EXISTS `before_insert_clean_latlong3`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong3` BEFORE INSERT ON `sjc_rpl_s3` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong4
DROP TRIGGER IF EXISTS `before_insert_clean_latlong4`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong4` BEFORE INSERT ON `sjc_rpl_s4` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong5
DROP TRIGGER IF EXISTS `before_insert_clean_latlong5`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong5` BEFORE INSERT ON `sjc_rpl_s5` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong6
DROP TRIGGER IF EXISTS `before_insert_clean_latlong6`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong6` BEFORE INSERT ON `sjc_rpl_s6` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong7
DROP TRIGGER IF EXISTS `before_insert_clean_latlong7`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong7` BEFORE INSERT ON `sjc_rpl_s7` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong8
DROP TRIGGER IF EXISTS `before_insert_clean_latlong8`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong8` BEFORE INSERT ON `sjc_rpl_s8` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong9
DROP TRIGGER IF EXISTS `before_insert_clean_latlong9`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong9` BEFORE INSERT ON `sjc_rpl_s9` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong_s1
DROP TRIGGER IF EXISTS `before_insert_clean_latlong_s1`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong_s1` BEFORE INSERT ON `sea_us_rpl_s1` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong_s2
DROP TRIGGER IF EXISTS `before_insert_clean_latlong_s2`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong_s2` BEFORE INSERT ON `sea_us_rpl_s2` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong_s3
DROP TRIGGER IF EXISTS `before_insert_clean_latlong_s3`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong_s3` BEFORE INSERT ON `sea_us_rpl_s3` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;

  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;

  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong_s4
DROP TRIGGER IF EXISTS `before_insert_clean_latlong_s4`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong_s4` BEFORE INSERT ON `sea_us_rpl_s4` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;
  
  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;
  
  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;
  
  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
  
  -- Apply direction indicators and coordinate adjustments
  -- Handle latitude direction (S = negative)
  IF NEW.latitude3 = 'S' AND NEW.latitude IS NOT NULL AND NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude = -1 * (NEW.latitude + NEW.latitude2);
    SET NEW.latitude2 = 0; -- Reset latitude2 since it's now included in latitude
  ELSEIF NEW.latitude IS NOT NULL AND NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude = NEW.latitude + NEW.latitude2;
    SET NEW.latitude2 = 0; -- Reset latitude2 since it's now included in latitude
  END IF;
  
  -- Handle longitude direction (W = negative) - NO 360 added
  IF NEW.longitude3 = 'W' AND NEW.longitude IS NOT NULL AND NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude = -1 * (NEW.longitude + NEW.longitude2);
    SET NEW.longitude2 = 0; -- Reset longitude2 since it's now included in longitude
  ELSEIF NEW.longitude IS NOT NULL AND NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude = NEW.longitude + NEW.longitude2;
    SET NEW.longitude2 = 0; -- Reset longitude2 since it's now included in longitude
  END IF;
  
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong_s5
DROP TRIGGER IF EXISTS `before_insert_clean_latlong_s5`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong_s5` BEFORE INSERT ON `sea_us_rpl_s5` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;
  
  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;
  
  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;
  
  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
  
  -- Apply direction indicators and coordinate adjustments
  -- Handle latitude direction (S = negative)
  IF NEW.latitude3 = 'S' AND NEW.latitude IS NOT NULL AND NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude = -1 * (NEW.latitude + NEW.latitude2);
    SET NEW.latitude2 = 0; -- Reset latitude2 since it's now included in latitude
  ELSEIF NEW.latitude IS NOT NULL AND NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude = NEW.latitude + NEW.latitude2;
    SET NEW.latitude2 = 0; -- Reset latitude2 since it's now included in latitude
  END IF;
  
  -- Handle longitude direction (W = negative) - NO 360 added
  IF NEW.longitude3 = 'W' AND NEW.longitude IS NOT NULL AND NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude = -1 * (NEW.longitude + NEW.longitude2);
    SET NEW.longitude2 = 0; -- Reset longitude2 since it's now included in longitude
  ELSEIF NEW.longitude IS NOT NULL AND NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude = NEW.longitude + NEW.longitude2;
    SET NEW.longitude2 = 0; -- Reset longitude2 since it's now included in longitude
  END IF;
  
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_clean_latlong_s6
DROP TRIGGER IF EXISTS `before_insert_clean_latlong_s6`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_clean_latlong_s6` BEFORE INSERT ON `sea_us_rpl_s6` FOR EACH ROW BEGIN
  -- Clean and convert latitude (degrees only)
  IF NEW.latitude IS NOT NULL THEN
    SET NEW.latitude = REGEXP_REPLACE(NEW.latitude, '[^0-9.-]', '') + 0;
  END IF;
  
  -- Clean and convert latitude2 (minutes â†’ decimal degrees)
  IF NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude2 = ROUND((REPLACE(NEW.latitude2, '''', '') + 0) / 60, 4);
  END IF;
  
  -- Clean and convert longitude (degrees only)
  IF NEW.longitude IS NOT NULL THEN
    SET NEW.longitude = REGEXP_REPLACE(NEW.longitude, '[^0-9.-]', '') + 0;
  END IF;
  
  -- Clean and convert longitude2 (minutes â†’ decimal degrees)
  IF NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude2 = ROUND((REPLACE(NEW.longitude2, '''', '') + 0) / 60, 4);
  END IF;
  
  -- Apply direction indicators and coordinate adjustments
  -- Handle latitude direction (S = negative)
  IF NEW.latitude3 = 'S' AND NEW.latitude IS NOT NULL AND NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude = -1 * (NEW.latitude + NEW.latitude2);
    SET NEW.latitude2 = 0; -- Reset latitude2 since it's now included in latitude
  ELSEIF NEW.latitude IS NOT NULL AND NEW.latitude2 IS NOT NULL THEN
    SET NEW.latitude = NEW.latitude + NEW.latitude2;
    SET NEW.latitude2 = 0; -- Reset latitude2 since it's now included in latitude
  END IF;
  
  -- Handle longitude direction (W = negative) - NO 360 added
  IF NEW.longitude3 = 'W' AND NEW.longitude IS NOT NULL AND NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude = -1 * (NEW.longitude + NEW.longitude2);
    SET NEW.longitude2 = 0; -- Reset longitude2 since it's now included in longitude
  ELSEIF NEW.longitude IS NOT NULL AND NEW.longitude2 IS NOT NULL THEN
    SET NEW.longitude = NEW.longitude + NEW.longitude2;
    SET NEW.longitude2 = 0; -- Reset longitude2 since it's now included in longitude
  END IF;
  
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s1
DROP TRIGGER IF EXISTS `before_insert_coordinates_s1`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s1` BEFORE INSERT ON `tgnia_rpl_s1` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s10
DROP TRIGGER IF EXISTS `before_insert_coordinates_s10`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s10` BEFORE INSERT ON `tgnia_rpl_s10` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s11
DROP TRIGGER IF EXISTS `before_insert_coordinates_s11`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s11` BEFORE INSERT ON `tgnia_rpl_s11` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s12
DROP TRIGGER IF EXISTS `before_insert_coordinates_s12`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s12` BEFORE INSERT ON `tgnia_rpl_s12` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s2
DROP TRIGGER IF EXISTS `before_insert_coordinates_s2`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s2` BEFORE INSERT ON `tgnia_rpl_s2` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s3
DROP TRIGGER IF EXISTS `before_insert_coordinates_s3`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s3` BEFORE INSERT ON `tgnia_rpl_s3` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s4
DROP TRIGGER IF EXISTS `before_insert_coordinates_s4`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s4` BEFORE INSERT ON `tgnia_rpl_s4` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s5
DROP TRIGGER IF EXISTS `before_insert_coordinates_s5`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s5` BEFORE INSERT ON `tgnia_rpl_s5` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s6
DROP TRIGGER IF EXISTS `before_insert_coordinates_s6`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s6` BEFORE INSERT ON `tgnia_rpl_s6` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s7
DROP TRIGGER IF EXISTS `before_insert_coordinates_s7`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s7` BEFORE INSERT ON `tgnia_rpl_s7` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s8
DROP TRIGGER IF EXISTS `before_insert_coordinates_s8`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s8` BEFORE INSERT ON `tgnia_rpl_s8` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.before_insert_coordinates_s9
DROP TRIGGER IF EXISTS `before_insert_coordinates_s9`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `before_insert_coordinates_s9` BEFORE INSERT ON `tgnia_rpl_s9` FOR EACH ROW BEGIN
    DECLARE lat_deg DECIMAL(10,6);
    DECLARE lat_min DECIMAL(10,6);
    DECLARE lon_deg DECIMAL(10,6);
    DECLARE lon_min DECIMAL(10,6);
    DECLARE lat_dir CHAR(1);
    DECLARE lon_dir CHAR(1);
    
    -- Only proceed with conversion if the input is in DMS format
    IF NEW.latitude REGEXP '^[NS][0-9]+ [0-9.]+$' AND NEW.longitude REGEXP '^[EW][0-9]+ [0-9.]+$' THEN
        -- Extract direction (N/S, E/W)
        SET lat_dir = IF(NEW.latitude REGEXP '^N', 'N', 'S');
        SET lon_dir = IF(NEW.longitude REGEXP '^E', 'E', 'W');
        
        -- Extract degrees and minutes for latitude
        SET lat_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.latitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lat_min = CAST(SUBSTRING_INDEX(NEW.latitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Extract degrees and minutes for longitude
        SET lon_deg = CAST(SUBSTRING_INDEX(SUBSTRING(NEW.longitude, 2), ' ', 1) AS DECIMAL(10,6));
        SET lon_min = CAST(SUBSTRING_INDEX(NEW.longitude, ' ', -1) AS DECIMAL(10,6));
        
        -- Convert to decimal degrees with 6 decimal places
        SET NEW.latitude = CAST(FORMAT(lat_deg + (lat_min / 60), 6) AS CHAR);
        -- Make negative if southern hemisphere
        IF lat_dir = 'S' THEN
            SET NEW.latitude = CAST(FORMAT(-CAST(NEW.latitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
        
        SET NEW.longitude = CAST(FORMAT(lon_deg + (lon_min / 60), 6) AS CHAR);
        -- Make negative if western hemisphere
        IF lon_dir = 'W' THEN
            SET NEW.longitude = CAST(FORMAT(-CAST(NEW.longitude AS DECIMAL(10,6)), 6) AS CHAR);
        END IF;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger cnfm_dashboard.prevent_duplicate_location
DROP TRIGGER IF EXISTS `prevent_duplicate_location`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `prevent_duplicate_location` BEFORE INSERT ON `cable_cuts` FOR EACH ROW BEGIN
    IF EXISTS (
        SELECT 1 FROM cable_cuts 
        WHERE ROUND(latitude, 6) = ROUND(NEW.latitude, 6)
          AND ROUND(longitude, 6) = ROUND(NEW.longitude, 6)
          AND distance = NEW.distance
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'This cable cut already exists. Duplicate entries are not allowed.';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
