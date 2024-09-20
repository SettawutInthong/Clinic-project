-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 20, 2024 at 01:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
('HN002', '2024-09-15', '18:30:00'),
('HN010', '2024-09-17', '15:30:00'),
('HN010', '2024-09-20', '19:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `inovic`
--

CREATE TABLE `inovic` (
  `Inovic_ID` varchar(10) NOT NULL,
  `Inovic_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

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
  `Quantity` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `medicine`
--

INSERT INTO `medicine` (`Medicine_ID`, `Medicine_Name`, `Description`, `Med_Cost`, `Quantity_type`, `Quantity`) VALUES
('m001', 'Paracetamol', 'บรรเทาอาการปวดและลดไข้', 25.00, 'Tablet', 764),
('m002', 'Brufen', 'บรรเทาอาการปวดและลดการอักเสบ', 80.00, 'Tablet', 547),
('m003', 'Naproxen', 'บรรเทาอาการปวดและลดการอักเสบ', 55.00, 'Tablet', 245),
('m004', 'Norgesic', 'บรรเทาอาการปวดกล้ามเนื้อ', 35.00, 'Tablet', 582),
('m005', 'Piroxicam', 'บรรเทาอาการปวดและลดการอักเสบ', 60.00, 'Capsule', 775),
('m006', 'Indocid', 'บรรเทาอาการปวดและลดการอักเสบ', 48.00, 'Capsule', 730),
('m007', 'Gaba', 'บรรเทาอาการวิตกกังวล', 120.00, 'Capsule', 526),
('m008', 'Nilide', 'บรรเทาอาการปวด', 18.00, 'Tablet', 239),
('m009', 'Cafagot', 'บรรเทาอาการปวดหัวไมเกรน', 75.00, 'Tablet', 620),
('m010', 'Par Syrup', 'บรรเทาอาการปวดและลดไข้ (สำหรับเด็ก)', 40.00, 'Syrup', 384),
('m011', 'DFN', 'บรรเทาอาการปวดและลดไข้', 32.00, 'Tablet', 459),
('m012', 'Colchicine', 'บรรเทาอาการปวดข้อจากโรคเกาต์', 95.00, 'Tablet', 344),
('m013', 'Caron', 'ยาบรรเทาอาการท้องอืด', 3.00, 'Tablet', 745),
('m014', 'Cipro', 'ยาปฏิชีวนะ', 80.00, 'Syrup', 692),
('m015', 'Amoxy', 'ยาปฏิชีวนะ', 60.00, 'Syrup', 425),
('m016', 'Cephalexin', 'ยาปฏิชีวนะ', 75.00, 'Syrup', 448),
('m017', 'Augmentin', 'ยาปฏิชีวนะ', 120.00, 'Syrup', 769),
('m018', 'Erythromycin', 'ยาปฏิชีวนะ', 90.00, 'Syrup', 499),
('m019', 'Carbo', 'ยาแก้ท้องเสีย', 50.00, 'Syrup', 590),
('m020', 'Topamine', 'ยาแก้แพ้', 45.00, 'Syrup', 653),
('m021', 'Bactrim', 'ยาปฏิชีวนะ', 110.00, 'Syrup', 694),
('m022', 'Multivitamin', 'วิตามินรวม', 150.00, 'Syrup', 712),
('m023', 'Albendazole', 'ยาถ่ายพยาธิ', 35.00, 'Syrup', 679),
('m024', 'Atarax', 'ยาแก้แพ้', 65.00, 'Syrup', 459),
('m025', 'Mesto', 'ยาฆ่าเชื้อ', 18.00, 'Tablet', 660),
('m026', 'Dulcolex', 'ยาระบาย', 15.00, 'Tablet', 521),
('m027', 'Simethicone', 'ยาลดกรด', 12.00, 'Tablet', 426),
('m028', 'Omiprozole', 'ยาลดกรด', 22.00, 'Tablet', 368),
('m029', 'Cabon', 'ยาบรรเทาอาการท้องอืด', 8.00, 'Tablet', 362),
('m030', 'Dom', 'ยาแก้คลื่นไส้', 10.00, 'Tablet', 508),
('m031', 'Hyosin', 'ยาแก้ปวดท้อง', 14.00, 'Tablet', 653),
('m032', 'ORS', 'เกลือแร่', 5.00, 'Powder', 344),
('m033', 'Daminate', 'ยาแก้ไอ', 10.00, 'Tablet', 759),
('m034', 'Cabocys', 'ยาบรรเทาอาการท้องอืด', 8.00, 'Tablet', 765),
('m035', 'ยาอม', 'ยาอมแก้ไอ', 5.00, 'Lozenge', 747),
('m036', 'Salbu', 'ยาขยายหลอดลม', 150.00, 'Inhaler', 642),
('m037', 'Thiopilline', 'ยาขยายหลอดลม', 20.00, 'Tablet', 768),
('m038', 'Boracouge', 'ยาแก้เจ็บคอ', 35.00, 'Gargle', 515),
('m039', 'cpm', 'ยาแก้ปวด', 12.00, 'Tablet', 671),
('m040', 'Loratadine', 'ยาแก้แพ้', 8.00, 'Tablet', 409),
('m041', 'Merin', 'ยาแก้คลื่นไส้', 15.00, 'Tablet', 434),
('m042', 'folic', 'วิตามินเสริม', 5.00, 'Tablet', 743),
('m043', 'MTV', 'วิตามินรวม', 10.00, 'Tablet', 415),
('m044', 'ferrous', 'ธาตุเหล็ก', 8.00, 'Tablet', 248),
('m045', 'flulium', 'ยาบรรเทาอาการหวัด', 15.00, 'Tablet', 392),
('m046', 'mocobal', 'วิตามินบี 12', 12.00, 'Tablet', 419),
('m047', 'DMPA', 'ยาคุมกำเนิดชนิดฉีด', 150.00, 'Injection', 719),
('m048', 'Cyclofem', 'ยาคุมกำเนิดชนิดเม็ด', 35.00, 'Tablet', 337),
('m049', 'DFN', 'ยาแก้ปวดลดไข้', 5.00, 'Tablet', 528),
('m050', 'Hyosin', 'ยาแก้ปวดท้อง', 14.00, 'Tablet', 232),
('m051', 'Dimenhydrinate', 'ยาแก้เมารถเมาเรือ', 10.00, 'Tablet', 575),
('m052', 'Rofipan', 'ยาแก้ปวดลดไข้', 8.00, 'Tablet', 781),
('m053', 'Bco', 'วิตามินบีรวม', 12.00, 'Tablet', 781),
('m054', 'Neurovit', 'วิตามินบำรุงประสาท', 20.00, 'Tablet', 761),
('m055', '0.1% TA cream', 'ยารักษาสิว', 50.00, 'Cream', 665),
('m056', '0.02% TA cream', 'ยารักษาสิว', 45.00, 'Cream', 239),
('m057', 'Bet-n cream', 'ยาทาสเตียรอยด์', 80.00, 'Cream', 203),
('m058', 'Keto cream', 'ยาแก้คัน', 60.00, 'Cream', 697),
('m059', 'DFN cream', 'ยาแก้ปวดลดการอักเสบ', 40.00, 'Cream', 277),
('m060', '0.1% TA Lotion', 'ยารักษาสิว', 65.00, 'Lotion', 292),
('m061', 'Calamile lotion', 'โลชั่นแก้คัน', 30.00, 'Lotion', 433),
('m062', 'Bactex cream', 'ยาฆ่าเชื้อ', 75.00, 'Cream', 489),
('m063', 'E-U 2000 cream', 'ยาทาแก้ผื่นแพ้', 90.00, 'Cream', 346),
('m064', 'Kool Fever', 'แผ่นเจลลดไข้', 25.00, 'Patch', 662);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Order_ID` varchar(10) NOT NULL,
  `HN` varchar(10) DEFAULT NULL,
  `Order_Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Order_ID`, `HN`, `Order_Date`) VALUES
('O00001', 'HN002', '2024-11-10'),
('O00002', 'HN003', '2025-05-15'),
('O00003', 'HN004', '2024-09-06'),
('O00004', 'HN005', '2024-09-15'),
('O00005', 'HN006', '2024-11-20'),
('O00006', 'HN007', '2024-09-23'),
('O00007', 'HN008', '2025-05-17'),
('O00008', 'HN009', '2025-02-04'),
('O00009', 'HN010', '2024-10-05'),
('O00010', 'HN011', '2024-12-05'),
('O00011', 'HN012', '2024-11-30'),
('O00012', 'HN013', '2025-07-21'),
('O00013', 'HN014', '2025-06-05'),
('O00014', 'HN015', '2024-11-18'),
('O00015', 'HN016', '2025-07-15'),
('O00016', 'HN017', '2025-06-11'),
('O00017', 'HN018', '2025-01-05'),
('O00018', 'HN019', '2025-02-17'),
('O00019', 'HN020', '2025-01-11'),
('O00020', 'HN021', '2025-02-27'),
('O00021', 'HN002', '2025-03-07'),
('O00022', 'HN029', '2024-08-13'),
('O00023', 'HN029', '2024-08-13'),
('O00024', 'HN029', '2024-08-13'),
('O00025', 'HN029', '2024-08-13'),
('O00026', 'HN029', '2024-08-13'),
('O00027', 'HN029', '2024-08-13'),
('O00028', 'HN029', '2024-08-13'),
('O00029', 'HN029', '2024-08-13'),
('O00030', 'HN040', '2024-08-13'),
('O00031', 'HN002', '2024-08-13'),
('O00032', 'HN029', '2024-08-13'),
('O00033', 'HN029', '2024-08-13'),
('O00034', 'HN041', '2024-08-28'),
('O00035', 'HN021', '2024-08-28'),
('O00036', 'HN028', '2024-08-28'),
('O00037', 'HN024', '2024-08-28'),
('O00038', 'HN008', '2024-08-28'),
('O00039', 'HN008', '2024-08-28'),
('O00040', 'HN008', '2024-08-28'),
('O00041', 'HN021', '2024-08-28'),
('O00042', 'HN021', '2024-08-28'),
('O00043', 'HN021', '2024-08-28'),
('O00044', 'HN021', '2024-08-28'),
('O00045', 'HN021', '2024-08-28'),
('O00046', 'HN021', '2024-08-28'),
('O00047', 'HN021', '2024-08-28'),
('O00048', 'HN021', '2024-08-28'),
('O00049', 'HN007', '2024-08-28'),
('O00050', 'HN007', '2024-08-28'),
('O00051', 'HN046', '2024-08-28'),
('O00052', 'HN045', '2024-08-28'),
('O00053', 'HN061', '2024-08-28'),
('O00054', 'HN053', '2024-08-28'),
('O00055', 'HN027', '2024-08-28'),
('O00056', 'HN054', '2024-08-28'),
('O00057', 'HN063', '2024-09-15');

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
('I00004', 'O00002', 'm042', 8),
('I00005', 'O00002', 'm009', 1),
('I00006', 'O00002', 'm064', 10),
('I00007', 'O00003', 'm035', 6),
('I00008', 'O00003', 'm012', 2),
('I00009', 'O00003', 'm058', 9),
('I00010', 'O00004', 'm021', 4),
('I00011', 'O00004', 'm005', 7),
('I00012', 'O00004', 'm038', 11),
('I00013', 'O00005', 'm049', 15),
('I00014', 'O00005', 'm016', 20),
('I00015', 'O00005', 'm032', 3),
('I00016', 'O00006', 'm002', 8),
('I00017', 'O00006', 'm055', 1),
('I00018', 'O00006', 'm046', 5),
('I00019', 'O00007', 'm019', 12),
('I00020', 'O00007', 'm037', 9),
('I00021', 'O00029', 'm001', 7),
('I00022', 'O00030', 'm010', 6),
('I00023', 'O00030', 'm052', 8),
('I00024', 'O00030', 'm001', 1),
('I00025', 'O00031', 'm001', 8),
('I00026', 'O00031', 'm010', 9),
('I00027', 'O00033', 'm036', 2),
('I00028', 'O00033', 'm061', 1),
('I00029', 'O00033', 'm063', 1);

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
  `ID` int(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`HN`, `First_Name`, `Last_Name`, `Birthdate`, `Phone`, `Gender`, `Title`, `Disease`, `Allergy`, `ID`) VALUES
('HN002', 'สมหญิง', 'ใจดี', '1985-08-22', '0823456789', 'หญิง', 'นาง', '', '', 0),
('HN003', 'สมศักดิ์', 'ใจสู้', '1975-03-18', '0834567890', 'ชาย', 'นาย', '', '', 0),
('HN004', 'สมพร', 'ใจบุญ', '1990-11-05', '0845678901', 'หญิง', 'นางสาว', '', '', 0),
('HN005', 'สมหมาย', 'ใจถึง', '1968-07-29', '0856789012', 'ชาย', 'นาย', '', '', 0),
('HN006', 'สมใจ', 'ใจเย็น', '1995-02-14', '0867890123', 'หญิง', 'นางสาว', '', '', 0),
('HN007', 'สมบูรณ์', 'ใจกว้าง', '1972-09-03', '0878901234', 'ชาย', 'นาย', '', '', 0),
('HN008', 'สมปอง', 'ใจดี', '1988-04-20', '0889012345', 'หญิง', 'นาง', '', '', 0),
('HN009', 'สมหวัง', 'ใจมั่น', '1965-12-31', '0890123456', 'ชาย', 'นาย', '', '', 0),
('HN010', 'สมนึก', 'ใจสบาย', '1992-06-26', '0901234567', 'หญิง', 'นางสาว', '', '', 0),
('HN011', 'สมคิด', 'ใจเด็ด', '1978-10-15', '0912345678', 'ชาย', 'นาย', '', '', 0),
('HN012', 'สมทรง', 'ใจงาม', '1983-01-08', '0923456789', 'หญิง', 'นาง', '', '', 0),
('HN013', 'สมาน', 'ใจดี', '1997-09-23', '0934567890', 'ชาย', 'นาย', '', '', 0),
('HN014', 'สมหญิง', 'ใจบุญ', '1966-06-11', '0945678901', 'หญิง', 'นาง', '', '', 0),
('HN015', 'สมชาย', 'ใจสู้', '1989-03-07', '0956789012', 'ชาย', 'นาย', '', '', 0),
('HN016', 'สมใจ', 'ใจเย็น', '1974-12-25', '0967890123', 'หญิง', 'นางสาว', '', '', 0),
('HN017', 'สมศักดิ์', 'ใจกว้าง', '1991-08-19', '0978901234', 'ชาย', 'นาย', '', '', 0),
('HN018', 'สมพร', 'ใจดี', '1986-05-04', '0989012345', 'หญิง', 'นาง', '', '', 0),
('HN019', 'สมหมาย', 'ใจมั่น', '1970-02-28', '0990123456', 'ชาย', 'นาย', '', '', 0),
('HN020', 'สมนึก', 'ใจสบาย', '1994-11-17', '0812345678', 'หญิง', 'นางสาว', '', '', 0),
('HN021', 'นก ', 'จก', '0000-00-00', '', 'หญิง', 'นางสาว', '', '', 0),
('HN023', 'q', 's', '0000-00-00', '', 'ชาย', '', '', '', 0),
('HN024', 'sad', 'a', '2024-07-07', 'sdd', '', 'นาย', '', '', 0),
('HN026', 'ๆๆๆๆๆๆ', 't', '2024-07-02', '1111111', 'ชาย', 'นาย', '', '', 0),
('HN027', 'a', 'a', '0000-00-00', 'x', '', '', '', '', 0),
('HN028', 't', 't', '2024-07-01', '', '', '', '', '', 0),
('HN029', 'h', 'h', '2024-07-05', '', 'หญิง', 'นาย', '', '', 0),
('HN035', 'ฟอฟ', 'กอฟ', '2024-07-12', '', 'หญิง', '', '', '', 0),
('HN036', 'สมหญิ', 'ใจดี', '1985-08-21', '0823456789', 'หญิง', 'นาง', '', '', 0),
('HN038', '', '', NULL, '', 'หญิง', '', '', '', 0),
('HN040', 'มา', 'นา', NULL, '', 'หญิง', '', '', '', 0),
('HN041', 'poda', 'โพ', NULL, '', '', '', '', '', 0),
('HN042', 'ฟ', '', NULL, '', '', '', '', '', 0),
('HN044', '', 'กกก', NULL, '', '', '', '', '', 0),
('HN045', 'ฟฟฟฟฟ', '', NULL, '', '', '', '', '', 0),
('HN046', 'หฟกหฟก', '', NULL, '', '', '', '', '', 0),
('HN048', '', 'หฟก', NULL, '', '', '', '', '', 0),
('HN049', 'กกกก', '', NULL, '', '', '', '', '', 0),
('HN050', '', 'กกกก', NULL, '', '', '', '', '', 0),
('HN051', 'หฟก', 'หฟก', NULL, '', '', '', '', '', 0),
('HN052', 'กกกก', '', NULL, '', '', '', '', '', 0),
('HN053', '', 'กกก', NULL, '', '', '', '', '', 0),
('HN054', 'ฟฟฟฟ', '', NULL, '', '', '', '', '', 0),
('HN055', 'ฟฟฟ', '', NULL, '', '', '', '', '', 0),
('HN056', '', 'ฟกหฟกฟหกห', NULL, '', '', '', '', '', 0),
('HN057', 'aaaaa', '', NULL, '', '', '', '', '', 0),
('HN058', 'vvvvvv', '', NULL, '', '', '', '', '', 0),
('HN059', 'bbbbbb', '', NULL, '', '', '', '', '', 0),
('HN060', 'ddddd', '', NULL, '', '', '', '', '', 0),
('HN061', 'aaaaaaaaaa', '', NULL, '', '', '', 'bbbbbbb', 'ccccccc', 0),
('HN062', 'xd', 'xdd', NULL, '', '', '', 'sss', 'aaa', 0),
('HN063', 'aka', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 55555),
('HN064', 'checkin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 54321);

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
  `Treatment_cost` int(10) DEFAULT NULL,
  `Total_Cost` decimal(10,2) DEFAULT NULL,
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

INSERT INTO `treatment` (`Treatment_ID`, `HN`, `Order_ID`, `Treatment_Date`, `Treatment_Details`, `Treatment_cost`, `Total_Cost`, `Symptom`, `Weight`, `Height`, `Temp`, `Pressure`, `Heart_Rate`) VALUES
('', 'HN064', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00001', 'HN029', 'O00001', '2024-08-01', 'test test', NULL, 10.00, '', '0', '0', '0', '0', '0'),
('T00002', 'HN002', 'O00002', '2023-08-09', 'รายละเอียดการรักษา 1', 500, 550.00, '', '0', '0', '0', '0', '0'),
('T00003', 'HN003', 'O00003', '2023-08-10', 'รายละเอียดการรักษา 2', 800, 880.00, '', '0', '0', '0', '0', '0'),
('T00004', 'HN004', 'O00004', '2023-08-11', 'รายละเอียดการรักษา 3', 1200, 1320.00, '', '0', '0', '0', '0', '0'),
('T00005', 'HN005', 'O00005', '2023-08-12', 'รายละเอียดการรักษา 4', 750, 825.00, '', '0', '0', '0', '0', '0'),
('T00006', 'HN006', 'O00006', '2023-08-13', 'รายละเอียดการรักษา 5', 1000, 1100.00, '', '0', '0', '0', '0', '0'),
('T00007', 'HN007', 'O00007', '2023-08-14', 'รายละเอียดการรักษา 6', 600, 660.00, '', '0', '0', '0', '0', '0'),
('T00008', 'HN008', 'O00008', '2023-08-15', 'รายละเอียดการรักษา 7', 900, 990.00, '', '0', '0', '0', '0', '0'),
('T00009', 'HN009', 'O00009', '2023-08-16', 'รายละเอียดการรักษา 8', 1100, 1210.00, '', '0', '0', '0', '0', '0'),
('T00010', 'HN010', 'O00010', '2023-08-17', 'รายละเอียดการรักษา 9', 450, 495.00, '', '0', '0', '0', '0', '0'),
('T00011', 'HN011', 'O00011', '2023-08-18', 'รายละเอียดการรักษา 10', 850, 935.00, '', '0', '0', '0', '0', '0'),
('T00012', 'HN012', 'O00012', '2023-08-19', 'รายละเอียดการรักษา 11', 1300, 1430.00, '', '0', '0', '0', '0', '0'),
('T00013', 'HN013', 'O00013', '2023-08-20', 'รายละเอียดการรักษา 12', 700, 770.00, '', '0', '0', '0', '0', '0'),
('T00014', 'HN014', 'O00014', '2023-08-21', 'รายละเอียดการรักษา 13', 950, 1045.00, '', '0', '0', '0', '0', '0'),
('T00015', 'HN015', 'O00015', '2023-08-22', 'รายละเอียดการรักษา 14', 550, 605.00, '', '0', '0', '0', '0', '0'),
('T00016', 'HN016', 'O00016', '2023-08-23', 'รายละเอียดการรักษา 15', 1050, 1155.00, '', '0', '0', '0', '0', '0'),
('T00017', 'HN017', 'O00017', '2023-08-24', 'รายละเอียดการรักษา 16', 650, 715.00, '', '0', '0', '0', '0', '0'),
('T00018', 'HN018', 'O00018', '2023-08-25', 'รายละเอียดการรักษา 17', 800, 880.00, '', '0', '0', '0', '0', '0'),
('T00019', 'HN019', 'O00019', '2023-08-26', 'รายละเอียดการรักษา 18', 1250, 1375.00, '', '0', '0', '0', '0', '0'),
('T00020', 'HN020', 'O00020', '2023-08-27', 'รายละเอียดการรักษา 19', 300, 330.00, '', '0', '0', '0', '0', '0'),
('T00021', 'HN002', 'O00031', '2024-08-13', 'teste', 300, NULL, '', '0', '0', '0', '0', '0'),
('T00022', 'HN029', 'O00032', '2024-08-13', '', 0, NULL, '', '0', '0', '0', '0', '0'),
('T00023', 'HN029', 'O00033', '2024-08-13', 'รักษา', 500, NULL, '', '0', '0', '0', '0', '0'),
('T00024', 'HN041', 'O00034', '2024-08-28', 'รายละเอียดการรักษา', 0, 0.00, 'aaaa', '546546', '244', '54654', '6456546', '5654654'),
('T00025', 'HN024', 'O00037', '2024-08-28', 'รายละเอียดการรักษา', 0, 0.00, 'เอ๋อ', '6666', '7777', '5555', '44444', '333333'),
('T00026', 'HN045', 'O00052', '2024-08-28', 'รายละเอียดการรักษา', 0, 0.00, 'k', 'a', 'a', NULL, NULL, '5555'),
('T00027', 'HN061', 'O00053', '2024-08-28', 'รายละเอียดการรักษา', 0, 0.00, NULL, NULL, NULL, NULL, NULL, NULL),
('T00028', 'HN053', 'O00054', '2024-08-28', 'รายละเอียดการรักษา', 0, 0.00, 'pee', NULL, NULL, NULL, '21', NULL),
('T00029', 'HN027', 'O00055', '2024-08-28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00030', 'HN054', 'O00056', '2024-08-28', NULL, NULL, NULL, 'หมา', NULL, NULL, NULL, NULL, '25'),
('T00031', 'HN011', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00032', 'HN021', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00033', 'HN002', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00034', 'HN013', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00035', 'HN011', NULL, '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00036', 'HN063', 'O00057', '2024-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00037', 'HN038', NULL, '2024-09-20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('T00038', 'HN049', NULL, '2024-09-20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
(1, 1, 'Nurse', 'Nurse', '238ed2d3970f72bec771bd393873d7d9'),
(2, 0, 'Doctor', 'Doctor', 'd07fda89268061ec2ee86ab665be4e3f');

-- --------------------------------------------------------

--
-- Table structure for table `walkinqueue`
--

CREATE TABLE `walkinqueue` (
  `Queue_ID` int(11) NOT NULL,
  `HN` varchar(10) DEFAULT NULL,
  `Time` time NOT NULL,
  `Status` varchar(50) DEFAULT 'Pending',
  `date` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `walkinqueue`
--

INSERT INTO `walkinqueue` (`Queue_ID`, `HN`, `Time`, `Status`, `date`) VALUES
(15, 'HN058', '19:15:00', 'checkin', '2024-09-20'),
(16, 'HN011', '20:15:00', 'checkin', '2024-09-20'),
(17, 'HN005', '20:30:00', 'checkin', '2024-09-20'),
(18, 'HN013', '15:30:00', 'checkin', '2024-09-20'),
(19, 'HN002', '16:30:00', 'checkin', '2024-09-20'),
(20, 'HN002', '16:30:00', 'checkin', '2024-09-20'),
(21, 'HN013', '15:30:00', 'checkin', '2024-09-20'),
(22, 'HN004', '20:45:00', 'checkin', '2024-09-20'),
(23, 'HN005', '21:00:00', 'checkin', '2024-09-20'),
(24, 'HN013', '15:30:00', 'checkin', '2024-09-20'),
(25, 'HN013', '21:15:00', 'checkin', '2024-09-20'),
(26, 'HN011', '21:30:00', 'checkin', '2024-09-20'),
(27, 'HN006', '21:45:00', 'checkin', '2024-09-20'),
(28, 'HN011', '22:00:00', 'checkin', '2024-09-20'),
(29, 'HN021', '22:15:00', 'checkin', '2024-09-20'),
(30, 'HN002', '22:30:00', 'checkin', '2024-09-20'),
(31, 'HN013', '22:45:00', 'checkin', '2024-09-20'),
(32, 'HN011', '23:00:00', 'checkin', '2024-09-20'),
(125, 'HN063', '00:00:00', 'Pending', '2024-09-20'),
(126, 'HN064', '23:15:00', 'checkin', '2024-09-20'),
(127, 'HN038', '19:00:00', 'checkin', '2024-09-20'),
(128, 'HN049', '23:30:00', 'checkin', '2024-09-20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointmentqueue`
--
ALTER TABLE `appointmentqueue`
  ADD KEY `HN` (`HN`);

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
  MODIFY `Queue_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointmentqueue`
--
ALTER TABLE `appointmentqueue`
  ADD CONSTRAINT `appointmentqueue_ibfk_1` FOREIGN KEY (`HN`) REFERENCES `patient` (`HN`);

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
  ADD CONSTRAINT `treatment_ibfk_2` FOREIGN KEY (`Order_ID`) REFERENCES `orders` (`Order_ID`);

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
