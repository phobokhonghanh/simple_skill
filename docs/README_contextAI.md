# Technical Context & Project Management (Enterprise Grade)

## 🎯 Global Mission

Xây dựng một sản phẩm web bền vững, dễ mở rộng và bảo trì theo tiêu chuẩn của các công ty công nghệ lớn. Mọi thay đổi phải tuân thủ tính nhất quán và tối ưu hóa trải nghiệm người dùng (UX) cũng như trải nghiệm nhà phát triển (DX).

## 🏗️ Architecture Design

- **Architecture**: Component-Driven Development (CDD).
- **UI System**: Sử dụng **Atomic Design** (Atom -> Molecule -> Organism) kết hợp với **shadcn/ui**. Các component được chia làm 2 loại: UI cơ bản (Stateless) và Feature-based (Smart components).
- **i18n System**: Sử dụng `next-intl` (App Router) với các thư mục localized `[locale]`.
- **Theme System**: Tích hợp `next-themes` hỗ trợ Light/Dark/System mode đồng bộ Tailwind v4.
- **Analytics**: Sử dụng Google Analytics (GA4), Google Tag Manager (GTM) và Microsoft Clarity để theo dõi hành vi người dùng toàn diện.
- **State Management**: Ưu tiên React Server Components (RSC) cho dữ liệu và Client Components với Hooks cho tương tác.
- **Styling Strategy**: Tailwind CSS (v4) với `tw-animate-css` và `shadcn/tailwind.css`. Đảm bảo các file config (`postcss.config.mjs`, v.v.) luôn nằm ở root để bộ công cụ Next.js nhận diện chính xác.
- **Network access**: Đã cấu hình `allowedDevOrigins` trong `next.config.ts` để cho phép truy cập qua địa chỉ IP mạng nội bộ.

## 📍 Communication & Role Protocol (Luật giao thông)

Để tối ưu hóa luồng trao đổi và tránh sai sót, mọi giao tiếp phải tuân thủ:

- **Role Awareness**: AI đóng vai trò là Chuyên gia lập trình (Pair Programmer). Nếu yêu cầu của USER còn mơ hồ, AI **phải hỏi lại** để làm rõ yêu cầu nghiệp vụ (Business logic).
- **Context First**: AI phải đọc logic file hiện tại và các config liên quan trước khi sửa đổi. Tuyệt đối không viết code chồng chéo.
- **Proactive Maintenance**: AI tự động rà soát và cập nhật hệ thống tài liệu trong `docs/` sau mỗi thay đổi lớn về mã nguồn hoặc quy trình. **QUY TẮC VÀNG**: Khi cập nhật `docs/`, AI phải ưu tiên bảo tồn các thông tin nền tảng, cấu trúc và lộ trình (roadmap) hiện có. Chỉ được phép bổ sung (append) hoặc tinh chỉnh các chi tiết kỹ thuật mới, tuyệt đối không ghi đè làm mất đi ngữ cảnh quản trị chung của dự án.

## 📂 Project Structure & Governance

```text
.
├── src/
│   ├── app/            # Điều hướng & Layout (App Router)
│   ├── components/
│   │   ├── ui/         # Thành phần nguyên tử (Atom/Base) từ shadcn & Custom (InfoBox...)
│   │   └── features/   # Thành phần theo tính năng cụ thể (LanguageSwitcher, ThemeToggle...)
│   ├── i18n/           # Cấu hình routing & request cho i18n
│   ├── messages/       # Các file JSON chứa nội dung dịch tương ứng (vi.json, en.json)
│   ├── lib/            # Tiện ích dùng chung, API Client, Helper functions
│   ├── hooks/          # Custom Hooks tái sử dụng logic UI
│   └── styles/         # Global styles & Tailwind configuration
├── docs/               # Hệ thống tài liệu quản trị (Single Source of Truth)
│   ├── AGENTS.md       # Quy chuẩn viết code & chuẩn AI
│   ├── CLAUDE.md       # Cổng kết nối & Quy tắc nạp ngữ cảnh AI
│   ├── README_contextAI.md # Tài liệu ngữ cảnh chính (File hiện tại)
│   ├── README_dev.md   # Hướng dẫn vận hành & Quy chuẩn commit
│   └── README_config.md # Giải thích chi tiết các bộ config kỹ thuật
├── public/             # Tài nguyên tĩnh đã được tối ưu hóa
├── .husky/             # Tự động hóa kiểm soát chất lượng code trước khi commit
├── next.config.ts      # Cấu hình Next.js (Bao gồm next-intl plugin)
├── postcss.config.mjs  # Cấu hình PostCSS cho Tailwind v4
└── package.json        # Dependencies & Scripts (Standardized)
```

## 🛠️ Operational Excellence

- **Package Manager**: Yarn (v4 / Berry) - Linker: `node-modules` (Tối ưu cho Tailwind v4).
- **Automated Quality**: Hệ thống Linting (ESLint), Formatting (Prettier), Stylelint được tự động thực thi qua Husky/Lint-staged trước mỗi commit.
- **Single Source of Truth**: Mọi thay đổi kỹ thuật phải được phản chiếu trong `docs/`.
- **Maintainability**: Mỗi component/function mới phải đảm bảo tính dễ đọc (Scalability) và có JSDoc cho các logic phức tạp.

## 📝 Roadmap & Future-proof

1. Tích hợp Unit Test (Jest/Vitest).
2. Tích hợp E2E Test (Playwright).
3. Triển khai Hệ thống Design Token chuẩn hóa cho Branding.
