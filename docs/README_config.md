# Cấu hình dự án Next.js (Single Repo)

Dự án hiện tại là một ứng dụng **Next.js** hoàn chỉnh, tích hợp **TypeScript**, **Tailwind CSS** và **shadcn/ui**. Các công cụ kiểm tra chất lượng mã nguồn vẫn được duy trì.

## 1. Công cụ chính

- **Next.js (v16.2.4)**: Framework ứng dụng (App Router).
- **TypeScript**: Ngôn ngữ lập trình chính.
- **shadcn/ui**: Thư viện thành phần giao diện. Các thành phần nằm trong `src/components/ui`.
- **Yarn (v4.9.2)**: Quản lý các gói.

## 2. Kiểm tra và Định dạng mã nguồn (Linting & Formatting)

- **Prettier**: Cấu hình tại `.prettierrc`.
- **ESLint**: Cấu hình tại `.eslintrc.json` (hỗ trợ Next.js và Prettier).
- **Stylelint**: Cấu hình tại `.stylelintrc.json`.
- **Depcheck**: Chạy bằng lệnh `yarn depcheck`.
- **next-intl**: Cấu hình quốc tế hóa tại `src/i18n/`, nội dung dịch tại `src/messages/`.
- **Google Analytics**: Sử dụng `@next/third-parties/google`. Cần thiết lập `NEXT_PUBLIC_GA_ID` trong file `.env`.
- **Google Tag Manager**: Cấu hình qua `NEXT_PUBLIC_GTM_ID`.
- **Microsoft Clarity**: Cấu hình qua `NEXT_PUBLIC_CLARITY_ID` để phân tích hành vi (heatmaps, recordings).

## 3. Git Hooks và Quy chuẩn Commit

- **Husky**: Quản lý Git hooks (`pre-commit`, `commit-msg`).
- **Commitlint**: Kiểm tra tin nhắn commit (`commitlint.config.js`).
- **Lint-staged**: Chạy kiểm tra trên các file staged (`.lintstagedrc`).

## Lệnh cơ bản

- `yarn dev`: Chạy môi trường phát triển.
- `yarn build`: Xây dựng ứng dụng cho production.
- `yarn lint`: Chạy linting cho toàn bộ dự án.
- `yarn format`: Định dạng lại mã nguồn.
- `yarn depcheck`: Kiểm tra dependency không sử dụng.
