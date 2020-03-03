--Bài tập 4:
USE [BT4_CSDL]
GO

--1. Tạo view KET QUA chứa kết quả thi của từng học sinh bao gồm các thông tin: SoBD,
--HoTen, Phai, Tuoi, Toan, Van, AnhVan, TongDiem, XepLoai, DTDuThi
--Biết rằng: TongDiem = Toan + Van + AnhVan + DiemUT
--XepLoai học sinh như sau:
--* Giỏi nếu TongDiem>=24 và tất cả các môn >=7
--* Khá nếu TongDiem>=21 và tất cả các môn >=6
--* Trung Bình nếu TongDiem>=15 và tất cả các môn >=4
--* Trượt nếu ngược lại 

CREATE VIEW KetQua AS
SELECT CONCAT(Ho, Ten) AS HoTen, Phai, (YEAR(GETDATE() - YEAR(NTNS))) AS Tuoi, Toan, Van, AnhVan, (Toan + Van + AnhVan + DiemUT) AS TongDiem, 
		(CASE
			WHEN (Toan + Van + AnhVan + DiemUT)  >= 24 AND Toan > 7 AND Van > 7 AND AnhVan > 7 THEN N'Giỏi'
			WHEN (Toan + Van + AnhVan + DiemUT)  >= 21 AND Toan > 6 AND Van > 6 AND AnhVan > 6 THEN N'Khá'
			WHEN (Toan + Van + AnhVan + DiemUT)  >= 15 AND Toan > 4 AND Van > 4 AND AnhVan > 4 THEN N'Trung Bình'
			ELSE N'Trượt'
		END) AS XepLoai, ChiTietDT.DTDuThi
FROM dbo.DanhSach INNER JOIN dbo.DiemThi ON DiemThi.SoBD = DanhSach.SoBD INNER JOIN dbo.ChiTietDT ON ChiTietDT.DTDuThi = DanhSach.DTDuThi
GO

--2. Tạo view GIOI TOAN – VAN – ANH VAN bao gồm các học sinh có ít nhất 1 môn 10 và
--có TongDiem>=25 bao gồm các thông tin: SoBD, HoTen, Toan, Van, AnhVan, TongDiem, DienGiaiDT 

CREATE VIEW GioiToanVanAnh AS 
SELECT DanhSach.SoBD, CONCAT(Ho, Ten) AS HoTen, Phai, (YEAR(GETDATE() - YEAR(NTNS))) AS Tuoi, Toan, Van, AnhVan, (Toan + Van + AnhVan + DiemUT) AS TongDiem, DienGiaiDT
FROM dbo.DanhSach INNER JOIN dbo.DiemThi ON DiemThi.SoBD = DanhSach.SoBD INNER JOIN dbo.ChiTietDT ON ChiTietDT.DTDuThi = DanhSach.DTDuThi
WHERE (TOAN = 10 OR Van = 10 OR AnhVan = 10) AND (Toan + Van + AnhVan + DiemUT) >= 25
GO

--3. Tạo view DANH SACH DAU (ĐẬU) gồm các học sinh có XepLoai là Giỏi, Khá hoặc
--Trung Bình với các field: SoBD, HoTen, Phai, Tuoi, Toan, Van, AnhVan, TongDiem, XepLoai, DTDuThi

CREATE VIEW DanhSachDau AS 
SELECT DanhSach.SoBD, CONCAT(Ho, Ten) AS HoTen, Phai, (YEAR(GETDATE() - YEAR(NTNS))) AS Tuoi, Toan, Van, AnhVan, (Toan + Van + AnhVan + DiemUT) AS TongDiem, 
		(CASE
			WHEN (Toan + Van + AnhVan + DiemUT)  >= 24 AND Toan > 7 AND Van > 7 AND AnhVan > 7 THEN N'Giỏi'
			WHEN (Toan + Van + AnhVan + DiemUT)  >= 21 AND Toan > 6 AND Van > 6 AND AnhVan > 6 THEN N'Khá'
			WHEN (Toan + Van + AnhVan + DiemUT)  >= 15 AND Toan > 4 AND Van > 4 AND AnhVan > 4 THEN N'Trung Bình'
			ELSE N'Trượt'
		END) AS XepLoai, ChiTietDT.DTDuThi
