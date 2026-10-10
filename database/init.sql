CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price NUMERIC(12, 0) NOT NULL CHECK (price >= 0),
    image VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER NOT NULL REFERENCES tours(id),
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    people INTEGER NOT NULL CHECK (people > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO tours (name, description, duration, price, image)
VALUES
    ('Khám phá Vịnh Hạ Long', 'Du ngoạn kỳ quan thiên nhiên với làn nước xanh và những đảo đá tuyệt đẹp.', '2 ngày 1 đêm', 2500000, '🚢'),
    ('Sapa - Săn mây Fansipan', 'Trải nghiệm núi rừng Tây Bắc và chinh phục nóc nhà Đông Dương.', '3 ngày 2 đêm', 3200000, '🏔️'),
    ('Đà Nẵng - Hội An', 'Khám phá biển Mỹ Khê và phố cổ Hội An lung linh về đêm.', '3 ngày 2 đêm', 2800000, '🏖️'),
    ('Hà Giang hùng vĩ', 'Khám phá cao nguyên đá, đèo Mã Pí Lèng và văn hóa vùng cao.', '4 ngày 3 đêm', 3900000, '🏞️')
ON CONFLICT DO NOTHING;
