-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2024 at 03:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clinic`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointmentqueue`
--

CREATE TABLE `appointmentqueue` (
  `HN` varchar(10) DEFAULT NULL,
  `Queue_Date` date DEFAULT NULL,
  `Queue_Time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `appointmentqueue`
--

INSERT INTO `appointmentqueue` (`HN`, `Queue_Date`, `Queue_Time`) VALUES
('HN058', '2024-09-14', '19:00:00'),
('HN011', '2024-10-17', '13:00:00'),
('HN054', '2024-10-19', '14:00:00'),
('HN029', '2024-10-17', '11:00:00'),
('HN014', '2024-10-19', '17:00:00'),
('HN014', '2024-10-15', '00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `general_treatment`
--

CREATE TABLE `general_treatment` (
  `Treatment_ID` varchar(10) NOT NULL,
  `General_Details` text DEFAULT NULL,
  `Treatment_Detail` text DEFAULT NULL,
  `Treatment_Others` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `inovic`
--

CREATE TABLE `inovic` (
  `Inovic_ID` varchar(10) NOT NULL,
  `Inovic_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `inovic`
--

INSERT INTO `inovic` (`Inovic_ID`, `Inovic_Date`) VALUES
('INO00001', '2024-10-15'),
('INO00002', '2024-10-15'),
('INO00003', '2024-10-15'),
('INO00004', '2024-10-15'),
('INO00005', '2024-10-18');

-- --------------------------------------------------------

--
-- Table structure for table `medicine`
--

CREATE TABLE `medicine` (
  `Medicine_ID` varchar(10) NOT NULL,
  `Medicine_Name` varchar(100) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Med_Cost` decimal(10,2) DEFAULT NULL,
  `Quantity_type` varchar(50) DEFAULT NULL,
  `Quantity` int(11) DEFAULT 0,
  `medicine_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `medicine`
--

INSERT INTO `medicine` (`Medicine_ID`, `Medicine_Name`, `Description`, `Med_Cost`, `Quantity_type`, `Quantity`, `medicine_type`) VALUES
('m001', 'Paracetamol', 'บรรเทาอาการปวดและลดไข้', 25.00, 'Tablet', 764, 'ยาแก้ปวด'),
('m002', 'Brufen', 'บรรเทาอาการปวดและลดการอักเสบ', 80.00, 'Tablet', 547, 'ยาแก้ปวด'),
('m003', 'Naproxen', 'บรรเทาอาการปวดและลดการอักเสบ', 55.00, 'Tablet', 245, 'ยาแก้ปวด'),
('m004', 'Norgesic', 'บรรเทาอาการปวดกล้ามเนื้อ', 35.00, 'Tablet', 582, 'ยาแก้ปวด'),
('m005', 'Piroxicam', 'บรรเทาอาการปวดและลดการอักเสบ', 60.00, 'Capsule', 775, 'ยาแก้ปวด'),
('m006', 'Indocid', 'บรรเทาอาการปวดและลดการอักเสบ', 48.00, 'Capsule', 730, 'ยาแก้ปวด'),
('m007', 'Gaba', 'บรรเทาอาการวิตกกังวล', 120.00, 'Capsule', 526, 'ยาแก้ปวด'),
('m008', 'Nilide', 'บรรเทาอาการปวด', 18.00, 'Tablet', 239, 'ยาแก้ปวด'),
('m009', 'Cafagot', 'บรรเทาอาการปวดหัวไมเกรน', 75.00, 'Tablet', 620, 'ยาแก้ปวด'),
('m010', 'Par Syrup', 'บรรเทาอาการปวดและลดไข้ (สำหรับเด็ก)', 40.00, 'Syrup', 384, 'ยาแก้ปวด'),
('m011', 'DFN', 'บรรเทาอาการปวดและลดไข้', 32.00, 'Tablet', 459, 'ยาแก้ปวด'),
('m012', 'Colchicine', 'บรรเทาอาการปวดข้อจากโรคเกาต์', 95.00, 'Tablet', 344, 'ยาแก้ปวด'),
('m013', 'Caron', 'ยาบรรเทาอาการท้องอืด', 3.00, 'Tablet', 745, 'ยาฆ่าเชื้อ'),
('m014', 'Cipro', 'ยาปฏิชีวนะ', 80.00, 'Syrup', 692, 'ยาฆ่าเชื้อ'),
('m015', 'Amoxy', 'ยาปฏิชีวนะ', 60.00, 'Syrup', 425, 'ยาฆ่าเชื้อ'),
('m016', 'Cephalexin', 'ยาปฏิชีวนะ', 75.00, 'Syrup', 448, 'ยาฆ่าเชื้อ'),
('m017', 'Augmentin', 'ยาปฏิชีวนะ', 120.00, 'Syrup', 769, 'ยาฆ่าเชื้อ'),
('m018', 'Erythromycin', 'ยาปฏิชีวนะ', 90.00, 'Syrup', 499, 'ยาฆ่าเชื้อ'),
('m019', 'Carbo', 'ยาแก้ท้องเสีย', 50.00, 'Syrup', 590, 'ยาฆ่าเชื้อ'),
('m020', 'Topamine', 'ยาแก้แพ้', 45.00, 'Syrup', 653, 'ยาฆ่าเชื้อ'),
('m021', 'Bactrim', 'ยาปฏิชีวนะ', 110.00, 'Syrup', 694, 'ยาฆ่าเชื้อ'),
('m022', 'Multivitamin', 'วิตามินรวม', 150.00, 'Syrup', 712, 'ยาฆ่าเชื้อ'),
('m023', 'Albendazole', 'ยาถ่ายพยาธิ', 35.00, 'Syrup', 679, 'ยาฆ่าเชื้อ'),
('m024', 'Atarax', 'ยาแก้แพ้', 65.00, 'Syrup', 459, 'ยาฆ่าเชื้อ'),
('m025', 'Mesto', 'ยาฆ่าเชื้อ', 18.00, 'Tablet', 660, 'ยาฆ่าเชื้อ'),
('m026', 'Dulcolex', 'ยาระบาย', 15.00, 'Tablet', 521, 'ยาทางเดินอาหาร'),
('m027', 'Simethicone', 'ยาลดกรด', 12.00, 'Tablet', 426, 'ยาทางเดินอาหาร'),
('m028', 'Omiprozole', 'ยาลดกรด', 22.00, 'Tablet', 368, 'ยาทางเดินอาหาร'),
('m029', 'Cabon', 'ยาบรรเทาอาการท้องอืด', 8.00, 'Tablet', 362, 'ยาทางเดินอาหาร'),
('m030', 'Dom', 'ยาแก้คลื่นไส้', 10.00, 'Tablet', 508, 'ยาทางเดินอาหาร'),
('m031', 'Hyosin', 'ยาแก้ปวดท้อง', 14.00, 'Tablet', 653, 'ยาทางเดินอาหาร'),
('m032', 'ORS', 'เกลือแร่', 5.00, 'Powder', 344, 'ยาทางเดินอาหาร'),
('m033', 'Daminate', 'ยาแก้ไอ', 10.00, 'Tablet', 759, 'ยาทางเดินหายใจ'),
('m034', 'Cabocys', 'ยาบรรเทาอาการท้องอืด', 8.00, 'Tablet', 765, 'ยาทางเดินหายใจ'),
('m035', 'ยาอม', 'ยาอมแก้ไอ', 5.00, 'Lozenge', 747, 'ยาทางเดินหายใจ'),
('m036', 'Salbu', 'ยาขยายหลอดลม', 150.00, 'Inhaler', 642, 'ยาทางเดินหายใจ'),
('m037', 'Thiopilline', 'ยาขยายหลอดลม', 20.00, 'Tablet', 768, 'ยาทางเดินหายใจ'),
('m038', 'Boracouge', 'ยาแก้เจ็บคอ', 35.00, 'Gargle', 515, 'ยาทางเดินหายใจ'),
('m039', 'cpm', 'ยาแก้ปวด', 12.00, 'Tablet', 671, 'ยาทางเดินหายใจ'),
('m040', 'Loratadine', 'ยาแก้แพ้', 8.00, 'Tablet', 409, 'ยาทางเดินหายใจ'),
('m041', 'Merin', 'ยาแก้คลื่นไส้', 15.00, 'Tablet', 434, 'ยาทางเดินหายใจ'),
('m042', 'folic', 'วิตามินเสริม', 5.00, 'Tablet', 743, 'ยาบำรุง'),
('m043', 'MTV', 'วิตามินรวม', 10.00, 'Tablet', 415, 'ยาบำรุง'),
('m044', 'ferrous', 'ธาตุเหล็ก', 8.00, 'Tablet', 248, 'ยาบำรุง'),
('m045', 'flulium', 'ยาบรรเทาอาการหวัด', 15.00, 'Tablet', 392, 'ยาบำรุง'),
('m046', 'mocobal', 'วิตามินบี 12', 12.00, 'Tablet', 419, 'ยาบำรุง'),
('m047', 'DMPA', 'ยาคุมกำเนิดชนิดฉีด', 150.00, 'Injection', 719, 'ยาคุม'),
('m048', 'Cyclofem', 'ยาคุมกำเนิดชนิดเม็ด', 35.00, 'Tablet', 337, 'ยาคุม'),
('m049', 'DFN', 'ยาแก้ปวดลดไข้', 5.00, 'Tablet', 528, 'ยาฉีด'),
('m050', 'Hyosin', 'ยาแก้ปวดท้อง', 14.00, 'Tablet', 232, 'ยาฉีด'),
('m051', 'Dimenhydrinate', 'ยาแก้เมารถเมาเรือ', 10.00, 'Tablet', 575, 'ยาฉีด'),
('m052', 'Rofipan', 'ยาแก้ปวดลดไข้', 8.00, 'Tablet', 781, 'ยาฉีด'),
('m053', 'Bco', 'วิตามินบีรวม', 12.00, 'Tablet', 781, 'ยาฉีด'),
('m054', 'Neurovit', 'วิตามินบำรุงประสาท', 20.00, 'Tablet', 761, 'ยาฉีด'),
('m055', '0.1% TA cream', 'ยารักษาสิว', 50.00, 'Cream', 665, 'ยาทา'),
('m056', '0.02% TA cream', 'ยารักษาสิว', 45.00, 'Cream', 239, 'ยาทา'),
('m057', 'Bet-n cream', 'ยาทาสเตียรอยด์', 80.00, 'Cream', 203, 'ยาทา'),
('m058', 'Keto cream', 'ยาแก้คัน', 60.00, 'Cream', 697, 'ยาทา'),
('m059', 'DFN cream', 'ยาแก้ปวดลดการอักเสบ', 40.00, 'Cream', 277, 'ยาทา'),
('m060', '0.1% TA Lotion', 'ยารักษาสิว', 65.00, 'Lotion', 292, 'ยาทา'),
('m061', 'Calamile lotion', 'โลชั่นแก้คัน', 30.00, 'Lotion', 433, 'ยาทา'),
('m062', 'Bactex cream', 'ยาฆ่าเชื้อ', 75.00, 'Cream', 489, 'ยาทา'),
('m063', 'E-U 2000 cream', 'ยาทาแก้ผื่นแพ้', 90.00, 'Cream', 346, 'ยาทา'),
('m064', 'Kool Fever', 'แผ่นเจลลดไข้', 25.00, 'Patch', 662, 'ยาทา');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Order_ID` varchar(10) NOT NULL,
  `HN` varchar(10) DEFAULT NULL,
  `Order_Date` date NOT NULL,
  `Treatment_cost` int(11) NOT NULL,
  `Total_cost` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Order_ID`, `HN`, `Order_Date`, `Treatment_cost`, `Total_cost`) VALUES
('O00001', 'HN002', '2024-11-10', 0, 0.00),
('O00004', 'HN005', '2024-09-15', 0, 0.00),
('O00005', 'HN006', '2024-11-20', 0, 0.00),
('O00006', 'HN007', '2024-09-23', 0, 0.00),
('O00008', 'HN009', '2025-02-04', 0, 0.00),
('O00009', 'HN010', '2024-10-05', 0, 0.00),
('O00010', 'HN011', '2024-12-05', 0, 0.00),
('O00012', 'HN013', '2025-07-21', 0, 0.00),
('O00013', 'HN014', '2025-06-05', 0, 0.00),
('O00014', 'HN015', '2024-11-18', 0, 0.00),
('O00015', 'HN016', '2025-07-15', 0, 0.00),
('O00017', 'HN018', '2025-01-05', 0, 0.00),
('O00019', 'HN020', '2025-01-11', 0, 0.00),
('O00020', 'HN021', '2025-02-27', 0, 0.00),
('O00021', 'HN002', '2025-03-07', 0, 0.00),
('O00022', 'HN029', '2024-08-13', 0, 0.00),
('O00023', 'HN029', '2024-08-13', 0, 0.00),
('O00024', 'HN029', '2024-08-13', 0, 0.00),
('O00025', 'HN029', '2024-08-13', 0, 0.00),
('O00026', 'HN029', '2024-08-13', 0, 0.00),
('O00027', 'HN029', '2024-08-13', 0, 0.00),
('O00028', 'HN029', '2024-08-13', 0, 0.00),
('O00029', 'HN029', '2024-08-13', 0, 0.00),
('O00030', 'HN040', '2024-08-13', 0, 0.00),
('O00031', 'HN002', '2024-08-13', 0, 0.00),
('O00032', 'HN029', '2024-08-13', 0, 0.00),
('O00033', 'HN029', '2024-08-13', 0, 0.00),
('O00034', 'HN041', '2024-08-28', 0, 0.00),
('O00035', 'HN021', '2024-08-28', 0, 0.00),
('O00036', 'HN028', '2024-08-28', 0, 0.00),
('O00037', 'HN024', '2024-08-28', 0, 0.00),
('O00041', 'HN021', '2024-08-28', 0, 0.00),
('O00042', 'HN021', '2024-08-28', 0, 0.00),
('O00043', 'HN021', '2024-08-28', 0, 0.00),
('O00044', 'HN021', '2024-08-28', 0, 0.00),
('O00045', 'HN021', '2024-08-28', 0, 0.00),
('O00046', 'HN021', '2024-08-28', 0, 0.00),
('O00047', 'HN021', '2024-08-28', 0, 0.00),
('O00048', 'HN021', '2024-08-28', 0, 0.00),
('O00049', 'HN007', '2024-08-28', 0, 0.00),
('O00050', 'HN007', '2024-08-28', 0, 0.00),
('O00051', 'HN046', '2024-08-28', 0, 0.00),
('O00052', 'HN045', '2024-08-28', 0, 0.00),
('O00053', 'HN061', '2024-08-28', 0, 0.00),
('O00054', 'HN053', '2024-08-28', 0, 0.00),
('O00055', 'HN027', '2024-08-28', 0, 0.00),
('O00056', 'HN054', '2024-08-28', 0, 0.00),
('O00057', 'HN063', '2024-09-15', 0, 0.00),
('O00058', 'HN061', '2024-10-15', 0, 0.00),
('O00059', 'HN062', '2024-10-15', 0, 0.00),
('O00060', 'HN014', '2024-10-15', 0, 0.00),
('O00061', 'HN002', '2024-10-15', 0, 0.00),
('O00062', 'HN026', '2024-10-15', 0, 0.00),
('O00063', 'HN028', '2024-10-15', 0, 0.00),
('O00064', 'HN024', '2024-10-15', 0, 0.00),
('O00065', 'HN041', '2024-10-15', 0, 0.00),
('O00066', 'HN013', '2024-10-15', 0, 0.00),
('O00067', 'HN014', '2024-10-15', 0, 0.00),
('O00068', 'HN026', '2024-10-15', 0, 0.00),
('O00069', 'HN024', '2024-10-15', 0, 0.00),
('O00070', 'HN051', '2024-10-15', 0, 0.00),
('O00071', 'HN059', '2024-10-15', 0, 0.00),
('O00072', 'HN041', '2024-10-16', 0, 0.00),
('O00073', 'HN010', '2024-10-16', 0, 0.00),
('O00074', 'HN029', '2024-10-16', 0, 0.00),
('O00075', 'HN054', '2024-10-16', 0, 0.00),
('O00076', 'HN002', '2024-10-16', 0, 0.00),
('O00077', 'HN005', '2024-10-16', 0, 0.00),
('O00078', 'HN006', '2024-10-16', 0, 0.00),
('O00079', 'HN010', '2024-10-16', 0, 0.00),
('O00080', 'HN011', '2024-10-16', 0, 0.00),
('O00081', 'HN007', '2024-10-16', 0, 0.00),
('O00082', 'HN035', '2024-10-16', 0, 0.00),
('O00083', 'HN036', '2024-10-17', 0, 0.00),
('O00084', 'HN002', '2024-10-17', 0, 0.00),
('O00085', 'HN005', '2024-10-17', 0, 0.00),
('O00086', 'HN007', '2024-10-18', 0, 0.00),
('O00087', 'HN009', '2024-10-18', 0, 0.00),
('O00088', 'HN007', '2024-10-18', 0, 0.00),
('O00089', 'HN010', '2024-10-18', 0, 0.00),
('O00090', 'HN006', '2024-10-18', 0, 0.00),
('O00091', 'HN002', '2024-10-19', 0, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_medicine`
--

CREATE TABLE `order_medicine` (
  `Item_ID` varchar(10) NOT NULL,
  `Order_ID` varchar(10) DEFAULT NULL,
  `Medicine_ID` varchar(10) DEFAULT NULL,
  `Quantity_Order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `order_medicine`
--

INSERT INTO `order_medicine` (`Item_ID`, `Order_ID`, `Medicine_ID`, `Quantity_Order`) VALUES
('I00001', 'O00001', 'm023', 5),
('I00002', 'O00001', 'm051', 12),
('I00003', 'O00001', 'm017', 3),
('I00010', 'O00004', 'm021', 4),
('I00011', 'O00004', 'm005', 7),
('I00012', 'O00004', 'm038', 11),
('I00013', 'O00005', 'm049', 15),
('I00014', 'O00005', 'm016', 20),
('I00015', 'O00005', 'm032', 3),
('I00016', 'O00006', 'm002', 8),
('I00017', 'O00006', 'm055', 1),
('I00018', 'O00006', 'm046', 5),
('I00021', 'O00029', 'm001', 7),
('I00022', 'O00030', 'm010', 6),
('I00023', 'O00030', 'm052', 8),
('I00024', 'O00030', 'm001', 1),
('I00025', 'O00031', 'm001', 8),
('I00026', 'O00031', 'm010', 9),
('I00027', 'O00033', 'm036', 2),
('I00028', 'O00033', 'm061', 1),
('I00029', 'O00033', 'm063', 1),
('I00030', 'O00074', 'm002', 1),
('I00031', 'O00074', 'm007', 1),
('I00032', 'O00074', 'm047', 1),
('I00033', 'O00086', 'm007', 1);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `HN` varchar(10) NOT NULL,
  `First_Name` varchar(50) DEFAULT NULL,
  `Last_Name` varchar(50) DEFAULT NULL,
  `Birthdate` date DEFAULT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Title` varchar(10) DEFAULT NULL,
  `Disease` varchar(255) DEFAULT NULL,
  `Allergy` varchar(255) DEFAULT NULL,
  `ID` int(13) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`HN`, `First_Name`, `Last_Name`, `Birthdate`, `Phone`, `Gender`, `Title`, `Disease`, `Allergy`, `ID`, `created_at`) VALUES
('HN002', 'สมหญิง', 'ใจดี', '1985-08-22', '0823456789', 'หญิง', 'นาง', '', '', 0, '2024-10-16 15:21:41'),
('HN005', 'สมหมาย', 'ใจถึง', '1968-07-29', '0856789012', 'ชาย', 'นาย', '', '', 0, '2024-10-16 15:21:41'),
('HN006', 'สมใจ', 'ใจเย็น', '1995-02-14', '0867890123', 'หญิง', 'นางสาว', '', '', 0, '2024-10-17 15:21:41'),
('HN007', 'สมบูรณ์', 'ใจกว้าง', '1972-09-03', '0878901234', 'ชาย', 'นาย', '', '', 0, '2024-10-17 15:21:41'),
('HN009', 'สมหวัง', 'ใจมั่น', '1965-12-31', '0890123456', 'ชาย', 'นาย', '', '', 0, '2024-10-17 15:21:41'),
('HN010', 'สมนึก', 'ใจสบาย', '1992-06-26', '0901234567', 'หญิง', 'นางสาว', '', '', 0, '2024-10-17 15:21:41'),
('HN011', 'สมคิด', 'ใจเด็ด', '1978-10-15', '0912345678', 'ชาย', 'นาย', '', '', 0, '2024-10-17 15:21:41'),
('HN013', 'สมาน', 'ใจดี', '1997-09-23', '0934567890', 'ชาย', 'นาย', '', '', 0, '2024-10-17 15:21:41'),
('HN014', 'สมหญิง', 'ใจบุญ', '1966-06-11', '0945678901', 'หญิง', 'นาง', '', '', 0, '2024-10-17 15:21:41'),
('HN015', 'สมชาย', 'ใจสู้', '1989-03-07', '0956789012', 'ชาย', 'นาย', '', '', 0, '2024-10-17 15:21:41'),
('HN016', 'สมใจ', 'ใจเย็น', '1974-12-25', '0967890123', 'หญิง', 'นางสาว', '', '', 0, '2024-10-17 15:21:41'),
('HN018', 'สมพร', 'ใจดี', '1986-05-04', '0989012345', 'หญิง', 'นาง', '', '', 0, '2024-10-17 15:21:41'),
('HN020', 'สมนึก', 'ใจสบาย', '1994-11-17', '0812345678', 'หญิง', 'นางสาว', '', '', 0, '2024-10-17 15:21:41'),
('HN021', 'นก ', 'จก', '0000-00-00', '', 'หญิง', 'นางสาว', '', '', 0, '2024-10-17 15:21:41'),
('HN023', 'q', 's', '0000-00-00', '', 'ชาย', '', '', '', 0, '2024-10-17 15:21:41'),
('HN024', 'sad', 'a', '2024-07-07', 'sdd', '', 'นาย', '', '', 0, '2024-10-17 15:21:41'),
('HN026', 'ๆๆๆๆๆๆ', 't', '2024-07-02', '1111111', 'ชาย', 'นาย', '', '', 0, '2024-10-17 15:21:41'),
('HN027', 'a', 'a', '0000-00-00', 'x', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN028', 't', 't', '2024-07-01', '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN029', 'h', 'h', '2024-07-05', '', 'หญิง', 'นาย', '', '', 0, '2024-10-17 15:21:41'),
('HN035', 'ฟอฟ', 'กอฟ', '2024-07-12', '', 'หญิง', '', '', '', 0, '2024-10-17 15:21:41'),
('HN036', 'สมหญิ', 'ใจดี', '1985-08-21', '0823456789', 'หญิง', 'นาง', '', '', 0, '2024-10-17 15:21:41'),
('HN038', '', '', NULL, '', 'หญิง', '', '', '', 0, '2024-10-17 15:21:41'),
('HN040', 'มา', 'นา', NULL, '', 'หญิง', '', '', '', 0, '2024-10-17 15:21:41'),
('HN041', 'poda', 'โพ', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN042', 'ฟ', '', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN044', '', 'กกก', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN045', 'ฟฟฟฟฟ', '', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN046', 'หฟกหฟก', '', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN048', '', 'หฟก', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN050', '', 'กกกก', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN051', 'หฟก', 'หฟก', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN052', 'กกกก', '', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN053', '', 'กกก', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN054', 'ฟฟฟฟ', '', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN055', 'ฟฟฟ', '', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN056', '', 'ฟกหฟกฟหกห', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN057', 'aaaaa', '', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN058', 'vvvvvv', '', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN059', 'bbbbbb', '', NULL, '', 'ผู้', '', '', '', 0, '2024-10-17 15:21:41'),
('HN060', 'ddddd', '', NULL, '', '', '', '', '', 0, '2024-10-17 15:21:41'),
('HN061', 'aaaaaaaaaa', '', NULL, '', '', '', 'bbbbbbb', 'ccccccc', 0, '2024-10-17 15:21:41'),
('HN062', 'xd', 'xdd', NULL, '', '', '', 'sss', 'aaa', 0, '2024-10-17 15:21:41'),
('HN063', 'aka', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 55555, '2024-10-17 15:21:41'),
('HN064', 'checkin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 54321, '2024-10-17 15:21:41'),
('HN065', 'พพพพ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 789, '2024-10-17 15:21:41'),
('HN066', 'ปายปู', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1444444, '2024-10-17 15:22:01'),
('HN067', 'ฟฟฟฟฟ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-18 10:05:17');

-- --------------------------------------------------------

--
-- Table structure for table `pregnancy_treatment`
--

CREATE TABLE `pregnancy_treatment` (
  `Treatment_ID` varchar(10) NOT NULL,
  `Pregnancy_Control_Type` varchar(50) DEFAULT NULL,
  `Last_Control_Date` date DEFAULT NULL,
  `Freq_Pregnancies` text DEFAULT NULL,
  `Pregnancy_Problems` text DEFAULT NULL,
  `Total_Pregnancies` int(11) DEFAULT NULL,
  `Total_Children` int(11) DEFAULT NULL,
  `Last_Pregnancy_Date` date DEFAULT NULL,
  `Abortion_History` text DEFAULT NULL,
  `Pregmed_Detail` text DEFAULT NULL,
  `Preg_Others` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `Role_ID` int(11) NOT NULL,
  `Role_Name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`Role_ID`, `Role_Name`) VALUES
(0, 'Doctor'),
(1, 'Nurse');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `Stock_ID` varchar(10) NOT NULL,
  `Medicine_ID` varchar(10) DEFAULT NULL,
  `Quantity_insert` int(11) DEFAULT NULL,
  `Inovic_ID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`Stock_ID`, `Medicine_ID`, `Quantity_insert`, `Inovic_ID`) VALUES
('ST00001', 'm017', 1, 'INO00001'),
('ST00002', 'm061', 3, 'INO00002'),
('ST00003', 'm011', 6, 'INO00003'),
('ST00004', 'm006', 9, 'INO00003'),
('ST00005', 'm004', 4, 'INO00004'),
('ST00006', 'm063', 1, 'INO00005');

-- --------------------------------------------------------

--
-- Table structure for table `treatment`
--

CREATE TABLE `treatment` (
  `Treatment_ID` varchar(10) NOT NULL,
  `HN` varchar(10) DEFAULT NULL,
  `Order_ID` varchar(10) DEFAULT NULL,
  `Treatment_Date` date DEFAULT NULL,
  `Treatment_Details` text DEFAULT NULL,
  `Symptom` varchar(255) DEFAULT NULL,
  `Weight` varchar(255) DEFAULT NULL,
  `Height` varchar(255) DEFAULT NULL,
  `Temp` varchar(255) DEFAULT NULL,
  `Pressure` varchar(255) DEFAULT NULL,
  `Heart_Rate` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `treatment`
--

INSERT INTO `treatment` (`Treatment_ID`, `HN`, `Order_ID`, `Treatment_Date`, `Treatment_Details`, `Symptom`, `Weight`, `Height`, `Temp`, `Pressure`, `Heart_Rate`) VALUES
('', 'HN064', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00001', 'HN029', 'O00001', '2024-08-01', 'test test', '', '0', '0', '0', '0', '0'),
('T00005', 'HN005', 'O00005', '2023-08-12', 'รายละเอียดการรักษา 4', '', '0', '0', '0', '0', '0'),
('T00006', 'HN006', 'O00006', '2023-08-13', 'รายละเอียดการรักษา 5', '', '0', '0', '0', '0', '0'),
('T00009', 'HN009', 'O00009', '2023-08-16', 'รายละเอียดการรักษา 8', '', '0', '0', '0', '0', '0'),
('T00010', 'HN010', 'O00010', '2023-08-17', 'รายละเอียดการรักษา 9', '', '0', '0', '0', '0', '0'),
('T00013', 'HN013', 'O00013', '2023-08-20', 'รายละเอียดการรักษา 12', '', '0', '0', '0', '0', '0'),
('T00014', 'HN014', 'O00014', '2023-08-21', 'รายละเอียดการรักษา 13', '', '0', '0', '0', '0', '0'),
('T00015', 'HN015', 'O00015', '2023-08-22', 'รายละเอียดการรักษา 14', '', '0', '0', '0', '0', '0'),
('T00020', 'HN020', 'O00020', '2023-08-27', 'รายละเอียดการรักษา 19', '', '0', '0', '0', '0', '0'),
('T00021', 'HN002', 'O00031', '2024-08-13', 'teste', '', '0', '0', '0', '0', '0'),
('T00022', 'HN029', 'O00032', '2024-08-13', '', '', '0', '0', '0', '0', '0'),
('T00023', 'HN029', 'O00033', '2024-08-13', 'รักษา', '', '0', '0', '0', '0', '0'),
('T00024', 'HN041', 'O00034', '2024-08-28', 'รายละเอียดการรักษา', 'aaaa', '546546', '244', '54654', '6456546', '5654654'),
('T00025', 'HN024', 'O00037', '2024-08-28', 'รายละเอียดการรักษา', 'เอ๋อ', '6666', '7777', '5555', '44444', '333333'),
('T00026', 'HN045', 'O00052', '2024-08-28', 'รายละเอียดการรักษา', 'k', 'a', 'a', NULL, NULL, '5555'),
('T00027', 'HN061', 'O00053', '2024-08-28', 'รายละเอียดการรักษา', NULL, NULL, NULL, NULL, NULL, NULL),
('T00028', 'HN053', 'O00054', '2024-08-28', 'รายละเอียดการรักษา', 'pee', NULL, NULL, NULL, '21', NULL),
('T00029', 'HN027', 'O00055', '2024-08-28', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00030', 'HN054', 'O00056', '2024-08-28', NULL, 'หมา', NULL, NULL, NULL, NULL, '25'),
('T00031', 'HN011', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00032', 'HN021', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00033', 'HN002', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00034', 'HN013', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00035', 'HN011', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00036', 'HN063', 'O00057', '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00037', 'HN038', NULL, '2024-09-20', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00039', 'HN002', NULL, '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00042', 'HN040', NULL, '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00043', 'HN029', NULL, '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00044', 'HN007', NULL, '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00045', 'HN006', NULL, '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00046', 'HN002', NULL, '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00047', 'HN015', NULL, '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00048', 'HN061', 'O00058', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00049', 'HN062', 'O00059', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00050', 'HN014', 'O00060', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00051', 'HN002', 'O00061', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00052', 'HN026', 'O00062', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00053', 'HN028', 'O00063', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00054', 'HN024', 'O00064', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00055', 'HN041', 'O00065', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00056', 'HN013', 'O00066', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00057', 'HN014', 'O00067', '2024-10-15', NULL, 'ชอบ', '80', '77', '55.5', '42', '43'),
('T00058', 'HN026', 'O00068', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00059', 'HN024', 'O00069', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00060', 'HN051', 'O00070', '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00062', 'HN065', NULL, '2024-10-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00063', 'HN059', 'O00071', '2024-10-15', NULL, 'โง่', '6', '7', '5', '44', '50'),
('T00064', 'HN041', 'O00072', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00065', 'HN010', 'O00073', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00066', 'HN029', 'O00074', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00067', 'HN054', 'O00075', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00068', 'HN002', 'O00076', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00069', 'HN005', 'O00077', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00070', 'HN006', 'O00078', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00071', 'HN010', 'O00079', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00072', 'HN011', 'O00080', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00073', 'HN007', 'O00081', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00074', 'HN035', 'O00082', '2024-10-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00075', 'HN036', 'O00083', '2024-10-17', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00076', 'HN066', NULL, '2024-10-17', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00077', 'HN002', 'O00084', '2024-10-17', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00078', 'HN005', 'O00085', '2024-10-17', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00079', 'HN067', NULL, '2024-10-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00080', 'HN007', 'O00086', '2024-10-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00081', 'HN009', 'O00087', '2024-10-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00082', 'HN007', 'O00088', '2024-10-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00083', 'HN010', 'O00089', '2024-10-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00084', 'HN006', 'O00090', '2024-10-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00085', 'HN002', 'O00091', '2024-10-19', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_ID` int(11) NOT NULL,
  `Role_ID` int(11) DEFAULT NULL,
  `Username` varchar(50) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `accessToken` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_ID`, `Role_ID`, `Username`, `Password`, `accessToken`) VALUES
(1, 1, 'Nurse', 'Nurse', 'fabccc98e3a36821b4ea06a935a4162d'),
(2, 0, 'Doctor', 'Doctor', '4f598cde91b7b079e2d6c7fed11045d5');

-- --------------------------------------------------------

--
-- Table structure for table `walkinqueue`
--

CREATE TABLE `walkinqueue` (
  `Queue_ID` int(11) NOT NULL,
  `HN` varchar(10) DEFAULT NULL,
  `Time` time NOT NULL,
  `Status` varchar(50) DEFAULT 'Pending',
  `date` date NOT NULL DEFAULT curdate(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `walkinqueue`
--

INSERT INTO `walkinqueue` (`Queue_ID`, `HN`, `Time`, `Status`, `date`, `created_at`) VALUES
(1, 'HN002', '18:30:38', 'รอตรวจ', '2024-10-19', '2024-10-19 11:22:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointmentqueue`
--
ALTER TABLE `appointmentqueue`
  ADD KEY `HN` (`HN`);

--
-- Indexes for table `general_treatment`
--
ALTER TABLE `general_treatment`
  ADD PRIMARY KEY (`Treatment_ID`);

--
-- Indexes for table `inovic`
--
ALTER TABLE `inovic`
  ADD PRIMARY KEY (`Inovic_ID`);

--
-- Indexes for table `medicine`
--
ALTER TABLE `medicine`
  ADD PRIMARY KEY (`Medicine_ID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Order_ID`),
  ADD KEY `HN` (`HN`);

--
-- Indexes for table `order_medicine`
--
ALTER TABLE `order_medicine`
  ADD PRIMARY KEY (`Item_ID`),
  ADD KEY `Order_ID` (`Order_ID`),
  ADD KEY `Medicine_ID` (`Medicine_ID`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`HN`);

--
-- Indexes for table `pregnancy_treatment`
--
ALTER TABLE `pregnancy_treatment`
  ADD PRIMARY KEY (`Treatment_ID`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`Role_ID`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`Stock_ID`),
  ADD KEY `Medicine_ID` (`Medicine_ID`),
  ADD KEY `fk_inovic` (`Inovic_ID`);

--
-- Indexes for table `treatment`
--
ALTER TABLE `treatment`
  ADD PRIMARY KEY (`Treatment_ID`),
  ADD KEY `HN` (`HN`),
  ADD KEY `Order_ID` (`Order_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_ID`),
  ADD KEY `Role_ID` (`Role_ID`);

--
-- Indexes for table `walkinqueue`
--
ALTER TABLE `walkinqueue`
  ADD PRIMARY KEY (`Queue_ID`),
  ADD KEY `HN` (`HN`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `walkinqueue`
--
ALTER TABLE `walkinqueue`
  MODIFY `Queue_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointmentqueue`
--
ALTER TABLE `appointmentqueue`
  ADD CONSTRAINT `appointmentqueue_ibfk_1` FOREIGN KEY (`HN`) REFERENCES `patient` (`HN`);

--
-- Constraints for table `general_treatment`
--
ALTER TABLE `general_treatment`
  ADD CONSTRAINT `general_treatment_ibfk_1` FOREIGN KEY (`Treatment_ID`) REFERENCES `treatment` (`Treatment_ID`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`HN`) REFERENCES `patient` (`HN`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`HN`) REFERENCES `patient` (`HN`);

--
-- Constraints for table `order_medicine`
--
ALTER TABLE `order_medicine`
  ADD CONSTRAINT `order_medicine_ibfk_1` FOREIGN KEY (`Order_ID`) REFERENCES `orders` (`Order_ID`),
  ADD CONSTRAINT `order_medicine_ibfk_2` FOREIGN KEY (`Medicine_ID`) REFERENCES `medicine` (`Medicine_ID`);

--
-- Constraints for table `pregnancy_treatment`
--
ALTER TABLE `pregnancy_treatment`
  ADD CONSTRAINT `pregnancy_treatment_ibfk_1` FOREIGN KEY (`Treatment_ID`) REFERENCES `treatment` (`Treatment_ID`) ON DELETE CASCADE;

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `fk_inovic` FOREIGN KEY (`Inovic_ID`) REFERENCES `inovic` (`Inovic_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`Medicine_ID`) REFERENCES `medicine` (`Medicine_ID`);

--
-- Constraints for table `treatment`
--
ALTER TABLE `treatment`
  ADD CONSTRAINT `treatment_ibfk_1` FOREIGN KEY (`HN`) REFERENCES `patient` (`HN`),
  ADD CONSTRAINT `treatment_ibfk_2` FOREIGN KEY (`Order_ID`) REFERENCES `orders` (`Order_ID`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`Role_ID`) REFERENCES `role` (`Role_ID`);

--
-- Constraints for table `walkinqueue`
--
ALTER TABLE `walkinqueue`
  ADD CONSTRAINT `walkinqueue_ibfk_1` FOREIGN KEY (`HN`) REFERENCES `patient` (`HN`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
