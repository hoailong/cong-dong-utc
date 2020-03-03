-----------------------------------------------------------------------------------------
--------- DATABASE bai tap lon mon C# - Phan Van Hoai - 171203470 - CNTT1K58-------------
-----------------------------------------------------------------------------------------

CREATE DATABASE BookStore
GO

USE BookStore
GO

CREATE TABLE account(
	AccountId INT IDENTITY(1000,1) NOT NULL,
	Username NVARCHAR(30) NOT NULL,
	Password NVARCHAR(50) DEFAULT N'12345',
	Phone NVARCHAR(15) NULL,
	Role VARCHAR(15) NULL,
	Status BIT NULL,
	EmployeeId INT NULL

	CONSTRAINT PK_Account PRIMARY KEY(AccountId)
)
GO 


--CREATE TABLE role(
--	RoleId INT IDENTITY(1, 1) NOT NULL,
--	RoleName NVARCHAR(20) NULL,

--	CONSTRAINT PK_role PRIMARY KEY(RoleId)
--)
--GO 

CREATE TABLE employee(
	EmployeeId INT IDENTITY(1000,1) NOT NULL,
	Fullname NVARCHAR(100) DEFAULT N'Nhân viên',
	Birth VARCHAR(15) NULL,
	Gender BIT NULL,
	Address NVARCHAR(300) NULL,
	Phone VARCHAR(20) NULL,
	Salary FLOAT NULL,
	Status BIT NULL,
	ShiftID INT NULL

	CONSTRAINT PK_Employee PRIMARY KEY(EmployeeId)
)
GO 

CREATE TABLE customer(
	CustomerId INT IDENTITY(1000, 1) NOT NULL,
	CustomerName NVARCHAR(100) DEFAULT N'Khách hàng',
	CustomerPhone NVARCHAR(15) UNIQUE NULL,
	Birth VARCHAR(15) NULL,
	Gender BIT NULL,
	Address NVARCHAR(300) NULL,

	CONSTRAINT PK_Customer PRIMARY KEY(CustomerId)
)
GO 

CREATE TABLE book(
	BookId INT IDENTITY(1000, 1) NOT NULL,
	BookName NVARCHAR(100) NULL,
	Page INT NULL,
	Price FLOAT NULL,
	RentPrice FLOAT NULL,
	Quantity INT NULL,
	Total INT NULL,
	Image NVARCHAR(1000) NULL,
	AuthorId INT NULL,
	TypeId INT NULL,
	CategoryId INT NULL,
	PublisherId INT NULL,
	LangId INT NULL,

	CONSTRAINT PK_Book PRIMARY KEY(BookId)
)
GO 

CREATE TABLE category(
	CategoryId INT IDENTITY(1000, 1) NOT NULL,
	CategoryName NVARCHAR(100) NULL,
	CategoryCode NVARCHAR(100) NULL

	CONSTRAINT PK_Category PRIMARY KEY(CategoryId)
)
GO 

CREATE TABLE author(
	AuthorId INT IDENTITY(1000, 1) NOT NULL,
	AuthorName NVARCHAR(100) NULL,
	Birth VARCHAR(15) NULL,
	Gender BIT NULL,
	Address NVARCHAR(300) NULL

	CONSTRAINT PK_Author PRIMARY KEY(AuthorId)
)
GO 

CREATE TABLE publisher(
	PublisherId INT IDENTITY(1000, 1) NOT NULL,
	PublisherName NVARCHAR(100) NULL,
	Address NVARCHAR(300) NULL,
	Phone NVARCHAR(20) NULL
	
	CONSTRAINT PK_Publisher PRIMARY KEY(PublisherId)
)
GO

CREATE TABLE language(
	LangId INT IDENTITY(1000, 1) NOT NULL,
	LangName NVARCHAR(100) NULL,

	CONSTRAINT PK_Language PRIMARY KEY(LangId)
)
GO

CREATE TABLE type(
	TypeId INT IDENTITY(1000, 1) NOT NULL,
	TypeName NVARCHAR(100) NULL,

	CONSTRAINT PK_Type PRIMARY KEY(TypeId)
)
GO

