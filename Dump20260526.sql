CREATE DATABASE  IF NOT EXISTS `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `railway`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: railway
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `cartId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cartItems_productId_cartId_unique` (`cartId`,`productId`),
  KEY `productId` (`productId`),
  CONSTRAINT `cartitems_ibfk_19` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_20` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitems`
--

LOCK TABLES `cartitems` WRITE;
/*!40000 ALTER TABLE `cartitems` DISABLE KEYS */;
INSERT INTO `cartitems` VALUES (4,1,'2026-05-25 18:39:11','2026-05-25 18:39:11',6,1);
/*!40000 ALTER TABLE `cartitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,'2026-05-25 17:38:07','2026-05-25 17:38:07',1),(2,'2026-05-25 17:38:39','2026-05-25 17:38:39',1),(3,'2026-05-25 17:41:11','2026-05-25 17:41:11',1),(4,'2026-05-25 17:54:53','2026-05-25 17:54:53',1),(5,'2026-05-25 18:01:47','2026-05-25 18:01:47',1),(6,'2026-05-25 18:30:55','2026-05-25 18:30:55',2);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `price` double NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orderItems_orderId_productId_unique` (`orderId`,`productId`),
  KEY `productId` (`productId`),
  CONSTRAINT `orderitems_ibfk_19` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_20` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
