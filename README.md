# Booking Tour – DTC245160029

Hệ thống đặt tour du lịch được xây dựng bằng Node.js, Express, PostgreSQL và Docker Compose. Dự án tích hợp pgAdmin để quản lý cơ sở dữ liệu, Nginx để reverse proxy và HTTPS, cùng Prometheus, Grafana, Loki và Promtail để giám sát hệ thống.

## 1. Công nghệ sử dụng

- **Backend:** Node.js, Express
- **Database:** PostgreSQL 17
- **Database Management:** pgAdmin
- **Containerization:** Docker, Docker Compose
- **Reverse Proxy & HTTPS:** Nginx
- **Monitoring:** Prometheus, Grafana, Node Exporter, cAdvisor
- **Logging:** Loki, Promtail
- **Version Control:** Git, GitHub

## 2. Chức năng chính

- Hiển thị danh sách tour du lịch.
- Xem thông tin tour và thực hiện đặt tour.
- Lưu thông tin đặt tour vào PostgreSQL.
- Quản lý dữ liệu thông qua pgAdmin.
- Truy cập website qua HTTPS bằng Nginx.
- Giám sát tài nguyên và container bằng Prometheus, Grafana.
- Thu thập và truy vấn log Docker bằng Loki, Promtail.

## 3. Yêu cầu môi trường

Cài đặt các công cụ sau trên máy chủ Ubuntu:

- Git
- Docker Engine
- Docker Compose plugin
- Nginx (nếu triển khai reverse proxy trên máy chủ)
- Trình duyệt web

Kiểm tra phiên bản:

```bash
git --version
docker --version
docker compose version
```

## 4. Clone dự án

```bash
git clone https://github.com/dtc245160029-collab/DTC245160029.git
cd DTC245160029
```

Nếu thư mục dự án đã tồn tại trên máy, chuyển vào thư mục dự án thay vì clone lại.

## 5. Cấu hình biến môi trường

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
chmod 600 .env
nano .env
```

Cập nhật các biến môi trường theo cấu hình thực tế:

```dotenv
POSTGRES_DB=booking_tour
POSTGRES_USER=booking_user
POSTGRES_PASSWORD=CHANGE_TO_A_STRONG_PASSWORD

PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=CHANGE_TO_ANOTHER_STRONG_PASSWORD

PORT=3000
DATABASE_URL=postgresql://booking_user:CHANGE_TO_A_STRONG_PASSWORD@db:5432/booking_tour

GF_SECURITY_ADMIN_PASSWORD=CHANGE_TO_A_STRONG_GRAFANA_PASSWORD
```

**Lưu ý:** Thay các giá trị mẫu bằng thông tin riêng. Mật khẩu trong `DATABASE_URL` phải khớp với `POSTGRES_PASSWORD`. Không commit hoặc push file `.env` lên GitHub.

## 6. Khởi chạy hệ thống

### 6.1. Khởi chạy ứng dụng và cơ sở dữ liệu

```bash
docker compose config -q
docker compose up -d --build
```

Kiểm tra trạng thái:

```bash
docker compose ps
```

### 6.2. Khởi chạy hệ thống giám sát

```bash
docker compose -f compose.monitoring.yaml config -q
docker compose -f compose.monitoring.yaml up -d
```

Kiểm tra các container:

```bash
docker ps
```

Kiểm tra log khi cần:

```bash
docker logs booking_tour_app --tail 100
docker logs booking_tour_db --tail 100
docker logs booking_tour_prometheus --tail 100
docker logs booking_tour_grafana --tail 100
```

## 7. Truy cập các dịch vụ

Thay `192.168.93.129` bằng địa chỉ IP thực tế của máy chủ nếu khác.

| Dịch vụ | Địa chỉ |
|---|---|
| Website Booking Tour | `https://192.168.93.129` |
| pgAdmin | `http://192.168.93.129:5051` |
| Grafana | `http://192.168.93.129:3001` |
| Prometheus Targets | `http://192.168.93.129:9090/targets` |

- Website sử dụng HTTPS thông qua Nginx.
- Chứng chỉ tự ký trong môi trường thực hành có thể khiến trình duyệt hiển thị cảnh báo.
- Tài khoản pgAdmin sử dụng `PGADMIN_DEFAULT_EMAIL` và `PGADMIN_DEFAULT_PASSWORD`.
- Tài khoản Grafana sử dụng tên đăng nhập được cấu hình trong Compose và mật khẩu `GF_SECURITY_ADMIN_PASSWORD`.

Chỉ cho phép các cổng quản trị truy cập từ mạng được tin cậy.

## 8. Kiểm tra hệ thống

### Kiểm tra website

```bash
curl -k -I https://127.0.0.1
```

### Kiểm tra Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
```

### Kiểm tra Prometheus

Mở trang Targets và xác nhận các mục tiêu giám sát cần thiết có trạng thái `UP`.

### Kiểm tra log trong Grafana

Mở Grafana → Explore → chọn Loki và thử truy vấn LogQL:

```logql
{job="docker"}
```

### Kiểm tra cơ sở dữ liệu

Mở pgAdmin, kết nối PostgreSQL và kiểm tra database `booking_tour`, các bảng `tours` và `bookings`.

## 9. Các lệnh Docker thường dùng

Xem container:

```bash
docker ps
```

Xem log ứng dụng:

```bash
docker logs -f booking_tour_app
```

Khởi động lại ứng dụng:

```bash
docker restart booking_tour_app
```

Dừng ứng dụng và database:

```bash
docker compose stop
```

Dừng hệ thống giám sát:

```bash
docker compose -f compose.monitoring.yaml stop
```

Không sử dụng `docker compose down -v` nếu muốn giữ dữ liệu PostgreSQL và dữ liệu giám sát trong các volume.

## 10. Git workflow

### Kiểm tra thay đổi

```bash
git status
git diff
```

### Thêm và commit thay đổi

```bash
git add .
git diff --cached --check
git commit -m "feat: describe your changes"
```

### Push lên GitHub

```bash
git push origin master
```

Nếu dự án sử dụng nhánh khác, thay `master` bằng tên nhánh tương ứng.

GitHub không chấp nhận mật khẩu tài khoản thông thường cho Git qua HTTPS trong quy trình này. Khi được hỏi mật khẩu, sử dụng Personal Access Token (PAT) phù hợp hoặc cấu hình SSH.

### Đồng bộ code mới nhất

```bash
git pull --rebase origin master
```

Kiểm tra trạng thái đồng bộ:

```bash
git status -sb
```

## 11. Bảo mật

- Không đưa `.env`, mật khẩu, token hoặc khóa riêng tư lên GitHub.
- Sử dụng mật khẩu mạnh và riêng biệt cho PostgreSQL, pgAdmin và Grafana.
- Giới hạn quyền truy cập vào các cổng quản trị bằng firewall.
- Chỉ publish các cổng thực sự cần thiết.
- Giữ các dịch vụ nội bộ như PostgreSQL và Loki trong mạng Docker phù hợp.
- Kiểm tra cấu hình Nginx trước khi áp dụng thay đổi.
- Không chia sẻ dữ liệu đăng nhập trong ảnh minh chứng hoặc báo cáo.

## 12. Repository

GitHub: https://github.com/dtc245160029-collab/DTC245160029

Dự án phục vụ mục đích học tập, thực hành triển khai ứng dụng web, quản lý cơ sở dữ liệu, giám sát hệ thống và triển khai dịch vụ bằng Docker.
