/**
 * Interface định nghĩa dữ liệu cho một Chứng chỉ chuyên môn.
 */
export interface Certification {
  /** Tên chứng chỉ */
  name: string;
  /** Mô tả chi tiết chứng chỉ */
  description: string;
  /** Đường dẫn ảnh bằng chứng bằng chứng nhận */
  image: string;
  /** Link xác thực chứng chỉ trực tuyến */
  url: string;
}

/**
 * Danh sách tĩnh các Chứng chỉ chuyên môn đạt được.
 */
export const CERTIFICATIONS: Certification[] = [
  {
    name: 'Scrum Certified',
    description:
      'Verified Scrum certification demonstrating Agile delivery and Scrum workflow foundations.',
    image:
      'https://storage.googleapis.com/verified-storage/cert/54856394670688.png',
    url: 'https://verified.sertifier.com/en/verify/54856394670688/',
  },
];
