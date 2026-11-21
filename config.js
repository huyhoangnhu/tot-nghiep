/**
 * CẤU HÌNH THIỆP MỜI TỐT NGHIỆP
 * Bạn có thể dễ dàng chỉnh sửa thông tin, ảnh đại diện hoặc nhạc nền tại đây.
 */
window.INVITATION_CONFIG = {
  graduate: {
    fullName: "Nhữ Huy Hoàng",
    shortName: "Hoàng",
    titleBadge: "Lễ Tốt Nghiệp Đại Học · Khóa 2022 – 2026",
    university: "Trường Đại học Bách Khoa TP.HCM",
    universityShort: "ĐH Bách Khoa — ĐHQG-HCM",
    faculty: "Khoa Cơ khí",
    major: "Ngành Kỹ thuật Cơ điện tử",
    cohort: "2022 – 2026",
    // Thay bằng ảnh chân dung của bạn nếu muốn (vd: "assets/anh-cua-hoang.jpg")
    heroImage: "assets/hero-illustration.jpg",
    heroCaption: "Thanh xuân Bách Khoa · 2022 – 2026",
    keepsakeImage: "assets/campus-memory.jpg",
  },

  ceremony: {
    // Thời gian đếm ngược (ISO 8601, múi giờ Việt Nam +07:00)
    isoDateTime: "2026-11-28T11:00:00+07:00",
    isoEndDateTime: "2026-11-28T13:30:00+07:00",
    dayOfWeek: "Thứ Bảy",
    dateDisplay: "28.11.2026",
    dateFull: "Thứ Bảy, ngày 28 tháng 11 năm 2026",
    timeDisplay: "11:00 Sáng",
    venueName: "Hội trường A5 — Trường ĐH Bách Khoa TP.HCM",
    campusNote: "Cơ sở 1 · 268 Lý Thường Kiệt",
    address: "268 Lý Thường Kiệt, Phường Diên Hồng (P.14 cũ), Quận 10, TP. Hồ Chí Minh",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+B%C3%A1ch+Khoa+TP.HCM+H%E1%BB%99i+tr%C6%B0%E1%BB%9Dng+A5+268+L%C3%BD+Th%C6%B0%E1%BB%9Dng+Ki%E1%BB%87t",
    googleMapsEmbedUrl:
      "https://maps.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng%20%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20B%C3%A1ch%20Khoa%20TP.HCM%20268%20L%C3%BD%20Th%C6%B0%E1%BB%9Dng%20Ki%E1%BB%87t&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },

  letter: {
    greeting: "Gửi những người thương yêu,",
    paragraphs: [
      "Bốn năm thanh xuân dưới mái trường Bách Khoa cuối cùng cũng đến ngày khép lại thật trọn vẹn. Từ những buổi lên giảng đường sớm, những đêm thức trắng cùng đồ án Cơ điện tử, cho đến những kỷ niệm đầy tiếng cười bên bạn bè — mỗi bước đi trên hành trình này đều trở nên ý nghĩa hơn nhờ có sự yêu thương và đồng hành của mọi người.",
      "Sáng thứ Bảy ngày 28/11 sắp tới, Hoàng sẽ chính thức khoác lên mình bộ lễ phục tốt nghiệp. Thật hạnh phúc nếu có sự hiện diện của gia đình, người thân và bạn bè đến chung vui, gửi nhau những cái ôm và lưu giữ thật nhiều tấm ảnh đáng nhớ trong cột mốc đặc biệt này!"
    ],
    closing: "Hẹn gặp bạn tại sân trường Bách Khoa nhé,",
    signature: "Nhữ Huy Hoàng",
  },

  schedule: [
    {
      time: "10:15 – 10:45",
      title: "Đón khách & Gửi xe",
      description:
        "Khách mời di chuyển đến Cơ sở 1 (268 Lý Thường Kiệt), gửi xe và gặp mặt trò chuyện đầu giờ tại khuôn viên sân A5.",
      highlight: false,
    },
    {
      time: "11:00 – 12:15",
      title: "Nghi thức Lễ Tốt Nghiệp",
      description:
        "Buổi lễ trao bằng tốt nghiệp chính thức diễn ra tại Hội trường A5 — khoảnh khắc khép lại hành trình 4 năm đại học.",
      highlight: true,
    },
    {
      time: "12:15 – 13:30",
      title: "Chụp ảnh kỷ niệm & Chung vui",
      description:
        "Gặp gỡ ngoài sân trường Bách Khoa, tặng hoa và lưu lại những khung hình thanh xuân thật rạng rỡ cùng gia đình và bạn bè.",
      highlight: false,
    },
    {
      time: "Sau 13:30",
      title: "Gặp gỡ thân mật",
      description:
        "Cùng nhau ăn trưa nhẹ hoặc cà phê hàn huyên gần trường để kéo dài thêm niềm vui ngày ra trường.",
      highlight: false,
    },
  ],

  parkingTips: [
    {
      title: "Cổng vào thuận tiện",
      detail:
        "Bạn có thể đi vào từ cổng chính đường Lý Thường Kiệt (268 Lý Thường Kiệt) hoặc cổng đường Tô Hiến Thành, sau đó theo hướng dẫn của bảo vệ đến khu vực Hội trường A5.",
    },
    {
      title: "Bãi giữ xe trong & ngoài trường",
      detail:
        "Trường có bãi giữ xe máy trong khuôn viên. Vào ngày lễ tốt nghiệp thường rất đông, nếu bãi trong trường đầy, bạn có thể gửi ở các điểm giữ xe lân cận trên đường Lý Thường Kiệt hoặc Tô Hiến Thành.",
    },
    {
      title: "Gợi ý nhỏ khi đi tham dự",
      detail:
        "Bạn nên đến sớm trước 11:00 khoảng 30 – 45 phút để thong thả gửi xe và chụp ảnh. Đến cổng cứ gọi trực tiếp cho Hoàng nhé!",
    },
  ],

  contact: {
    phoneDisplay: "0355 278 265",
    phoneRaw: "0355278265",
    zaloUrl: "https://zalo.me/0355278265",
    note: "Khi đến cổng trường hoặc cần chỉ đường vào Hội trường A5, bạn cứ gọi điện hoặc nhắn Zalo cho Hoàng nhé!",
  },

  music: {
    trackTitle: "Khúc Nhạc Thanh Xuân",
    trackSubtitle: "Giai điệu piano dịu nhẹ",
    // Nếu bạn có file nhạc MP3 riêng, chép vào thư mục assets/ và điền tên file vào đây (vd: "assets/nhac-nen.mp3").
    // Để trống ("") để phát bản nhạc piano ấm áp được tích hợp sẵn (không cần mạng).
    customAudioUrl: "assets/nhac-nen.mp3",
  },
};