FROM dbo.DanhSach INNER JOIN dbo.DiemThi ON DiemThi.SoBD = DanhSach.SoBD INNER JOIN dbo.ChiTietDT ON ChiTietDT.DTDuThi = DanhSach.DTDuThi
WHERE  (Toan + Van + AnhVan + DiemUT)  >= 15 AND Toan > 4 AND Van > 4 AND AnhVan > 4
GO

--4. Tạo view HOC SINH DAT THU KHOA KY THI bao gồm các học sinh “ĐẬU” có
--TongDiem lớn nhất với các field: SoBD, HoTen, Phai, Tuoi, Toan, Van, AnhVan, TongDiem, DienGiaiDT

CREATE VIEW HocSinhDatThuKhoaKyThi AS 
SELECT DanhSach.SoBD, CONCAT(Ho, Ten) AS HoTen, Phai, (YEAR(GETDATE() - YEAR(NTNS))) AS Tuoi, Toan, Van, AnhVan, (Toan + Van + AnhVan + DiemUT) AS TongDiem, DienGiaiDT
FROM dbo.DanhSach INNER JOIN dbo.DiemThi ON DiemThi.SoBD = DanhSach.SoBD INNER JOIN dbo.ChiTietDT ON ChiTietDT.DTDuThi = DanhSach.DTDuThi
WHERE  (Toan + Van + AnhVan + DiemUT)  >= 15 AND Toan > 4 AND Van > 4 AND AnhVan > 4 
		AND (Toan + Van + AnhVan + DiemUT) = (SELECT Max(Toan + Van + AnhVan + DiemUT) 
				FROM dbo.DiemThi INNER JOIN dbo.DanhSach ON DanhSach.SoBD = DiemThi.SoBD INNER JOIN dbo.ChiTietDT ON ChiTietDT.DTDuThi = DanhSach.DTDuThi)
GO

--5. Tạo thủ tục có đầu vào là số báo danh, đầu ra là các điểm thi, điểm ưu tiên và tổng điểm
CREATE PROCEDURE sp_4_5 @sbd INT, @toan FLOAT OUTPUT, @van FLOAT OUTPUT, @anhvan FLOAT OUTPUT, @diemUT FLOAT OUTPUT, @tongDiem FLOAT OUTPUT AS
BEGIN
	SELECT Toan, Van, AnhVan, DiemUT, (Toan + Van + AnhVan + DiemUT) AS TongDiem
	FROM dbo.DanhSach INNER JOIN dbo.DiemThi ON DiemThi.SoBD = DanhSach.SoBD INNER JOIN dbo.ChiTietDT ON ChiTietDT.DTDuThi = DanhSach.DTDuThi
	WHERE DanhSach.SoBD = @sbd
END
GO

--DECLARE  @sbd INT, @toan FLOAT, @van FLOAT, @anhvan FLOAT, @diemUT FLOAT, @tongDiem FLOAT
--EXECUTE dbo.sp_4_5 1,
--    @toan OUTPUT,
--    @van OUTPUT,
--    @anhvan OUTPUT,
--    @diemUT OUTPUT,
--    @tongDiem OUTPUT

--6. Tạo trigger kiểm tra xem việc nhập mã đối tượng dự thi trong bảng danh sách có đúng với
--bảng đối tượng dự thi không
CREATE TRIGGER tg_nhap_ma_dt ON DanhSach FOR INSERT, UPDATE AS
BEGIN
	DECLARE @dtdthi TINYINT
	SELECT @dtdthi=DTDuThi FROM Inserted
	IF ((SELECT COUNT(*) FROM dbo.ChiTietDT WHERE DTDuThi = @dtdthi) = 0) 
		ROLLBACK
END
GO

--7. Thêm trường điểm ưu tiên và tổng điểm vào bảng Điểm thi. Tạo trigger cập nhật tự động
--trường ưu tiên và tổng điểm mỗi khi nhập hay chỉnh sửa

