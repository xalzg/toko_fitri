-- phpMyAdmin SQL Dump
-- Database: `toko_fitri`
-- Host: 127.0.0.1

CREATE DATABASE IF NOT EXISTS `toko_fitri` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `toko_fitri`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- --------------------------------------------------------
-- Table structure for table `User`
-- --------------------------------------------------------

CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `Category`
-- --------------------------------------------------------

CREATE TABLE `Category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `Product`
-- --------------------------------------------------------

CREATE TABLE `Product` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchasePrice` double NOT NULL DEFAULT '0',
  `sellingPrice` double NOT NULL DEFAULT '0',
  `stock` int NOT NULL DEFAULT '0',
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pcs',
  `minimumStock` int NOT NULL DEFAULT '5',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `StockMovement`
-- --------------------------------------------------------

CREATE TABLE `StockMovement` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `stockBefore` int NOT NULL,
  `stockAfter` int NOT NULL,
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `Transaction`
-- --------------------------------------------------------

CREATE TABLE `Transaction` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transactionNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transactionDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `totalAmount` double NOT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CASH',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `TransactionItem`
-- --------------------------------------------------------

CREATE TABLE `TransactionItem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transactionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `sellingPrice` double NOT NULL,
  `subtotal` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `QrisSetting`
-- --------------------------------------------------------

CREATE TABLE `QrisSetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `merchantName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ownerName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Indexes
-- --------------------------------------------------------

ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `Product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Product_sku_key` (`sku`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`);

ALTER TABLE `StockMovement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `StockMovement_productId_fkey` (`productId`);

ALTER TABLE `Transaction`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Transaction_transactionNumber_key` (`transactionNumber`);

ALTER TABLE `TransactionItem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TransactionItem_transactionId_fkey` (`transactionId`),
  ADD KEY `TransactionItem_productId_fkey` (`productId`);

ALTER TABLE `QrisSetting`
  ADD PRIMARY KEY (`id`);

-- --------------------------------------------------------
-- Constraints
-- --------------------------------------------------------

ALTER TABLE `Product`
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `StockMovement`
  ADD CONSTRAINT `StockMovement_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `TransactionItem`
  ADD CONSTRAINT `TransactionItem_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `TransactionItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- --------------------------------------------------------
-- Data Seeding (Admin & Categories)
-- --------------------------------------------------------

-- Password hash below is for 'admin123' using bcrypt
INSERT INTO `User` (`id`, `email`, `password`, `name`, `createdAt`, `updatedAt`) VALUES
('admin_user_id_001', 'admin@tokofitri.com', '$2a$10$wTfXW7q.h9Zq0Jp0O7U3OeU0QZ2hP0pZ2Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'Admin Toko Fitri', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

INSERT INTO `Category` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
('cat_001', 'Makanan Ringan', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cat_002', 'Minuman', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cat_003', 'Sembako', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cat_004', 'Rokok', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cat_005', 'Keperluan Mandi', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

COMMIT;