CREATE TABLE penalty(
	PenaltyId INT IDENTITY(1000,1) NOT NULL,
	PenaltyName NVARCHAR(100) NULL,
	Price FLOAT NULL,

	CONSTRAINT PK_ePnalty PRIMARY KEY(PenaltyId)
)
GO 

CREATE TABLE shift(
	ShiftId INT IDENTITY(1000, 1) NOT NULL,
	ShiftName NVARCHAR(100) NULL,

	CONSTRAINT PK_Shift PRIMARY KEY(ShiftId)
)
GO

CREATE TABLE state(
	StateId INT IDENTITY(1000, 1) NOT NULL,
	StateName NVARCHAR(100) NULL,

	CONSTRAINT PK_State PRIMARY KEY(StateId)
)
GO 

CREATE TABLE rent(
	RentId INT IDENTITY(1000, 1) NOT NULL,
	RentDate DATETIME2 NULL,
	Deposit FLOAT NULL DEFAULT 0,
	CustomerId INT NULL,
	EmployeeId INT NULL

	CONSTRAINT PK_Rent PRIMARY KEY(RentId)
)
GO

CREATE TABLE rentDetail(
	RentId INT NOT NULL,
	BookId INT NOT NULL,
	StateId INT NOT NULL,
	RentPrice FLOAT NULL,
	Payed BIT NULL

	CONSTRAINT PK_RentDetail PRIMARY KEY(RentId, BookId)
)
GO

CREATE TABLE pay(
	PayId INT IDENTITY(1000, 1) NOT NULL,
	PayDate DATETIME2 NULL,
	CustomerId INT NULL,
	EmployeeId INT NULL,
	TotalMoney FLOAT NULL

	CONSTRAINT PK_Pay PRIMARY KEY(PayId)
)
GO

CREATE TABLE payDetail(
	PayId INT NOT NULL,
	RentId INT NOT NULL,
	BookId INT NOT NULL,
	PenaltyId INT NULL,
	IntoMoney FLOAT NULL

	CONSTRAINT PK_PayDetail PRIMARY KEY(PayId, RentId, BookId)
)
GO

ALTER TABLE dbo.account ADD CONSTRAINT FK_Account_Employee FOREIGN KEY(EmployeeId) REFERENCES dbo.employee(EmployeeId)
ALTER TABLE dbo.employee ADD CONSTRAINT FK_Employee_Shift FOREIGN KEY(ShiftID) REFERENCES dbo.shift(ShiftId)
ALTER TABLE dbo.book ADD CONSTRAINT FK_Book_Type FOREIGN KEY(TypeId) REFERENCES dbo.type(TypeId)
ALTER TABLE dbo.book ADD CONSTRAINT FK_Book_Author FOREIGN KEY(AuthorId) REFERENCES dbo.author(AuthorId)
ALTER TABLE dbo.book ADD CONSTRAINT FK_Book_Category FOREIGN KEY(CategoryId) REFERENCES dbo.category(CategoryId)
ALTER TABLE dbo.book ADD CONSTRAINT FK_Book_Publisher FOREIGN KEY(PublisherId) REFERENCES dbo.publisher(PublisherId)
ALTER TABLE dbo.book ADD CONSTRAINT FK_Book_Language FOREIGN KEY(LangId) REFERENCES dbo.language(LangId)
ALTER TABLE dbo.rent ADD CONSTRAINT FK_Rent_Customer FOREIGN KEY(CustomerId) REFERENCES dbo.customer(CustomerId)
ALTER TABLE dbo.rent ADD CONSTRAINT FK_Rent_Employee FOREIGN KEY(EmployeeId) REFERENCES dbo.employee(EmployeeId)
ALTER TABLE dbo.rentDetail ADD CONSTRAINT FK_RentDetail_Rent FOREIGN KEY(RentId) REFERENCES dbo.rent(RentId)
ALTER TABLE dbo.rentDetail ADD CONSTRAINT FK_RentDetail_Book FOREIGN KEY(BookId) REFERENCES dbo.book(BookId)
ALTER TABLE dbo.rentDetail ADD CONSTRAINT FK_RentDetail_State FOREIGN KEY(StateId) REFERENCES dbo.state(StateId)
ALTER TABLE dbo.pay ADD CONSTRAINT FK_Pay_Employee FOREIGN KEY(EmployeeId) REFERENCES dbo.employee(EmployeeId)
ALTER TABLE dbo.pay ADD CONSTRAINT FK_Pay_Customer FOREIGN KEY(CustomerId) REFERENCES dbo.customer(CustomerId)
ALTER TABLE dbo.payDetail ADD CONSTRAINT FK_PayDetail_Pay FOREIGN KEY(PayId) REFERENCES dbo.pay(PayId)
ALTER TABLE dbo.payDetail ADD CONSTRAINT FK_PayDetail_Rent FOREIGN KEY(RentId) REFERENCES dbo.rent(RentId)
ALTER TABLE dbo.payDetail ADD CONSTRAINT FK_PayDetail_Book FOREIGN KEY(BookId) REFERENCES dbo.book(BookId)
ALTER TABLE dbo.payDetail ADD CONSTRAINT FK_PayDetail_Penalty FOREIGN KEY(PenaltyId) REFERENCES dbo.penalty(PenaltyId)
GO