ALTER TABLE dbo.DiemThi ADD DiemUT FLOAT, TongDiem FLOAT
go
ALTER TRIGGER tg_cap_nhat_diem ON DiemThi FOR INSERT, UPDATE AS 
BEGIN
	DECLARE @sbd INT, @toan REAL, @van REAL, @anhvan REAL, @tongDiem FLOAT, @diemUT FLOAT
	SELECT @sbd=Inserted.SoBD, @anhvan=Inserted.AnhVan, @toan=Inserted.Toan, @van=Inserted.Van FROM inserted
	SELECT @diemUT=DiemUT FROM dbo.ChiTietDT INNER JOIN dbo.DanhSach ON DanhSach.DTDuThi = ChiTietDT.DTDuThi WHERE SoBD=@sbd
	SET @tongDiem=(@toan+@van+@anhvan)
	UPDATE dbo.DiemThi SET TongDiem=@tongDiem, DiemUT=@diemUT WHERE dbo.DiemThi.SoBD=@sbd
END
GO

--8. Tạo trigger xóa tự động bản ghi tương ứng ở bảng điểm khi xóa bản ghi ở danh sách
CREATE TRIGGER tg_xoa_tu_dong ON dbo.DanhSach FOR DELETE AS
BEGIN
	DECLARE @sbd INT
	SELECT @sbd=SoBD FROM Deleted
	DELETE FROM dbo.DiemThi WHERE SoBD=@sbd
END
GO

--Bài tập 5:
USE [BT5_CSDL]
GO

--1. Tạo thủ tục với giá trị nhập vào là mã học sinh, đầu ra là toàn bộ thông tin của học sinh
CREATE PROCEDURE sp_lay_thong_tin_hs @mahs NVARCHAR(5) AS
BEGIN
	SELECT * FROM dbo.DANHSACH WHERE MAHS=@mahs
END 
GO

EXECUTE dbo.sp_lay_thong_tin_hs '0001'
GO

--2. Tạo hàm với đầu vào là họ tên học sinh, đầu ra là toàn bộ thông tin của học sinh

CREATE PROCEDURE sp_lay_thong_tin_hs2 @tenhs NVARCHAR(7) AS
BEGIN
	SELECT * FROM dbo.DANHSACH WHERE TEN=@tenhs
END 
GO

EXECUTE dbo.sp_lay_thong_tin_hs2 'Minh'
GO

--3. Tạo trigger tự động cập nhật mã và tên học sinh,giới tính, tên trường của học sinh vào bảng
--điểm học sinh khi nhập thông tin vào DanhSach (giới tính là nam nếu Phái là False, là nữ nếu Phái là True)
ALTER TABLE dbo.DANHSACH ALTER COLUMN MAHS NVARCHAR(5) NOT NULL
ALTER TABLE dbo.DIEM ALTER COLUMN MAHS NVARCHAR(5) NOT NULL
ALTER TABLE dbo.DIEM ALTER COLUMN MON NVARCHAR(10) NOT NULL
ALTER TABLE dbo.DANHSACH ADD CONSTRAINT FK_DanhSach PRIMARY KEY(MAHS)
ALTER TABLE dbo.DIEM ADD CONSTRAINT FK_Diem PRIMARY KEY(MAHS,MON)
GO

CREATE TRIGGER tg_cap_nhat_bang_diem ON dbo.DANHSACH FOR INSERT, UPDATE AS  
BEGIN
	DECLARE @mahs NVARCHAR(5), @hoten NVARCHAR(255), @truong NVARCHAR(150), @gioitinh NVARCHAR(255)
	SELECT @mahs=Inserted.MAHS, @hoten=CONCAT(Inserted.HO, Inserted.TEN), @truong=TENTRUONG, @gioitinh = IIF(Inserted.PHAI = 0,N'nữ', N'nam') 
	FROM Inserted INNER JOIN dbo.TRUONG ON TRUONG.MATRUONG = Inserted.MATRUONG
	IF NOT EXISTS (SELECT * FROM dbo.BangDiemHS WHERE MAHS=@mahs)
		INSERT INTO dbo.BangDiemHS ( MAHS, Hoten, GioiTinh, TenTruong) VALUES(@mahs, @hoten, @gioitinh, @truong)
	ELSE 
		UPDATE dbo.BangDiemHS SET MAHS=@mahs, Hoten=@hoten, GioiTinh=@gioitinh, TenTruong=@truong