INSERT INTO `orderitems` VALUES (1,1,'2026-05-25 17:51:02','2026-05-25 17:51:02',1,1,0),(2,1,'2026-05-25 17:55:00','2026-05-25 17:55:00',2,1,0);
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `totalAmount` double NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'CREATED',
  `paymentId` varchar(255) DEFAULT NULL,
  `paymentStatus` varchar(255) DEFAULT NULL,
  `payerEmail` varchar(255) DEFAULT NULL,
  `customerName` varchar(255) DEFAULT NULL,
  `addressLine1` varchar(255) DEFAULT NULL,
  `addressLine2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-05-25 17:51:02','2026-05-25 17:51:02',1,0,'CREATED',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'2026-05-25 17:55:00','2026-05-25 17:55:00',1,0,'CREATED',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'Books',
  `stock` int(11) NOT NULL DEFAULT 10,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'The Silent Forest',1337.58,'https://images.unsplash.com/photo-1512820790803-83ca734da794','A bestselling title with easy-to-understand concepts.','2026-01-27 17:46:43','2026-05-25 18:36:02',1,'Programming',10),(2,'Mastering Node.js',683.51,'https://images.unsplash.com/photo-1495446815901-a7297e633e8d','Highly recommended for students and professionals.','2026-01-29 17:46:43','2026-05-25 18:36:02',1,'Academic',10),(3,'Deep Work Habits',396.02,'https://images.unsplash.com/photo-1544947950-fa07a98d237f','A bestselling title with easy-to-understand concepts.','2026-01-31 17:46:43','2026-05-25 18:36:02',1,'Design',10),(4,'Atomic Success',1268.64,'https://images.unsplash.com/photo-1521587760476-6c12a4b040da','A bestselling title with easy-to-understand concepts.','2026-02-02 17:46:43','2026-05-25 18:36:02',1,'Business',10),(5,'Learning React',1132.6,'https://images.unsplash.com/photo-1521587760476-6c12a4b040da','Perfect for developers and technology enthusiasts.','2026-02-04 17:46:43','2026-05-25 18:36:02',1,'Fiction',10),(6,'The Hidden Truth',1353.43,'https://images.unsplash.com/photo-1516979187457-637abb4f9353','Comprehensive coverage with step-by-step explanations.','2026-02-06 17:46:43','2026-05-25 18:36:02',1,'Stationery',10),(7,'Modern JavaScript',238.11,'https://images.unsplash.com/photo-1495446815901-a7297e633e8d','An engaging and insightful book for modern readers.','2026-02-08 17:46:43','2026-05-25 18:36:02',1,'Programming',10),(8,'Clean Code Principles',1433.23,'https://images.unsplash.com/photo-1544947950-fa07a98d237f','A bestselling title with easy-to-understand concepts.','2026-02-10 17:46:43','2026-05-25 18:36:02',1,'Academic',10),(9,'The Startup Journey',670.13,'https://images.unsplash.com/photo-1512820790803-83ca734da794','An inspiring journey through challenges and success.','2026-02-12 17:46:43','2026-05-25 18:36:02',1,'Design',10),(10,'AI for Beginners',985.61,'https://images.unsplash.com/photo-1521587760476-6c12a4b040da','An inspiring journey through challenges and success.','2026-02-14 17:46:43','2026-05-25 18:36:02',1,'Business',10),(11,'Mystery of Himalayas',1141.56,'https://images.unsplash.com/photo-1521587760476-6c12a4b040da','A bestselling title with easy-to-understand concepts.','2026-02-16 17:46:43','2026-05-25 18:36:02',1,'Fiction',10),(12,'The Last Kingdom',1231.27,'https://images.unsplash.com/photo-1521587760476-6c12a4b040da','Perfect for developers and technology enthusiasts.','2026-02-18 17:46:43','2026-05-25 18:36:02',1,'Stationery',10),(13,'Python in Action',327.65,'https://images.unsplash.com/photo-1512820790803-83ca734da794','Perfect for developers and technology enthusiasts.','2026-02-20 17:46:43','2026-05-25 18:36:02',1,'Programming',10),(14,'Data Structures Simplified',729.11,'https://images.unsplash.com/photo-1544947950-fa07a98d237f','An inspiring journey through challenges and success.','2026-02-22 17:46:43','2026-05-25 18:36:02',1,'Academic',10),(15,'Secrets of Entrepreneurship',1273.7,'https://images.unsplash.com/photo-1495446815901-a7297e633e8d','Perfect for developers and technology enthusiasts.','2026-02-24 17:46:43','2026-05-25 18:36:02',1,'Design',10),(16,'The Dark Ocean',1378.29,'https://images.unsplash.com/photo-1512820790803-83ca734da794','A bestselling title with easy-to-understand concepts.','2026-02-26 17:46:43','2026-05-25 18:36:02',1,'Business',10),(17,'Full Stack Development',840.88,'https://images.unsplash.com/photo-1544947950-fa07a98d237f','A practical guide filled with real-world examples.','2026-02-28 17:46:43','2026-05-25 18:36:02',1,'Fiction',10),(18,'MongoDB Essentials',996.24,'https://images.unsplash.com/photo-1521587760476-6c12a4b040da','A thrilling story packed with suspense and adventure.','2026-03-02 17:46:43','2026-05-25 18:36:02',1,'Stationery',10),(19,'The Time Traveler',721.26,'https://images.unsplash.com/photo-1512820790803-83ca734da794','A practical guide filled with real-world examples.','2026-03-04 17:46:43','2026-05-25 18:36:02',1,'Programming',10),(20,'Digital Marketing Guide',1244.3,'https://images.unsplash.com/photo-1521587760476-6c12a4b040da','Highly recommended for students and professionals.','2026-03-06 17:46:43','2026-05-25 18:36:02',1,'Academic',10);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `reviews_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_6` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `passwordHash` varchar(255) DEFAULT NULL,
  `addressLine1` varchar(255) DEFAULT NULL,
  `addressLine2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'aayush','aayushkamboj400@gmail.com','2026-05-25 17:38:07','2026-05-25 18:26:28',1,'432afcfd821bf53f51c15160b4f99860:4513ec000ca0859fd201f8fa9048468c16540178096c10baa64e0e3ee7041fc7058a226bf71ad71db9a89f625d26f5aab3095d704947fc39659cbdfbada2d7f2',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Arun','arunkamboj4@gmail.com','2026-05-25 18:30:55','2026-05-25 18:30:55',0,'2cb0a425a8eb341c112d7a13a5653ecd:712904c1c91bf10d207f9c8804b2844f7f41b62f6ffd930670fce8a15e2560fa291403c182d5ef81483374d42143907b4700334e86074c8bc8fc536e77d698be',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-26  0:23:58
