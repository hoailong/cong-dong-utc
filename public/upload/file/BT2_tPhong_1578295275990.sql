CREATE TABLE [dbo].[tPhong](
	[SoPhong] [nvarchar](50) NOT NULL,
	[LoaiPhong] [nvarchar](2) NULL,
	[GhiChu] [nvarchar](50) NULL,
 CONSTRAINT [PK_tPhong] PRIMARY KEY CLUSTERED 
(
	[SoPhong] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
)

INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'101', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'102', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'103', N'C', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'104', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'105', N'B', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'201', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'202', N'B', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'203', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'204', N'B', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'205', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'301', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'302', N'B', N'')
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'303', N'C', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'304', N'C', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'305', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'401', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'402', N'B', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'403', N'C', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'404', N'A', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'405', N'B', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'601', N'B', NULL)
INSERT [dbo].[tPhong] ([SoPhong], [LoaiPhong], [GhiChu]) VALUES (N'608', N'C', NULL)