END
GO

--4. Tạo trigger cập nhật điểm toán, văn vào bảng điểm học sinh mỗi khi thêm mới hay cập nhật bảng điểm
CREATE TRIGGER tg_cap_nhat_bang_diem2 ON dbo.DIEM FOR INSERT, UPDATE AS  
BEGIN
	DECLARE @mahs NVARCHAR(5), @mon NVARCHAR(5), @diem FLOAT
	SELECT @mahs=MAHS, @mon=MON, @diem=DIEM FROM Inserted
	IF @mon = 'Toan' 
		IF NOT EXISTS (SELECT * FROM dbo.BangDiemHS WHERE MAHS=@mahs)
			INSERT INTO dbo.BangDiemHS ( MAHS, Toan) VALUES(@mahs, @diem)
		ELSE 
			UPDATE dbo.BangDiemHS SET Toan=@diem WHERE MAHS=@mahs
	ELSE 
		IF NOT EXISTS (SELECT * FROM dbo.BangDiemHS WHERE MAHS=@mahs)
			INSERT INTO dbo.BangDiemHS ( MAHS, Van) VALUES(@mahs, @diem)
		ELSE 
			UPDATE dbo.BangDiemHS SET Van=@diem WHERE MAHS=@mahs
END
GO

--5. Tạo hàm với đầu vào là mã trường đầu ra là danh sách điểm của học sinh trường đó
ALTER PROCEDURE sp_lay_diem_theo_truong @matruong NVARCHAR(4) AS
BEGIN
	SELECT DANHSACH.MAHS, MON, DIEM FROM dbo.DIEM INNER JOIN dbo.DANHSACH ON DANHSACH.MAHS = DIEM.MAHS WHERE MATRUONG=@matruong
END 
GO

EXECUTE sp_lay_diem_theo_truong 'NTMK'

--Bài tập 6:
USE [BT6_CSDL]
GO

--1. Thêm trường Giá bán vào chi tiết hóa đơn, sau đó tạo trigger tự động cập nhật trường này
--từ Đơn giá bán của bảng tSach

ALTER TABLE dbo.tChiTietHDB ADD GiaBan NVARCHAR(20) NULL
ALTER TABLE dbo.tChiTietHDB ADD CONSTRAINT FK_ChiTietHDB PRIMARY KEY(SoHDB, MaSach)
GO
CREATE TRIGGER tg_cap_nhat_gia_ban ON dbo.tChiTietHDB FOR INSERT, UPDATE AS
BEGIN
	DECLARE @sohdb NVARCHAR(100), @masach NVARCHAR(100), @giaban NVARCHAR(20)
	SELECT @sohdb=Inserted.SoHDB, @masach=Inserted.MaSach, @giaban=DonGiaBan FROM Inserted INNER JOIN dbo.tSach ON tSach.MaSach = Inserted.MaSach
	UPDATE dbo.tChiTietHDB SET GiaBan=@giaban WHERE SoHDB=@sohdb
END 
GO

--2. Thêm trường Thành tiền cho bảng Chi tiết hóa đơn bán và tạo trigger cập nhật tự động cho
--những trường này
ALTER TABLE dbo.tChiTietHDB ADD ThanhTien int NULL
GO
CREATE TRIGGER tg_cap_nhat_thanh_tien ON dbo.tChiTietHDB FOR INSERT, UPDATE AS
BEGIN
	DECLARE @sohdb NVARCHAR(100), @masach NVARCHAR(100), @giaban NVARCHAR(20), @soluong INT, @thanhtien int
	SELECT @sohdb=Inserted.SoHDB, @masach=Inserted.MaSach, @giaban=DonGiaBan FROM Inserted INNER JOIN dbo.tSach ON tSach.MaSach = Inserted.MaSach
	SET @thanhtien = @giaban*@soluong
	UPDATE dbo.tChiTietHDB SET GiaBan=@giaban, ThanhTien=@thanhtien WHERE SoHDB=@sohdb
