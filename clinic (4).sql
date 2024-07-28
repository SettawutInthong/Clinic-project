-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 28, 2024 at 04:10 AM
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
  `Medicine_ID` varchar(10) DEFAULT NULL,
  `Allergy_Details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

--
-- Dumping data for table `allergy`
--

INSERT INTO `allergy` (`Allergy_ID`, `Medicine_ID`, `Allergy_Details`) VALUES
('A001', 'm001', 'ผื่นขึ้น, คัน'),
('A002', 'm002', 'หายใจลำบาก'),
('A003', 'm003', 'คลื่นไส้, อาเจียน'),
('A004', 'm004', 'หน้าบวม'),
('A005', 'm005', 'น้ำมูกไหล, จาม'),
('A006', 'm006', 'ปวดท้อง'),
('A007', 'm007', 'วิงเวียนศีรษะ'),
('A008', 'm008', 'ความดันโลหิตต่ำ'),
('A009', 'm009', 'ตาแดง, คันตา'),
('A010', 'm010', 'ผื่นลมพิษ'),
('A011', 'm011', 'หายใจมีเสียงหวีด'),
('A012', 'm012', 'ปากบวม'),
('A013', 'm013', 'ช็อค'),
('A014', 'm014', 'ท้องเสีย'),
('A015', 'm015', 'ปวดหัว'),
('A016', 'm016', 'เจ็บหน้าอก'),
('A017', 'm017', 'เป็นลม'),
('A018', 'm018', 'คอแห้ง'),
('A019', 'm019', 'ลิ้นชา'),
('A020', 'm020', 'ไอ');

-- --------------------------------------------------------

--
-- Table structure for table `appointmentqueue`
--

CREATE TABLE `appointmentqueue` (
  `Queue_ID` varchar(10) NOT NULL,
  `HN` varchar(10) DEFAULT NULL,
  `Queue_Date` date DEFAULT NULL,
  `Queue_Time` time DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `Doctor_ID` varchar(10) NOT NULL,
  `First_Name` varchar(50) DEFAULT NULL,
  `Last_Name` varchar(50) DEFAULT NULL,
  `Specialization` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `inovic`
--

CREATE TABLE `inovic` (
  `Inovic_ID` int(11) NOT NULL,
  `Stock_ID` varchar(10) NOT NULL,
  `Inovic_Date` date NOT NULL,
  `Quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `medicine`
--

