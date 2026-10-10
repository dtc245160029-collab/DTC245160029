const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'booking-tour-api' });
});

app.get('/api/tours', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, duration, price, image FROM tours ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Lỗi lấy danh sách tour:', error.message);
    res.status(500).json({ error: 'Không thể tải danh sách tour.' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { tourId, customer, phone, people } = req.body;

  if (
    !Number.isInteger(Number(tourId)) ||
    !customer?.trim() ||
    !phone?.trim() ||
    !Number.isInteger(Number(people)) ||
    Number(people) < 1
  ) {
    return res.status(400).json({ error: 'Thông tin đặt tour không hợp lệ.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (tour_id, customer_name, phone, people)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [Number(tourId), customer.trim(), phone.trim(), Number(people)]
    );

    res.status(201).json({
      message: 'Đặt tour thành công.',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Lỗi tạo đơn đặt tour:', error.message);
    res.status(500).json({ error: 'Không thể đặt tour lúc này.' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.customer_name, b.phone, b.people, b.created_at,
              t.name AS tour_name
       FROM bookings b
       JOIN tours t ON t.id = b.tour_id
       ORDER BY b.id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Lỗi lấy đơn đặt tour:', error.message);
    res.status(500).json({ error: 'Không thể tải danh sách đặt tour.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Booking Tour API đang chạy tại cổng ${port}`);
});
