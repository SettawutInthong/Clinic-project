-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 08, 2024 at 03:40 PM
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
-- Table structure for table `allergy`
--

CREATE TABLE `allergy` (
  `Allergy_ID` varchar(10) NOT NULL,
  `Allergy_Details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `allergy`
--

INSERT INTO `allergy` (`Allergy_ID`, `Allergy_Details`) VALUES
('A000', '- Unknown -'),
('A001', 'ผื่นขึ้น, คัน'),
('A002', 'หายใจลำบาก'),
('A003', 'คลื่นไส้, อาเจียน'),
('A004', 'หน้าบวม'),
('A005', 'น้ำมูกไหล, จาม'),
('A006', 'ปวดท้อง'),
('A007', 'วิงเวียนศีรษะ'),
('A008', 'ความดันโลหิตต่ำ'),
('A009', 'ตาแดง, คันตา'),
('A010', 'ผื่นลมพิษ'),
('A011', 'หายใจมีเสียงหวีด'),
('A012', 'ปากบวม'),
('A013', 'ช็อค'),
('A014', 'ท้องเสีย'),
('A015', 'ปวดหัว'),
('A016', 'เจ็บหน้าอก'),
('A017', 'เป็นลม'),
('A018', 'คอแห้ง'),
('A019', 'ลิ้นชา'),
('A020', 'ไอ');

-- --------------------------------------------------------

--
-- Table structure for table `appointmentqueue`
--

CREATE TABLE `appointmentqueue` (
  `Queue_ID` varchar(10) NOT NULL,
  `HN` varchar(10) DEFAULT NULL,
  `Queue_Date` date DEFAULT NULL,
  `Queue_Time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `chronic_disease`
--

CREATE TABLE `chronic_disease` (
  `Disease_ID` varchar(10) NOT NULL,
  `disease_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `chronic_disease`
--

INSERT INTO `chronic_disease` (`Disease_ID`, `disease_name`) VALUES
('D000', '- Unknown -'),
('D001', 'เบาหวาน'),
('D002', 'ความดันโลหิตสูง'),
('D003', 'โรคหัวใจ'),
('D004', 'โรคไต');

-- --------------------------------------------------------

--
-- Table structure for table `inovic`
--

CREATE TABLE `inovic` (
  `Inovic_ID` varchar(10) NOT NULL,
  `Stock_ID` varchar(10) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
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
  `Quantity_type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `medicine`
--

INSERT INTO `medicine` (`Medicine_ID`, `Medicine_Name`, `Description`, `Med_Cost`, `Quantity_type`) VALUES
('m001', 'Paracetamol', 'บรรเทาอาการปวดและลดไข้', 25.00, 'Tablet'),
('m002', 'Brufen', 'บรรเทาอาการปวดและลดการอักเสบ', 80.00, 'Tablet'),
('m003', 'Naproxen', 'บรรเทาอาการปวดและลดการอักเสบ', 55.00, 'Tablet'),
('m004', 'Norgesic', 'บรรเทาอาการปวดกล้ามเนื้อ', 35.00, 'Tablet'),
('m005', 'Piroxicam', 'บรรเทาอาการปวดและลดการอักเสบ', 60.00, 'Capsule'),
('m006', 'Indocid', 'บรรเทาอาการปวดและลดการอักเสบ', 48.00, 'Capsule'),
('m007', 'Gaba', 'บรรเทาอาการวิตกกังวล', 120.00, 'Capsule'),
('m008', 'Nilide', 'บรรเทาอาการปวด', 18.00, 'Tablet'),
('m009', 'Cafagot', 'บรรเทาอาการปวดหัวไมเกรน', 75.00, 'Tablet'),
('m010', 'Par Syrup', 'บรรเทาอาการปวดและลดไข้ (สำหรับเด็ก)', 40.00, 'Syrup'),
('m011', 'DFN', 'บรรเทาอาการปวดและลดไข้', 32.00, 'Tablet'),
('m012', 'Colchicine', 'บรรเทาอาการปวดข้อจากโรคเกาต์', 95.00, 'Tablet'),
('m013', 'Caron', 'ยาบรรเทาอาการท้องอืด', 3.00, 'Tablet'),
('m014', 'Cipro', 'ยาปฏิชีวนะ', 80.00, 'Syrup'),
('m015', 'Amoxy', 'ยาปฏิชีวนะ', 60.00, 'Syrup'),
('m016', 'Cephalexin', 'ยาปฏิชีวนะ', 75.00, 'Syrup'),
('m017', 'Augmentin', 'ยาปฏิชีวนะ', 120.00, 'Syrup'),
('m018', 'Erythromycin', 'ยาปฏิชีวนะ', 90.00, 'Syrup'),
('m019', 'Carbo', 'ยาแก้ท้องเสีย', 50.00, 'Syrup'),
('m020', 'Topamine', 'ยาแก้แพ้', 45.00, 'Syrup'),
('m021', 'Bactrim', 'ยาปฏิชีวนะ', 110.00, 'Syrup'),
('m022', 'Multivitamin', 'วิตามินรวม', 150.00, 'Syrup'),
('m023', 'Albendazole', 'ยาถ่ายพยาธิ', 35.00, 'Syrup'),
('m024', 'Atarax', 'ยาแก้แพ้', 65.00, 'Syrup'),
('m025', 'Mesto', 'ยาฆ่าเชื้อ', 18.00, 'Tablet'),
('m026', 'Dulcolex', 'ยาระบาย', 15.00, 'Tablet'),
('m027', 'Simethicone', 'ยาลดกรด', 12.00, 'Tablet'),
('m028', 'Omiprozole', 'ยาลดกรด', 22.00, 'Tablet'),
('m029', 'Cabon', 'ยาบรรเทาอาการท้องอืด', 8.00, 'Tablet'),
('m030', 'Dom', 'ยาแก้คลื่นไส้', 10.00, 'Tablet'),
('m031', 'Hyosin', 'ยาแก้ปวดท้อง', 14.00, 'Tablet'),
('m032', 'ORS', 'เกลือแร่', 5.00, 'Powder'),
('m033', 'Daminate', 'ยาแก้ไอ', 10.00, 'Tablet'),
('m034', 'Cabocys', 'ยาบรรเทาอาการท้องอืด', 8.00, 'Tablet'),
('m035', 'ยาอม', 'ยาอมแก้ไอ', 5.00, 'Lozenge'),
('m036', 'Salbu', 'ยาขยายหลอดลม', 150.00, 'Inhaler'),
('m037', 'Thiopilline', 'ยาขยายหลอดลม', 20.00, 'Tablet'),
('m038', 'Boracouge', 'ยาแก้เจ็บคอ', 35.00, 'Gargle'),
('m039', 'cpm', 'ยาแก้ปวด', 12.00, 'Tablet'),
('m040', 'Loratadine', 'ยาแก้แพ้', 8.00, 'Tablet'),
('m041', 'Merin', 'ยาแก้คลื่นไส้', 15.00, 'Tablet'),
('m042', 'folic', 'วิตามินเสริม', 5.00, 'Tablet'),
('m043', 'MTV', 'วิตามินรวม', 10.00, 'Tablet'),
('m044', 'ferrous', 'ธาตุเหล็ก', 8.00, 'Tablet'),
('m045', 'flulium', 'ยาบรรเทาอาการหวัด', 15.00, 'Tablet'),
('m046', 'mocobal', 'วิตามินบี 12', 12.00, 'Tablet'),
('m047', 'DMPA', 'ยาคุมกำเนิดชนิดฉีด', 150.00, 'Injection'),
('m048', 'Cyclofem', 'ยาคุมกำเนิดชนิดเม็ด', 35.00, 'Tablet'),
('m049', 'DFN', 'ยาแก้ปวดลดไข้', 5.00, 'Tablet'),
('m050', 'Hyosin', 'ยาแก้ปวดท้อง', 14.00, 'Tablet'),
('m051', 'Dimenhydrinate', 'ยาแก้เมารถเมาเรือ', 10.00, 'Tablet'),
('m052', 'Rofipan', 'ยาแก้ปวดลดไข้', 8.00, 'Tablet'),
('m053', 'Bco', 'วิตามินบีรวม', 12.00, 'Tablet'),
('m054', 'Neurovit', 'วิตามินบำรุงประสาท', 20.00, 'Tablet'),
('m055', '0.1% TA cream', 'ยารักษาสิว', 50.00, 'Cream'),
('m056', '0.02% TA cream', 'ยารักษาสิว', 45.00, 'Cream'),
('m057', 'Bet-n cream', 'ยาทาสเตียรอยด์', 80.00, 'Cream'),
('m058', 'Keto cream', 'ยาแก้คัน', 60.00, 'Cream'),
('m059', 'DFN cream', 'ยาแก้ปวดลดการอักเสบ', 40.00, 'Cream'),
('m060', '0.1% TA Lotion', 'ยารักษาสิว', 65.00, 'Lotion'),
('m061', 'Calamile lotion', 'โลชั่นแก้คัน', 30.00, 'Lotion'),
('m062', 'Bactex cream', 'ยาฆ่าเชื้อ', 75.00, 'Cream'),
('m063', 'E-U 2000 cream', 'ยาทาแก้ผื่นแพ้', 90.00, 'Cream'),
('m064', 'Kool Fever', 'แผ่นเจลลดไข้', 25.00, 'Patch');

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
('O00021', 'HN002', '2025-03-07');

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
('I00020', 'O00007', 'm037', 9);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `HN` varchar(10) NOT NULL,
  `Disease_ID` varchar(10) DEFAULT NULL,
  `Allergy_ID` varchar(10) DEFAULT NULL,
  `First_Name` varchar(50) DEFAULT NULL,
  `Last_Name` varchar(50) DEFAULT NULL,
  `Birthdate` date DEFAULT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Title` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`HN`, `Disease_ID`, `Allergy_ID`, `First_Name`, `Last_Name`, `Birthdate`, `Phone`, `Gender`, `Title`) VALUES
('HN002', NULL, NULL, 'สมหญิง', 'ใจดี', '1985-08-22', '0823456789', 'หญิง', 'นาง'),
('HN003', NULL, NULL, 'สมศักดิ์', 'ใจสู้', '1975-03-18', '0834567890', 'ชาย', 'นาย'),
('HN004', NULL, NULL, 'สมพร', 'ใจบุญ', '1990-11-05', '0845678901', 'หญิง', 'นางสาว'),
('HN005', NULL, NULL, 'สมหมาย', 'ใจถึง', '1968-07-29', '0856789012', 'ชาย', 'นาย'),
('HN006', NULL, NULL, 'สมใจ', 'ใจเย็น', '1995-02-14', '0867890123', 'หญิง', 'นางสาว'),
('HN007', NULL, NULL, 'สมบูรณ์', 'ใจกว้าง', '1972-09-03', '0878901234', 'ชาย', 'นาย'),
('HN008', NULL, NULL, 'สมปอง', 'ใจดี', '1988-04-20', '0889012345', 'หญิง', 'นาง'),
('HN009', NULL, NULL, 'สมหวัง', 'ใจมั่น', '1965-12-31', '0890123456', 'ชาย', 'นาย'),
('HN010', NULL, NULL, 'สมนึก', 'ใจสบาย', '1992-06-26', '0901234567', 'หญิง', 'นางสาว'),
('HN011', NULL, NULL, 'สมคิด', 'ใจเด็ด', '1978-10-15', '0912345678', 'ชาย', 'นาย'),
('HN012', NULL, NULL, 'สมทรง', 'ใจงาม', '1983-01-08', '0923456789', 'หญิง', 'นาง'),
('HN013', NULL, NULL, 'สมาน', 'ใจดี', '1997-09-23', '0934567890', 'ชาย', 'นาย'),
('HN014', NULL, NULL, 'สมหญิง', 'ใจบุญ', '1966-06-11', '0945678901', 'หญิง', 'นาง'),
('HN015', NULL, NULL, 'สมชาย', 'ใจสู้', '1989-03-07', '0956789012', 'ชาย', 'นาย'),
('HN016', NULL, NULL, 'สมใจ', 'ใจเย็น', '1974-12-25', '0967890123', 'หญิง', 'นางสาว'),
('HN017', NULL, NULL, 'สมศักดิ์', 'ใจกว้าง', '1991-08-19', '0978901234', 'ชาย', 'นาย'),
('HN018', NULL, NULL, 'สมพร', 'ใจดี', '1986-05-04', '0989012345', 'หญิง', 'นาง'),
('HN019', NULL, NULL, 'สมหมาย', 'ใจมั่น', '1970-02-28', '0990123456', 'ชาย', 'นาย'),
('HN020', NULL, NULL, 'สมนึก', 'ใจสบาย', '1994-11-17', '0812345678', 'หญิง', 'นางสาว'),
('HN021', NULL, NULL, 'นก ', 'จก', '0000-00-00', '', 'หญิง', 'นางสาว'),
('HN023', NULL, NULL, 'q', 's', '0000-00-00', '', 'ชาย', ''),
('HN024', NULL, NULL, 'sad', 'a', '2024-07-07', 'sdd', '', 'นาย'),
('HN026', NULL, NULL, 'ๆๆๆๆๆๆ', 't', '2024-07-02', '1111111', 'ชาย', 'นาย'),
('HN027', NULL, NULL, 'a', 'a', '0000-00-00', 'x', '', ''),
('HN028', NULL, NULL, 't', 't', '2024-07-01', '', '', ''),
('HN029', NULL, NULL, 'h', 'h', '2024-07-05', '', 'หญิง', 'นาย'),
('HN035', NULL, NULL, 'ฟอฟ', 'กอฟ', '2024-07-12', '', 'หญิง', ''),
('HN036', NULL, NULL, 'สมหญิ', 'ใจดี', '1985-08-21', '0823456789', 'หญิง', 'นาง'),
('HN038', NULL, NULL, '', '', NULL, '', 'หญิง', ''),
('HN040', 'D003', 'A016', 'มา', 'นา', NULL, '', 'หญิง', ''),
('HN041', NULL, NULL, 'poda', 'โพ', NULL, '', '', ''),
('HN042', NULL, NULL, 'ฟ', '', NULL, '', '', ''),
('HN044', NULL, NULL, '', 'กกก', NULL, '', '', ''),
('HN045', NULL, NULL, 'ฟฟฟฟฟ', '', NULL, '', '', ''),
('HN046', NULL, NULL, 'หฟกหฟก', '', NULL, '', '', ''),
('HN048', NULL, NULL, '', 'หฟก', NULL, '', '', ''),
('HN049', NULL, NULL, 'กกกก', '', NULL, '', '', ''),
('HN050', NULL, NULL, '', 'กกกก', NULL, '', '', ''),
('HN051', NULL, NULL, 'หฟก', 'หฟก', NULL, '', '', ''),
('HN052', NULL, NULL, 'กกกก', '', NULL, '', '', ''),
('HN053', NULL, NULL, '', 'กกก', NULL, '', '', ''),
('HN054', NULL, NULL, 'ฟฟฟฟ', '', NULL, '', '', ''),
('HN055', NULL, NULL, 'ฟฟฟ', '', NULL, '', '', ''),
('HN056', NULL, NULL, '', 'ฟกหฟกฟหกห', NULL, '', '', ''),
('HN057', NULL, NULL, 'aaaaa', '', NULL, '', '', ''),
('HN058', NULL, NULL, 'vvvvvv', '', NULL, '', '', ''),
('HN059', NULL, NULL, 'bbbbbb', '', NULL, '', '', ''),
('HN060', NULL, NULL, 'ddddd', '', NULL, '', '', '');

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
  `Quantity` int(11) DEFAULT NULL,
  `Expiration_Date` date DEFAULT NULL
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
  `Total_Cost` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `treatment`
--

INSERT INTO `treatment` (`Treatment_ID`, `HN`, `Order_ID`, `Treatment_Date`, `Treatment_Details`, `Treatment_cost`, `Total_Cost`) VALUES
('T00001', 'HN029', 'O00001', '2024-08-01', 'test test', 5, 10.00);

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
(1, 1, 'Nurse', 'Nurse', '3ad6fa5666f73df65081222bc58b04d8'),
(2, 0, 'Doctor', 'Doctor', 'a9d1281097ec4cf24760b1c228cd96c7');

-- --------------------------------------------------------

--
-- Table structure for table `walkinqueue`
--

CREATE TABLE `walkinqueue` (
  `Queue_ID` int(11) NOT NULL,
  `HN` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `walkinqueue`
--

INSERT INTO `walkinqueue` (`Queue_ID`, `HN`) VALUES
(20, 'HN010'),
(34, 'HN015'),
(33, 'HN019'),
(30, 'HN026'),
(18, 'HN029'),
(31, 'HN035'),
(22, 'HN036'),
(19, 'HN040'),
(23, 'HN044'),
(25, 'HN045'),
(24, 'HN046'),
(27, 'HN048'),
(28, 'HN049'),
(35, 'HN050'),
(29, 'HN052'),
(21, 'HN059'),
(32, 'HN060');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allergy`
--
ALTER TABLE `allergy`
  ADD PRIMARY KEY (`Allergy_ID`);

--
-- Indexes for table `appointmentqueue`
--
ALTER TABLE `appointmentqueue`
  ADD PRIMARY KEY (`Queue_ID`),
  ADD KEY `HN` (`HN`);

--
-- Indexes for table `chronic_disease`
--
ALTER TABLE `chronic_disease`
  ADD PRIMARY KEY (`Disease_ID`);

--
-- Indexes for table `inovic`
--
ALTER TABLE `inovic`
  ADD PRIMARY KEY (`Inovic_ID`),
  ADD KEY `Stock_ID` (`Stock_ID`);

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
  ADD PRIMARY KEY (`HN`),
  ADD KEY `Disease_ID` (`Disease_ID`),
  ADD KEY `Allergy_ID` (`Allergy_ID`);

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
  ADD KEY `Medicine_ID` (`Medicine_ID`);

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
-- Constraints for dumped tables
--

--
-- Constraints for table `appointmentqueue`
--
ALTER TABLE `appointmentqueue`
  ADD CONSTRAINT `appointmentqueue_ibfk_1` FOREIGN KEY (`HN`) REFERENCES `patient` (`HN`);

--
-- Constraints for table `inovic`
--
ALTER TABLE `inovic`
  ADD CONSTRAINT `inovic_ibfk_1` FOREIGN KEY (`Stock_ID`) REFERENCES `stock` (`Stock_ID`);

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
-- Constraints for table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`Disease_ID`) REFERENCES `chronic_disease` (`Disease_ID`),
  ADD CONSTRAINT `patient_ibfk_2` FOREIGN KEY (`Allergy_ID`) REFERENCES `allergy` (`Allergy_ID`);

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
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