--INSERT DATA	
INSERT INTO dbo.penalty(PenaltyName, Price) VALUES (N'Mất', 100000)
INSERT INTO dbo.penalty(PenaltyName, Price) VALUES (N'Rách bìa', 30000)
INSERT INTO dbo.penalty(PenaltyName, Price) VALUES (N'Rách nhẹ', 15000)
GO
INSERT INTO dbo.state(StateName) VALUES (N'Đầy đủ trang')
INSERT INTO dbo.state(StateName) VALUES (N'Rách bìa')
GO
INSERT INTO  dbo.language(LangName) VALUES (N'Tiếng Việt')
INSERT INTO  dbo.language(LangName) VALUES (N'Tiếng Anh')
INSERT INTO  dbo.language(LangName) VALUES (N'Tiếng Pháp')
INSERT INTO  dbo.language(LangName) VALUES ( N'Tiếng Trung')
GO
INSERT INTO  dbo.type(TypeName) VALUES (N'Mới')
INSERT INTO  dbo.type(TypeName) VALUES (N'Cũ')
GO
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Kim Đồng', N'55 Quang Trung, Nguyễn Du, Hai Bà Trưng, Hà Nội', N'02439434490')
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Đại Học Sư Phạm', N'136 Đường Xuân Thuỷ, Quận Cầu Giấy, Thành phố Hà Nội', N'02437547735')
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Văn học', N'18 Nguyễn Trường Tộ, P.Trúc Bạch, Ba Đình, Hà Nội.', N'0437161518')
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Đại học Quốc gia Hà Nội', N'16 Hàng Chuối - Hai Bà Trưng - Hà Nội', N'09714898 ')
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Âm nhạc', N'61 Lý Thái Tổ - Hoàn Kiếm - Hà Nội', N'')
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Giáo dục', N'81 Trần Hưng Đạo, Hà Nội ', N'')
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Tri thức', N'Tầng 1 - Tòa nhà VUSTA - 53 Nguyễn Du - Quận Hai Bà Trưng - Hà Nội - Việt Nam', N'')
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Thanh niên', N'Số 64 Bà Triệu - Hoàn Kiếm - Hà Nội', N'')
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Bách khoa Hà Nội', N'Số 1 Đường Đại Cồ Việt, Hai Bà Trưng , Hà Nội.', N'')
INSERT INTO  dbo.publisher(PublisherName ,Address ,Phone) VALUES (N'NXB Mỹ thuật', N'44 Hàm Long, Hoàn Kiếm, HN', N'')
GO
INSERT INTO dbo.author(AuthorName , Birth , Gender , Address) VALUES (N'Cố Mạn', '21/10/1981', 0, N' Giang Tô, Trung Quốc')
INSERT INTO dbo.author(AuthorName , Birth , Gender , Address) VALUES (N'Dale Carnegie', '24/11/1888', 1, N'Maryville, Missouri, Hoa Kỳ')
INSERT INTO dbo.author(AuthorName , Birth , Gender , Address) VALUES (N'Trác Nhã', '01/01/1990', 0, N'')
INSERT INTO dbo.author(AuthorName , Birth , Gender , Address) VALUES (N'Nam Cao', '28/11/1951', 1, N'Làng Đại Hoàng, tổng Cao Đà, huyện Nam Sang, phủ Lý Nhân')
INSERT INTO dbo.author(AuthorName , Birth , Gender , Address) VALUES (N'Nhiều tác giả', '01/01/1990', 1, N'')
GO
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Ngôn tình', N'ngon-tinh')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Tạp chí', N'tap-chi')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES ( N'Công nghệ thông tin', N'cong-nghe-thong-tin')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Khoa học', N'khoa-hoc')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Viễn tưởng', N'vien-tuong')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Con người', N'con-nguoi')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Tâm lý', N'tam-ly')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Giáo trình', N'giao-trinh')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Sách thiếu nhi', N'sach-thieu-nhi')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Chính trị – pháp luật', N'chinh-tri-–-phap-luat')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Văn học nghệ thuật', N'van-hoc-nghe-thuat')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Văn Học Việt Nam', N'van-hoc-viet-nam')
INSERT INTO dbo.category(CategoryName ,CategoryCode) VALUES (N'Kinh Tế - Quản Lý', N'kinh-te-quan-ly')
GO
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES (N'Đắc Nhân Tâm', 320, 53000, 500, 30,  30, N'Dac-nhan-tam.jpg', 1001, 1001, 1006, 1009, 1000)
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES (N'Khéo Ăn Nói Sẽ Có Được Thiên Hạ', 406, 88000, 1000, 24,  25, N'kheo-an-noi-se-co-duoc-thien-ha.jpg', 1002, 1000, 1002, 1007, 1001)
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES (N'Head First JavaScript Programming', 400, 320000, 1500, 12,  15, N'giai-thuat-va-lap-trinh-le-minh-hoang.jpg', 1003, 1000, 1008, 1003, 1000)
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES ( N'Tuyển tập Nam Cao', 83, 45000, 300, 18,  20, N'Tuyen-tap-Nam-Cao.jpg', 1003, 1001, 1011, 1001, 1000)
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES (N'Chí Phèo', 45, 60000, 1000, 25,  25, N'Chi-Pheo.jpg', 1004, 1001, 1007, 1002, 1001)
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES (N'Truyện Kiều', 32, 40000, 600, 10,  12, N'truyen-kieu.jpg', 1002, 1001, 1004, 1001, 1000)
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES (N'Công Nghệ Blockchain', 80, 87000, 1000, 8,  10, N'cong-nghe-blockchain.jpg', 1001, 1001, 1002, 1005, 1001)
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES (N'Giải Thuật Và Lập Trình', 72, 50000, 500, 8,  8, N'giai-thuat-va-lap-trinh-le-minh-hoang.jpg', 1003, 1000, 1001, 1008, 1000)
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES (N'Tự Học Tiếng Anh Hiệu Quả', 40, 32000, 300, 14,  15, N'tu-hoc-tieng-anh-hieu-qua.jpg', 1001, 1001, 1002, 1001, 1000)
INSERT INTO dbo.book(BookName , Page , Price , RentPrice , Quantity , Total , Image , AuthorId , TypeId , CategoryId , PublisherId , LangId) VALUES (N'Test', 300, 12000000, 500, 15,  15, N'kheo-an-noi-se-co-duoc-thien-ha.jpg', 1004, 1000, 1010, 1003, 1000)
GO
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Hoài Phan', '0969543024', '01/01/1990', 1, N'192 lê trọng tấn-thanh xuân')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Ngọc Trinh', '0969969696', '06/12/1994', 0, N'R4 Royal City, Thanh Xuân, Hà Nội')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Nguyễn Thị Hồng Nhung', '01694419453', '10/10/1999', 1, N'37 Trương Định, Ha Bà Trưng, Hà Nội')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Hoài Phan', '09695430241', '01/01/1990', 1, N'192 lê trọng tấn-thanh xuân')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Phan Văn Linh', '0966967994', '03/07/1994', 1, N'Xuân Yên, Nghi Xuân, Hà Tĩnh')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Chu Chỉ Nhược', '0976749556', '15/03/2001', 0, N'69 Nguyễn Đăng Ninh, Cầu Giấy, Hà Nội')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Phạm Băng Băng', '0809610084', '23/11/1996', 0, N'30 Lạc Long Quân, Tây Hồ, Hà Nội')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Phan Văn Long', '0379073038', '28/08/1968', 1, N'68 Hoàng Quốc Việt, Cầu Giấy, Hà Nội')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Trần Thanh Hải', '0396355470', '01/01/1999', 1, N'1194 Láng')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Trần Qúy Tùng', '0973951802', '21/05/1997', 1, N'26 Trần Thái Tông, Cầu Giấy, Hà Nội')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Đỗ Như Nghiệp', '0966967999', '13/01/1999', 1, N'179 Bạch Mai, Hai Bà trưng, Hà Nội')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Ngọc Trinh', '09699696962', '06/12/1994', 1, N'R4 Royal City, Thanh Xuân, Hà Nội')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Hoài Phan', '096996969668', '01/01/2001', 1, N'192 lê trọng tấn-thanh xuân')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Bùi Thị Hạnh Vân', '0985277233', '07/07/1999', 0, N'198 Lê Trọng Tấn, Thanh Xuân, Hà nỘI')
INSERT INTO dbo.customer(CustomerName ,CustomerPhone ,Birth ,Gender ,Address) VALUES (N'Nguyễn Phạm Song', '0966966977', '15/06/2001', 1, N'79 Lê Hưu Huân, Hà Nội')
GO
INSERT INTO dbo.shift(ShiftName) VALUES (N'Ca sáng')
INSERT INTO dbo.shift(ShiftName) VALUES (N'Ca chiều')
INSERT INTO dbo.shift(ShiftName) VALUES (N'Cả ngày')
INSERT INTO dbo.shift(ShiftName) VALUES (N'Nghỉ')
GO
INSERT INTO dbo.employee(Fullname ,Birth ,Gender ,Address ,Phone ,Salary ,ShiftID, Status) VALUES (N'Phan Văn Hoài', '1999/09/12', 1, N'192 Lê Trọng Tấn, Thanh Xuân, Hà Nội', '0969543024' , 0, 1000, 0)
INSERT INTO dbo.employee(Fullname ,Birth ,Gender ,Address ,Phone ,Salary ,ShiftID, Status) VALUES (N'Trần Nhật Tuấn', '07/09/1994', 1, N'32/1194 Cầu Giấy, Hà Nội', '0966967994' , 8000000, 1001, 1)
INSERT INTO dbo.employee(Fullname ,Birth ,Gender ,Address ,Phone ,Salary ,ShiftID, Status) VALUES (N'Bùi Thị Hạnh', '17/03/2000', 0, N'37 Trương Định, Hai Bà Trưng, Hà Nội', '0394254602' , 3000000, 1002, 1)
GO
INSERT INTO dbo.account(Username ,Password ,Phone ,Role ,Status ,EmployeeId) VALUES (N'admin', N'admin', N'0969543024', 'Admin' , 1, 1000)
INSERT INTO dbo.account(Username ,Password ,Phone ,Role ,Status ,EmployeeId) VALUES (N'hoaipv', N'12345', N'0969543024', 'Boss' , 1, 1001)
INSERT INTO dbo.account(Username ,Password ,Phone ,Role ,Status ,EmployeeId) VALUES (N'bth', N'12345', N'0394254602', 'Employee' , 1, 1002)
GO
INSERT INTO dbo.rent(RentDate ,Deposit ,CustomerId ,EmployeeId) VALUES ('2019-09-06 11:48:30', 120000, 1000, 1002)
INSERT INTO dbo.rent(RentDate ,Deposit ,CustomerId ,EmployeeId) VALUES ('2019-09-06 11:52:19', 121212, 1004, 1001)
INSERT INTO dbo.rent(RentDate ,Deposit ,CustomerId ,EmployeeId) VALUES ('2019-09-07 12:09:59', 10000, 1000, 1002)
INSERT INTO dbo.rent(RentDate ,Deposit ,CustomerId ,EmployeeId) VALUES ('2019-09-07 12:11:39', null, 1004, 1001)
INSERT INTO dbo.rent(RentDate ,Deposit ,CustomerId ,EmployeeId) VALUES ('2019-09-07 12:11:43', null, 1000, 1002)
INSERT INTO dbo.rent(RentDate ,Deposit ,CustomerId ,EmployeeId) VALUES ('2019-10-20 21:30:38', 20000, 1005, 1001)
INSERT INTO dbo.rent(RentDate ,Deposit ,CustomerId ,EmployeeId) VALUES ('2019-10-20 21:31:27', 50000, 1000, 1001)
GO
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1000 ,1000, 1000, 500, 0)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1000 ,1001, 1000, 1000, 1)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1000 ,1004, 1001, 1000, 0)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1003 ,1000, 1000, 500, 0)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1003 ,1001, 1000, 1000, 1)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1004 ,1006, 1001, 600, 1)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1001 ,1002, 1000, 1500, 1)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1001 ,1007, 1001, 1000, 0)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1002 ,1000, 1001, 500, 1)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1002 ,1004, 1000, 1000, 1)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1005 ,1008, 1000, 300, 0)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1005 ,1004, 1000, 1000, 0)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1005 ,1003, 1001, 300, 0)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1006 ,1002, 1000, 1000, 1)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1006 ,1003, 1000, 300, 0)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1006 ,1004, 1000, 1000, 1)
INSERT INTO dbo.rentDetail (RentId ,BookId , StateId ,RentPrice ,Payed) VALUES  (1006 ,1008, 1000, 300, 0)
GO
INSERT INTO dbo.pay(PayDate ,CustomerId ,EmployeeId ,TotalMoney) VALUES ('2019-10-12 11:39:00', 1000, 1002, 16000)
INSERT INTO dbo.pay(PayDate ,CustomerId ,EmployeeId ,TotalMoney) VALUES ('2019-10-16 08:43:00', 1004, 1002, 22000)
INSERT INTO dbo.pay(PayDate ,CustomerId ,EmployeeId ,TotalMoney) VALUES ('2019-10-16 08:43:00', 1000, 1002, 12000)
INSERT INTO dbo.pay(PayDate ,CustomerId ,EmployeeId ,TotalMoney) VALUES ('2019-10-20 21:31:40', 1000, 1001, 2500)
GO
INSERT INTO dbo.payDetail(PayId ,RentId ,BookId ,PenaltyId ,IntoMoney) VALUES (1000, 1000, 1000, 1001, 16000)
INSERT INTO dbo.payDetail(PayId ,RentId ,BookId ,PenaltyId ,IntoMoney) VALUES (1001, 1002, 1000, 1000, 8000)
INSERT INTO dbo.payDetail(PayId ,RentId ,BookId ,PenaltyId ,IntoMoney) VALUES (1001, 1002, 1004, 1001, 14000)
INSERT INTO dbo.payDetail(PayId ,RentId ,BookId ,PenaltyId ,IntoMoney) VALUES (1002, 1001, 1002, 1001, 12000)
INSERT INTO dbo.payDetail(PayId ,RentId ,BookId ,PenaltyId ,IntoMoney) VALUES (1003, 1005, 1002, NULL, 1500)
INSERT INTO dbo.payDetail(PayId ,RentId ,BookId ,PenaltyId ,IntoMoney) VALUES (1003, 1006, 1002, NULL, 1000)
GO