END 
GO

--3. Tạo trigger khi xóa hóa đơn thì toàn bộ chi tiết hóa đơn xóa theo
CREATE TRIGGER tg_xoa_chi_tiet_hoa_don ON dbo.tHoaDonBan FOR DELETE AS
BEGIN
	DECLARE @sohdb NVARCHAR(100) 
	SELECT @sohdb=SoHDB FROM Deleted
	DELETE FROM dbo.tChiTietHDB WHERE SoHDB=@sohdb
END 
GO

--4. Tạo thủ tục đưa ra số tiền của khách hàng đã mua trong năm 2014 khi nhập mã kháchCREATE PROCEDURE sp_lay_tien_theo_ma_khach @makhach NVARCHAR(20) ASBEGIN	SELECT SUM(ThanhTien) FROM dbo.tHoaDonBan INNER JOIN dbo.tChiTietHDB ON tChiTietHDB.SoHDB = tHoaDonBan.SoHDB	WHERE MaKH=@makhach AND YEAR(NgayBan) = 2014 ENDGOEXECUTE dbo.sp_lay_tien_theo_ma_khach 'KH01'
GO

--5. Tạo view cho biết mã khách hàng, tên khách hàng, số điện thoại mức tiền khách hàng mua trong năm 2013

CREATE VIEW KhachHangMua2013 AS
SELECT tHoaDonBan.MaKH, TenKH, DienThoai
FROM dbo.tHoaDonBan INNER JOIN dbo.tKhachHang ON tHoaDonBan.MaKH = tKhachHang.MaKH
WHERE YEAR(NgayBan) = 2013 
GO

--6. Tạo thủ tục đầu vào là tháng, đầu ra là doanh thu theo tháng đó

CREATE PROCEDURE sp_doanh_thu_theo_thang @thang INT AS
BEGIN
	SELECT SUM(ThanhTien) 
	FROM dbo.tHoaDonBan INNER JOIN dbo.tChiTietHDB ON tChiTietHDB.SoHDB = tHoaDonBan.SoHDB
	WHERE MONTH(NgayBan) = @thang
END
GO

--7. Tạo thủ tục nhập dữ liệu hóa đơn và chi tiết hóa đơn (giả sử chi tiết hóa đơn với 3 bản ghi)
--cùng lúc, đảm bảo rằng hoặc nhập toàn bộ hoặc không nhập gì cả (transaction)
CREATE PROCEDURE sp_nhap_chi_tiet_hd AS
BEGIN
	BEGIN TRAN
		BEGIN TRY 
			INSERT INTO dbo.tChiTietHDB ( SoHDB, MaSach, SLBan, KhuyenMai ) VALUES  ()
			INSERT INTO dbo.tChiTietHDB ( SoHDB, MaSach, SLBan, KhuyenMai ) VALUES  ()
			INSERT INTO dbo.tChiTietHDB ( SoHDB, MaSach, SLBan, KhuyenMai ) VALUES  ()
			--.....
			COMMIT TRAN
		END TRY
        BEGIN CATCH
			ROLLBACK TRAN
		END CATCH
END 
GO

--8. Tạo View thống kê trong năm 2014 mỗi một mặt hàng trong mỗi tháng và trong cả năm
--bán được với số lượng bao nhiêu (Yêu cầu kết quả hiểu thị dưới dạng bảng, hai cột đầu là mã
--hàng, tên hàng, các cột còn lại tương ứng từ tháng 1 đến tháng 12 và cả năm. Như vậy mỗi
--dòng trong kết quả cho biết số lượng hàng bán được mỗi tháng và trong cả năm của mỗi mặt
--hàng.

--.....

--9. Tạo bảng gồm các trường: mã hàng, tên hàng, số lượng nhập, số lượng bán, tháng, năm
--Cập nhật tự động thông tin cho bảng này
CREATE TABLE tXXX(
	maHang NVARCHAR(20) NOT NULL,
	tenHang NVARCHAR(100) NULL,
	slNhap INT NULL,
	slBan INT NULL,
	thang INT NULL,
	nam INT NULL
)
--.....
GO

