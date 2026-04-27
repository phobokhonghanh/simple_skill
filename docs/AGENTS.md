<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AI Agent Standards & Coding Rules

## ⚠️ Critical Warning

Dự án này sử dụng Next.js phiên bản mới với nhiều thay đổi. Tuyệt đối không giả định API giống phiên bản cũ. Luôn kiểm tra tài liệu trong `node_modules/next/dist/docs/`.

## 💻 Development Standards

1. **TypeScript First**: Không sử dụng `any`. Định nghĩa interface/type rõ ràng cho props và data.
2. **Component Rules**:
   - Sử dụng Functional Components và Arrow Functions.
   - Ưu tiên Server Components trừ khi cần tương tác (Client Components).
   - Tên component phải theo CamelCase (ví dụ: `DataCard.tsx`).
3. **shadcn/ui Integration**:
   - Không tạo lại các UI component đã có trong `src/components/ui`.
   - Khi tạo component mới, hãy cân nhắc xem nó có thể trở thành một phần của bộ UI dùng chung hay không.
4. **Performance**:
   - Tối ưu hóa ảnh qua `next/image`.
   - Hạn chế re-render không cần thiết ở client.
5. **Accessibility (a11y)**: Đảm bảo sử dụng đúng Semantic HTML (main, section, header, aria-labels).

## ✍️ Documentation Requirements

- Mọi logic phức tạp phải có comment giải thích ngắn gọn "Tại sao" thay vì "Làm gì".
- Sử dụng JSDoc cho các hàm quan trọng trong `src/lib`.

## 🚀 Commit Workflow

- Tuân thủ quy chuẩn Conventional Commits trong [README_dev.md](file:///home/itc/workspace/web/simple_skill/docs/README_dev.md).
- Tuyệt đối không bỏ qua lỗi Lint/Format.
