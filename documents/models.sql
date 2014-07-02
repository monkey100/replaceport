-- phpMyAdmin SQL Dump
-- version 3.2.0.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 09, 2014 at 04:58 AM
-- Server version: 5.1.37
-- PHP Version: 5.3.0

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `replaceport`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--


-- --------------------------------------------------------

--
-- Table structure for table `changelogs`
--

CREATE TABLE IF NOT EXISTS `changelogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `contributor_id` int(11) DEFAULT NULL,
  `public` BOOL NOT NULL DEFAULT '1',
  `game_major` INT NULL DEFAULT NULL,
  `game_minor` INT NULL DEFAULT NULL,
  `game_revision` INT NULL DEFAULT NULL,
  `game_build` INT NULL DEFAULT NULL,
  `project_major` INT NULL DEFAULT NULL,
  `project_minor` INT NULL DEFAULT NULL,
  `project_revision` INT NULL DEFAULT NULL,
  `project_build` INT NULL DEFAULT NULL,
  `comment` text,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `changelogs`
--


-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment` text,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--


-- --------------------------------------------------------

--
-- Table structure for table `contributors`
--

CREATE TABLE IF NOT EXISTS `contributors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `contributors`
--


-- --------------------------------------------------------

--
-- Table structure for table `dependencies`
--

CREATE TABLE IF NOT EXISTS `dependencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `changelog_id` int(11) DEFAULT NULL,
  `require_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dependencies`
--


-- --------------------------------------------------------

--
-- Table structure for table `downloads`
--

CREATE TABLE IF NOT EXISTS `downloads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `file_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `downloads`
--


-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `changelog_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `format` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `mirror` varchar(255) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `attributes` text,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `files`
--


-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `image_id` int(11) DEFAULT NULL,
  `thumb_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `version` float DEFAULT NULL,
  `description` text,
  `comments` BOOL NOT NULL DEFAULT '1',
  `rating` FLOAT NOT NULL DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `projects`
--


-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ratings`
--


-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE IF NOT EXISTS `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `outcome` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reports`
--


-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `active` BOOL NOT NULL DEFAULT '1',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tags`
--


-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'unverified',
  `verify` varchar(255) DEFAULT NULL,
  `locale` varchar(255) DEFAULT NULL,
  `expires` datetime NOT NULL DEFAULT 'en',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--


-- --------------------------------------------------------

--
-- Table structure for table `watchlists`
--

CREATE TABLE IF NOT EXISTS `watchlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `status` BOOL NOT NULL DEFAULT '1',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `watchlists`
--



-- Categories insert
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('1', '0', 'mods', 'Community Mods', 'Mods', '10', '2014-05-10 22:18:01', '2014-05-10 22:18:09');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('2', '1', 'interface', 'User Interface', 'GUI', '10', '2014-05-10 22:19:25', '2014-05-10 22:19:30');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('3', '1', 'gameplay', 'Modified Gameplay', 'Gameplay', '20', '2014-05-10 22:20:19', '2014-05-10 22:20:26');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('4', '1', 'builder', 'Buider Customization', 'Builds', '30', '2014-05-10 22:21:18', '2014-05-10 22:21:24');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('5', '1', 'tutorials', 'User Generated Turtorials', 'Tutorials', '40', '2014-05-10 22:22:24', '2014-05-10 22:22:29');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('6', '0', 'files', 'Custom Files', 'Files', '10', '2014-05-10 22:23:17', '2014-05-10 22:23:23');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('7', '6', 'sounds', 'Sound Files', 'Sounds', '10', '2014-05-10 22:24:06', '2014-05-10 22:24:11');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('8', '6', 'textures', 'Texture Files', 'Textures', '20', '2014-05-10 22:24:55', '2014-05-10 22:25:00');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('9', '6', 'config', 'Configuration Files', 'Configs', '30', '2014-05-10 22:26:01', '2014-05-10 22:26:08');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('10', '0', 'parts', 'Custom Parts', 'Parts', '10', '2014-05-10 22:27:07', '2014-05-10 22:27:12');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('11', '10', 'propulsion', 'Propulsion', 'Engines', '10', '2014-05-10 22:28:20', '2014-05-10 22:28:28');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('12', '10', 'fuel', 'Fuel Tanks', 'Fuel', '20', '2014-05-10 22:29:28', '2014-05-10 22:29:33');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('13', '10', 'airplane', 'Airplane', 'Planes', '30', '2014-05-10 22:30:21', '2014-05-10 22:30:27');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('14', '10', 'structural', 'Structural', 'Structural', '40', '2014-05-10 22:31:16', '2014-05-10 22:31:21');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('15', '10', 'utilities', 'Utilities', 'Utilities', '50', '2014-05-10 22:32:00', '2014-05-10 22:32:07');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('16', '0', 'crafts', 'Craft Files', 'Crafts', '40', '2014-05-10 22:59:03', '2014-05-10 22:59:09');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('17', '16', 'vab', 'Vehicle Assembly Building', 'VAB', '10', '2014-05-10 23:00:01', '2014-05-10 23:00:07');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('18', '16', 'sph', 'Space Plane Hanger', 'SPH', '20', '2014-05-10 23:00:48', '2014-05-10 23:00:55');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('19', '16', 'subassemblies', 'Subassemblies', 'Subs', '30', '2014-05-10 23:01:41', '2014-05-10 23:01:46');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('20', '0', 'apps', 'Third Party Apps', 'Apps', '50', '2014-05-10 23:02:40', '2014-05-10 23:02:45');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('21', '0', 'community', 'Community Websites', 'Websites', '60', '2014-05-10 23:03:28', '2014-05-10 23:03:33');
INSERT INTO `replaceport`.`categories` (`id`, `parent_id`, `key`, `title`, `brief`, `order`, `created`, `modified`) VALUES ('22', '0', 'savedgames', 'Saved Games', 'Saves', '70', '2014-05-10 23:04:43', '2014-05-10 23:04:49');