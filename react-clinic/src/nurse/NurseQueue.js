import React from "react";

const NurseQueue = () => {
  return (<div></div>
    // <Box sx={{ flexGrow: 1 }}>
    //   <ContainerStyled maxWidth="lg">
    //     <PaperStyled>
    //       <Box
    //         display="flex"
    //         alignItems="center"
    //         justifyContent="space-between"
    //         mb={2}
    //       >
    //         <Typography
    //           variant="h6"
    //           gutterBottom
    //           style={{ flexGrow: 1, textAlign: "center" }}
    //         >
    //           รายชื่อผู้ป่วย
    //         </Typography>
    //       </Box>
    //       <div>
    //         <Box display="flex" justifyContent="space-between" mb={2}>
    //           <form
    //             onSubmit={SearchSubmit}
    //             style={{
    //               display: "flex",
    //               flexWrap: "wrap",
    //               gap: "20px",
    //               alignItems: "center",
    //               marginBottom: "20px",
    //             }}
    //           >
    //             <TextField
    //               label="กรอก HN"
    //               variant="outlined"
    //               size="small"
    //               onChange={SearchHNChange}
    //               inputProps={{ maxLength: 5 }}
    //               style={{ width: "100px" }}
    //             />
    //             <FormControl
    //               variant="outlined"
    //               size="small"
    //               style={{ width: "140px" }}
    //             >
    //               <InputLabel>เลือกคำนำหน้า</InputLabel>
    //               <Select
    //                 value={searchTitle}
    //                 onChange={SearchTitleChange}
    //                 label="เลือกคำนำหน้า"
    //               >
    //                 <MenuItem value="ด.ช.">ด.ช.</MenuItem>
    //                 <MenuItem value="ด.ญ.">ด.ญ.</MenuItem>
    //                 <MenuItem value="นาย">นาย</MenuItem>
    //                 <MenuItem value="นาง">นาง</MenuItem>
    //                 <MenuItem value="นางสาว">นางสาว</MenuItem>
    //               </Select>
    //             </FormControl>
    //             <TextField
    //               label="กรอกชื่อ"
    //               variant="outlined"
    //               size="small"
    //               onChange={SearchFirstNameChange}
    //             />
    //             <TextField
    //               label="กรอกนามสกุล"
    //               variant="outlined"
    //               size="small"
    //               onChange={SearchLastNameChange}
    //             />
    //             <FormControl
    //               variant="outlined"
    //               size="small"
    //               style={{ width: "110px" }}
    //             >
    //               <InputLabel>เลือกเพศ</InputLabel>
    //               <Select
    //                 value={searchGender}
    //                 onChange={SearchGenderChange}
    //                 variant="outlined"
    //                 size="small"
    //                 label="เลือกเพศ"
    //               >
    //                 <MenuItem value="ชาย">ชาย</MenuItem>
    //                 <MenuItem value="หญิง">หญิง</MenuItem>
    //               </Select>
    //             </FormControl>
    //             <Button
    //               variant="contained"
    //               type="submit"
    //               style={{ height: "40px" }}
    //               color="info"
    //             >
    //               ค้นหา
    //             </Button>
    //           </form>
    //           <Button
    //             variant="contained"
    //             style={{ height: "40px", width: "150px" }}
    //             color="success"
    //             onClick={() => setAddPopup(true)}
    //           >
    //             <h1>+</h1>
    //           </Button>
    //         </Box>

    //         {showTable && (
    //           <TableContainer component={Paper}>
    //             <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //               <TableHead>
    //                 <TableRow>
    //                   <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                     HN
    //                   </TableCell>
    //                   <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                     คำนำหน้า
    //                   </TableCell>
    //                   <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                     ชื่อ
    //                   </TableCell>
    //                   <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                     นามสกุล
    //                   </TableCell>
    //                   <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                     เพศ
    //                   </TableCell>
    //                   <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                     Actions
    //                   </TableCell>
    //                 </TableRow>
    //               </TableHead>
    //               <TableBody>
    //                 {data.map((row) => (
    //                   <TableRow
    //                     key={row.HN}
    //                     sx={{
    //                       "&:last-child td, &:last-child th": { border: 0 },
    //                     }}
    //                   >
    //                     <TableCell component="th" scope="row">
    //                       {row.HN}
    //                     </TableCell>
    //                     <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                       {row.Title}
    //                     </TableCell>
    //                     <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                       {row.First_Name}
    //                     </TableCell>
    //                     <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                       {row.Last_Name}
    //                     </TableCell>
    //                     <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                       {row.Gender}
    //                     </TableCell>
    //                     <TableCell style={{ flexGrow: 1, textAlign: "center" }}>
    //                       <ButtonGroup
    //                         color="primary"
    //                         aria-label="outlined primary button group"
    //                       >
    //                         <Button onClick={() => PatientView(row.HN)}>
    //                           ดู
    //                         </Button>
    //                         <Button onClick={() => PatientDelete(row.HN)}>
    //                           ลบ
    //                         </Button>
    //                       </ButtonGroup>
    //                     </TableCell>
    //                   </TableRow>
    //                 ))}
    //               </TableBody>
    //             </Table>
    //           </TableContainer>
    //         )}

    //         <Dialog
    //           open={AddPopup}
    //           onClose={() => {
    //             setAddPopup(false);
    //             resetForm();
    //           }}
    //           aria-labelledby="form-dialog-title"
    //         >
    //           <DialogTitle
    //             id="form-dialog-title"
    //             style={{ flexGrow: 1, textAlign: "center" }}
    //           >
    //             เพิ่มผู้ป่วยใหม่
    //           </DialogTitle>
    //           <DialogContent>
    //             <FormControl
    //               fullWidth
    //               margin="dense"
    //               variant="outlined"
    //               size="small"
    //               style={{ width: "140px" }}
    //             >
    //               <InputLabel>เลือกคำนำหน้า</InputLabel>
    //               <Select
    //                 label="เลือกคำนำหน้า"
    //                 value={newTitle}
    //                 onChange={(e) => setNewTitle(e.target.value)}
    //               >
    //                 <MenuItem value="ด.ช.">ด.ช.</MenuItem>
    //                 <MenuItem value="ด.ญ.">ด.ญ.</MenuItem>
    //                 <MenuItem value="นาย">นาย</MenuItem>
    //                 <MenuItem value="นาง">นาง</MenuItem>
    //                 <MenuItem value="นางสาว">นางสาว</MenuItem>
    //               </Select>
    //             </FormControl>
    //             <TextField
    //               autoFocus
    //               margin="dense"
    //               label="กรอกชื่อ"
    //               type="text"
    //               fullWidth
    //               value={newFirstName}
    //               onChange={(e) => setNewFirstName(e.target.value)}
    //             />
    //             <TextField
    //               margin="dense"
    //               label="กรอกนามสกุล"
    //               type="text"
    //               fullWidth
    //               value={newLastName}
    //               onChange={(e) => setNewLastName(e.target.value)}
    //             />
    //             <LocalizationProvider dateAdapter={AdapterDateFns}>
    //               <DatePicker
    //                 label="เลือกวันเกิด"
    //                 value={newBirthdate}
    //                 onChange={(date) => setNewBirthdate(date)}
    //                 inputFormat="dd/MM/yyyy"
    //                 slotProps={{
    //                   textField: { fullWidth: true, margin: "dense" },
    //                 }}
    //               />
    //             </LocalizationProvider>
    //             <FormControl
    //               fullWidth
    //               margin="dense"
    //               variant="outlined"
    //               size="small"
    //               style={{ width: "110px" }}
    //             >
    //               <InputLabel>เลือกเพศ</InputLabel>
    //               <Select
    //                 value={newGender}
    //                 onChange={(e) => setNewGender(e.target.value)}
    //                 label="เลือกเพศ"
    //               >
    //                 <MenuItem value="ชาย">ชาย</MenuItem>
    //                 <MenuItem value="หญิง">หญิง</MenuItem>
    //               </Select>
    //             </FormControl>
    //             <TextField
    //               margin="dense"
    //               label="กรอกหมายเลขโทรศัพท์"
    //               type="text"
    //               fullWidth
    //               value={newPhone}
    //               onChange={(e) => setNewPhone(e.target.value)}
    //             />
    //             <TextField
    //               margin="dense"
    //               label="กรอกโรคประจำตัว"
    //               type="text"
    //               fullWidth
    //               value={newDisease}
    //               onChange={(e) => setNewDisease(e.target.value)}
    //             />
    //             <TextField
    //               margin="dense"
    //               label="กรอกยาที่แพ้"
    //               type="text"
    //               fullWidth
    //               value={newAllergy}
    //               onChange={(e) => setNewAllergy(e.target.value)}
    //             />
    //           </DialogContent>
    //           <DialogActions>
    //             <Button
    //               onClick={() => {
    //                 setAddPopup(false);
    //                 resetForm();
    //               }}
    //               color="primary"
    //             >
    //               ยกเลิก
    //             </Button>
    //             <Button
    //               onClick={() => {
    //                 AddPatient();
    //                 resetForm();
    //               }}
    //               color="primary"
    //             >
    //               บันทึก
    //             </Button>
    //           </DialogActions>
    //         </Dialog>
    //         <Dialog
    //           open={viewPopup}
    //           onClose={() => setViewPopup(false)}
    //           aria-labelledby="view-dialog-title"
    //         >
    //           <DialogTitle
    //             id="view-dialog-title"
    //             style={{ flexGrow: 1, textAlign: "center" }}
    //           >
    //             ดูข้อมูลผู้ป่วย
    //           </DialogTitle>
    //           <DialogContent>
    //             <FormControl
    //               fullWidth
    //               margin="dense"
    //               variant="outlined"
    //               size="small"
    //               style={{ width: "140px" }}
    //             >
    //               <InputLabel>คำนำหน้า</InputLabel>
    //               <Select
    //                 label="คำนำหน้า"
    //                 value={newTitle}
    //                 inputProps={{ readOnly: true }}
    //               >
    //                 <MenuItem value="ด.ช.">ด.ช.</MenuItem>
    //                 <MenuItem value="ด.ญ.">ด.ญ.</MenuItem>
    //                 <MenuItem value="นาย">นาย</MenuItem>
    //                 <MenuItem value="นาง">นาง</MenuItem>
    //                 <MenuItem value="นางสาว">นางสาว</MenuItem>
    //               </Select>
    //             </FormControl>
    //             <TextField
    //               margin="dense"
    //               label="ชื่อ"
    //               type="text"
    //               fullWidth
    //               value={newFirstName}
    //               inputProps={{ readOnly: true }}
    //             />
    //             <TextField
    //               margin="dense"
    //               label="นามสกุล"
    //               type="text"
    //               fullWidth
    //               value={newLastName}
    //               inputProps={{ readOnly: true }}
    //             />
    //             <LocalizationProvider dateAdapter={AdapterDateFns}>
    //               <DatePicker
    //                 label="วันเกิด"
    //                 value={newBirthdate}
    //                 inputFormat="dd/MM/yyyy"
    //                 readOnly
    //                 slotProps={{
    //                   textField: {
    //                     fullWidth: true,
    //                     margin: "dense",
    //                     InputProps: { readOnly: true },
    //                   },
    //                 }}
    //               />
    //             </LocalizationProvider>
    //             <FormControl
    //               fullWidth
    //               margin="dense"
    //               variant="outlined"
    //               size="small"
    //               style={{ width: "110px" }}
    //             >
    //               <InputLabel>เพศ</InputLabel>
    //               <Select value={newGender} inputProps={{ readOnly: true }}>
    //                 <MenuItem value="ชาย">ชาย</MenuItem>
    //                 <MenuItem value="หญิง">หญิง</MenuItem>
    //               </Select>
    //             </FormControl>
    //             <TextField
    //               margin="dense"
    //               label="หมายเลขโทรศัพท์"
    //               type="text"
    //               fullWidth
    //               value={newPhone}
    //               inputProps={{ readOnly: true }}
    //             />
    //             <TextField
    //               margin="dense"
    //               label="โรคประจำตัว"
    //               type="text"
    //               fullWidth
    //               value={newDisease}
    //               inputProps={{ readOnly: true }}
    //             />
    //             <TextField
    //               margin="dense"
    //               label="ยาที่แพ้"
    //               type="text"
    //               fullWidth
    //               value={newAllergy}
    //               inputProps={{ readOnly: true }}
    //             />
    //           </DialogContent>
    //           <DialogActions>
    //             <Button onClick={() => setViewPopup(false)} color="primary">
    //               ปิด
    //             </Button>
    //           </DialogActions>
    //         </Dialog>

    //         {message && <p>{message}</p>}
    //       </div>
    //     </PaperStyled>
    //   </ContainerStyled>
    // </Box>
  );
};

export default NurseQueue;
