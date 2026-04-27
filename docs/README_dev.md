# Hướng dẫn Vận hành và Commit Code

## 1. Hướng dẫn chạy dự án

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các phụ thuộc:

```bash
yarn install
```

### Các lệnh phát triển:

- **Chạy môi trường Dev**:
  ```bash
  yarn dev
  ```
- **Xây dựng ứng dụng (Production)**:
  ```bash
  yarn build
  ```
- **Chạy bản Build**:
  ```bash
  yarn start
  ```

### Quy trình phát triển:

- **Localized Routes**: Server chạy mặc định tại `/vi` hoặc `/en`.
- **Thêm nội dung**: Khi thêm UI mới, hãy cập nhật key tương ứng trong các file JSON tại `src/messages/`.

### Các lệnh kiểm tra mã nguồn:

- **Lint toàn bộ dự án**:
  ```bash
  yarn lint
  ```
- **Định dạng lại toàn bộ code**:
  ```bash
  yarn format
  ```
- **Kiểm tra phụ thuộc không sử dụng**:
  ```bash
  yarn depcheck
  ```

---

## 2. Quy chuẩn Commit Code

Dự án sử dụng chuẩn **Conventional Commits**. Mọi tin nhắn commit sẽ được kiểm tra tự động bởi `commitlint`.

### Cấu trúc tin nhắn:

```
<type>(<scope>): <description>
```

### Các loại (types) phổ biến:

- `feat`: Thêm một tính năng mới.
- `fix`: Sửa lỗi (bug fix).
- `docs`: Thay đổi tài liệu.
- `style`: Thay đổi về format, dấu phẩy, khoảng trắng (không thay đổi logic code).
- `refactor`: Thay đổi code nhưng không sửa lỗi cũng không thêm tính năng mới.
- `perf`: Cải thiện hiệu suất.
- `test`: Thêm hoặc sửa các đoạn code test.
- `build`: Thay đổi hệ thống build hoặc các dependency bên ngoài.
- `ci`: Thay đổi các file cấu hình CI (ví dụ: GitHub Actions).
- `chore`: Các thay đổi nhỏ khác không thuộc các loại trên.

### Ví dụ các trường hợp:

- **Thêm thành phần UI mới**:
  `feat(ui): add button component from shadcn`
- **Sửa lỗi hiển thị trên mobile**:
  `fix(styles): fix responsive issues on header`
- **Cập nhật tài liệu hướng dẫn**:
  `docs: update docs/README_dev.md with commit format`
- **Cấu hình thêm Husky**:
  `chore(config): add pre-commit hook for linting`

---

## 3. Quy trình Commit tự động

Khi bạn thực hiện lệnh `git commit`, hệ thống sẽ:

1. **Pre-commit**: Tự động chạy `lint-staged` trên các file bạn đang thay đổi để kiểm tra lỗi và định dạng lại code.
2. **Commit-msg**: Kiểm tra xem tin nhắn commit của bạn có đúng format mô tả ở trên hay không.
   - Nếu sai, lệnh commit sẽ thất bại và yêu cầu bạn sửa lại tin nhắn.
