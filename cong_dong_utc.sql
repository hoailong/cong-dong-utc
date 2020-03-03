-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: dong_dong_utc
-- ------------------------------------------------------
-- Server version	5.7.28-0ubuntu0.18.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_doc_file`
--

DROP TABLE IF EXISTS `tbl_doc_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_doc_file` (
  `id_doc_file` varchar(45) NOT NULL,
  `id_doc` varchar(45) NOT NULL,
  `filename` varchar(255) NOT NULL,
  PRIMARY KEY (`id_doc_file`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_doc_file`
--

LOCK TABLES `tbl_doc_file` WRITE;
/*!40000 ALTER TABLE `tbl_doc_file` DISABLE KEYS */;
INSERT INTO `tbl_doc_file` VALUES ('aa16e84e-c9fe-460e-ad22-f2e9ce4f2f97','DC-49b066b0-4fa9-49af-a283-74d201c94d38','test_1576751712569.docx'),('bf0afbd4-636e-402c-990d-be54fdcf37f7','DC-49b066b0-4fa9-49af-a283-74d201c94d38','transaction_1576751712567.php');
/*!40000 ALTER TABLE `tbl_doc_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_doc_photo`
--

DROP TABLE IF EXISTS `tbl_doc_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_doc_photo` (
  `id_doc_file` varchar(45) NOT NULL,
  `id_doc` varchar(45) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `imgur_link` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_doc_file`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_doc_photo`
--

LOCK TABLES `tbl_doc_photo` WRITE;
/*!40000 ALTER TABLE `tbl_doc_photo` DISABLE KEYS */;
INSERT INTO `tbl_doc_photo` VALUES ('16481385-0b1c-4fd3-a01f-90aef788060c','DC-49b066b0-4fa9-49af-a283-74d201c94d38','ubuntu_gray_black_circle_logo_symbol_33031_1400x1050_1576751712556.jpg',NULL),('1da47483-c6a3-45fc-a5ef-d63c1010bbd7','DT-a3695fc4-7b2d-4241-a52e-25236e3a2585','ngoctrinh-3_1576777480684.jpg',NULL),('25064789-e1ee-4c67-b2c2-fc53788a74f7','DC-49b066b0-4fa9-49af-a283-74d201c94d38','Screenshot_from_2019-12-18_21-19-28_1576751712579.png',NULL),('6f7e1fc1-61ed-4cee-8371-f314690a518a','DC-49b066b0-4fa9-49af-a283-74d201c94d38','SlipperyHelpfulFrenchbulldog-size_restricted_1576751712573.gif',NULL);
/*!40000 ALTER TABLE `tbl_doc_photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_document`
--

DROP TABLE IF EXISTS `tbl_document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_document` (
  `id_doc` varchar(45) NOT NULL,
  `id_user` varchar(45) DEFAULT NULL,
  `id_user_conf` varchar(45) DEFAULT NULL,
  `id_faculty` varchar(45) DEFAULT NULL,
  `id_subject` varchar(45) DEFAULT NULL,
  `id_year` varchar(45) DEFAULT NULL,
  `privacy` varchar(10) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `note` longtext,
  `status` int(11) DEFAULT '0',
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `verified_time` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_doc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_document`
--

LOCK TABLES `tbl_document` WRITE;
/*!40000 ALTER TABLE `tbl_document` DISABLE KEYS */;
INSERT INTO `tbl_document` VALUES ('DC-49b066b0-4fa9-49af-a283-74d201c94d38','1004317903236309',NULL,'CNTT','DSO04.2','20192020','private','DC','test phat ahhihih',0,'2019-12-19 17:35:13',NULL,NULL),('DC-89f8850b-7543-4554-848e-173ac59c5208','1004317903236309',NULL,'CNTT','DSO04.2','20192020','private','DC','ok lalalal ',0,'2019-12-19 16:03:23',NULL,NULL),('DT-0529882d-e6cd-45ab-8338-5ff6e967cfe9','1004317903236309',NULL,'CNTT','DSO04.2','20192020','public','DT','',1,'2019-12-19 15:55:24',NULL,NULL),('DT-54218f4d-a575-4c88-a66d-cb075cd5e93e','1004317903236309',NULL,'CNTT','DSO04.2','20192020','public','DT','',0,'2019-12-19 16:54:47',NULL,NULL),('DT-a3695fc4-7b2d-4241-a52e-25236e3a2585','1004317903236309',NULL,'CNTT','DSO04.2','20192020','private','DT','không có gì',0,'2019-12-20 00:44:41',NULL,NULL),('DT-ad542860-a231-4ffa-a391-2e081ccb9680','1004317903236309',NULL,'CNTT','DSO04.2','20192020','public','DT','',-1,'2019-12-19 15:51:34',NULL,NULL);
/*!40000 ALTER TABLE `tbl_document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_faculty`
--

DROP TABLE IF EXISTS `tbl_faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_faculty` (
  `id_faculty` varchar(10) NOT NULL,
  `faculty_name` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_faculty`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_faculty`
--

LOCK TABLES `tbl_faculty` WRITE;
/*!40000 ALTER TABLE `tbl_faculty` DISABLE KEYS */;
INSERT INTO `tbl_faculty` VALUES ('CNTT','Công nghệ thông tin',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbl_faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_subject`
--

DROP TABLE IF EXISTS `tbl_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_subject` (
  `id_subject` varchar(10) NOT NULL,
  `subject_name` varchar(100) DEFAULT NULL,
  `credit` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_subject`
--

LOCK TABLES `tbl_subject` WRITE;
/*!40000 ALTER TABLE `tbl_subject` DISABLE KEYS */;
INSERT INTO `tbl_subject` VALUES ('DSO04.2','Xác suất thống kê',2,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbl_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user`
--

DROP TABLE IF EXISTS `tbl_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_user` (
  `id_user` varchar(20) NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `star` int(11) DEFAULT '0',
  `picture` longtext,
  `birth` varchar(45) DEFAULT '06/09/2000',
  `gender` varchar(10) DEFAULT 'male',
  `bio` longtext,
  `ayear` int(11) DEFAULT '60',
  `class_name` varchar(45) DEFAULT NULL,
  `role` varchar(10) DEFAULT 'USER',
  `status` int(11) DEFAULT '1',
  `id_faculty` varchar(45) DEFAULT NULL,
  `joined_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES ('1004317903236309','Hoài Long','kenkieu99@gmail.com',0,'1004317903236309.jpq','06/09/2000','male',NULL,60,NULL,'USER',1,NULL,'2019-12-19 09:31:05');
/*!40000 ALTER TABLE `tbl_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_year`
--

DROP TABLE IF EXISTS `tbl_year`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_year` (
  `id_year` varchar(10) NOT NULL,
  `year_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_year`
--

LOCK TABLES `tbl_year` WRITE;
/*!40000 ALTER TABLE `tbl_year` DISABLE KEYS */;
INSERT INTO `tbl_year` VALUES ('20192020','2019-2020');
/*!40000 ALTER TABLE `tbl_year` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-23  8:57:24