CREATE TABLE `medicine` (
  `Medicine_ID` varchar(10) NOT NULL,
  `Medicine_Name` varchar(100) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Med_Cost` decimal(10,2) DEFAULT NULL,
  `Quantity_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

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
-- Table structure for table `order_medicine`
--

CREATE TABLE `order_medicine` (
  `Order_ID` varchar(10) NOT NULL,
  `HN` varchar(10) DEFAULT NULL,
  `Medicine_ID` varchar(10) DEFAULT NULL,
  `Quantity_Order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

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
  `Chronic_Disease` text DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Title` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`HN`, `First_Name`, `Last_Name`, `Birthdate`, `Phone`, `Chronic_Disease`, `Gender`, `Title`) VALUES
('HN001', 'สมชาย', 'สุขใจ', '1980-05-12', '0812345678', 'เบาหวาน', 'ชาย', 'นาย'),
('HN002', 'สมหญิง', 'ใจดี', '1985-08-22', '0823456789', 'ความดันโลหิตสูง', 'หญิง', 'นาง'),
('HN003', 'สมศักดิ์', 'ใจสู้', '1975-03-18', '0834567890', NULL, 'ชาย', 'นาย'),
('HN004', 'สมพร', 'ใจบุญ', '1990-11-05', '0845678901', 'โรคหัวใจ', 'หญิง', 'นางสาว'),
('HN005', 'สมหมาย', 'ใจถึง', '1968-07-29', '0856789012', 'โรคไต', 'ชาย', 'นาย'),
('HN006', 'สมใจ', 'ใจเย็น', '1995-02-14', '0867890123', NULL, 'หญิง', 'นางสาว'),
('HN007', 'สมบูรณ์', 'ใจกว้าง', '1972-09-03', '0878901234', 'โรคหอบหืด', 'ชาย', 'นาย'),
('HN008', 'สมปอง', 'ใจดี', '1988-04-20', '0889012345', 'ภูมิแพ้', 'หญิง', 'นาง'),
('HN009', 'สมหวัง', 'ใจมั่น', '1965-12-31', '0890123456', 'โรคเกาต์', 'ชาย', 'นาย'),
('HN010', 'สมนึก', 'ใจสบาย', '1992-06-26', '0901234567', NULL, 'หญิง', 'นางสาว'),
('HN011', 'สมคิด', 'ใจเด็ด', '1978-10-15', '0912345678', 'โรคกระเพาะ', 'ชาย', 'นาย'),
('HN012', 'สมทรง', 'ใจงาม', '1983-01-08', '0923456789', 'โรคตับ', 'หญิง', 'นาง'),
('HN013', 'สมาน', 'ใจดี', '1997-09-23', '0934567890', NULL, 'ชาย', 'นาย'),
('HN014', 'สมหญิง', 'ใจบุญ', '1966-06-11', '0945678901', 'โรคข้ออักเสบ', 'หญิง', 'นาง'),
('HN015', 'สมชาย', 'ใจสู้', '1989-03-07', '0956789012', 'โรคผิวหนัง', 'ชาย', 'นาย'),
('HN016', 'สมใจ', 'ใจเย็น', '1974-12-25', '0967890123', NULL, 'หญิง', 'นางสาว'),
('HN017', 'สมศักดิ์', 'ใจกว้าง', '1991-08-19', '0978901234', 'โรคภูมิแพ้ตัวเอง', 'ชาย', 'นาย'),
('HN018', 'สมพร', 'ใจดี', '1986-05-04', '0989012345', 'โรคต่อมไทรอยด์', 'หญิง', 'นาง'),
('HN019', 'สมหมาย', 'ใจมั่น', '1970-02-28', '0990123456', 'โรคซึมเศร้า', 'ชาย', 'นาย'),
('HN020', 'สมนึก', 'ใจสบาย', '1994-11-17', '0812345678', NULL, 'หญิง', 'นางสาว');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `Role_ID` int(11) NOT NULL,
  `Role_Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `treatment`
--

CREATE TABLE `treatment` (
  `Treatment_ID` varchar(10) NOT NULL,
  `HN` varchar(10) DEFAULT NULL,
  `Doctor_ID` varchar(10) DEFAULT NULL,
  `Treatment_Date` date DEFAULT NULL,
  `Diagnosis` text DEFAULT NULL,
  `Treatment_Details` text DEFAULT NULL,
  `Order_ID` varchar(10) DEFAULT NULL,
  `Transaction_Date` date DEFAULT NULL,
  `Total_Cost` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role_ID` int(11) NOT NULL,
  `accessToken` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_ID`, `Username`, `Password`, `Role_ID`, `accessToken`) VALUES
(1, 'Nurse', 'Nurse', 1, NULL),
(2, 'Doctor', 'Doctor', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `walkinqueue`
--

CREATE TABLE `walkinqueue` (
  `Queue_ID` int(11) NOT NULL,
  `HN` varchar(10) NOT NULL,
  `Queue_Number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allergy`
--
ALTER TABLE `allergy`
  ADD PRIMARY KEY (`Allergy_ID`),
  ADD KEY `Medicine_ID` (`Medicine_ID`);

--
-- Indexes for table `appointmentqueue`
--
ALTER TABLE `appointmentqueue`
  ADD PRIMARY KEY (`Queue_ID`),
  ADD KEY `HN` (`HN`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`Doctor_ID`);

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
-- Indexes for table `order_medicine`
--
ALTER TABLE `order_medicine`
  ADD PRIMARY KEY (`Order_ID`),
  ADD KEY `HN` (`HN`),
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
  ADD KEY `Medicine_ID` (`Medicine_ID`);

--
-- Indexes for table `treatment`
--
ALTER TABLE `treatment`
  ADD PRIMARY KEY (`Treatment_ID`),
  ADD UNIQUE KEY `Order_ID` (`Order_ID`),
  ADD KEY `HN` (`HN`),
  ADD KEY `Doctor_ID` (`Doctor_ID`);

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
-- Constraints for table `allergy`
--
ALTER TABLE `allergy`
  ADD CONSTRAINT `allergy_ibfk_1` FOREIGN KEY (`Medicine_ID`) REFERENCES `medicine` (`Medicine_ID`);

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
-- Constraints for table `order_medicine`
--
ALTER TABLE `order_medicine`
  ADD CONSTRAINT `order_medicine_ibfk_1` FOREIGN KEY (`HN`) REFERENCES `patient` (`HN`),
  ADD CONSTRAINT `order_medicine_ibfk_2` FOREIGN KEY (`Medicine_ID`) REFERENCES `medicine` (`Medicine_ID`);

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`Medicine_ID`) REFERENCES `medicine` (`Medicine_ID`);

--
-- Constraints for table `treatment`
--
ALTER TABLE `treatment`
  ADD CONSTRAINT `treatment_ibfk_1` FOREIGN KEY (`Order_ID`) REFERENCES `order_medicine` (`Order_ID`),
  ADD CONSTRAINT `treatment_ibfk_2` FOREIGN KEY (`HN`) REFERENCES `patient` (`HN`),
  ADD CONSTRAINT `treatment_ibfk_3` FOREIGN KEY (`Doctor_ID`) REFERENCES `doctor` (`Doctor_ID`);

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
