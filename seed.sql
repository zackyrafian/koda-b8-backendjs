DROP TABLE IF EXISTS
    product_reviews,
    product_images,
    product_variants,
    products,
    categories,
    brands,
    users,
    user_profiles, 
    user_address, 
    user_orders, 
    user_carts, 
    user_order_items,
    user_wishlists,
    payment_methods,
    payments;

DROP TYPE IF EXISTS user_role;


CREATE TABLE brands( 
  id BIGSERIAL PRIMARY KEY, 
  name VARCHAR (50) NOT NULL UNIQUE, 
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories( 
  id BIGSERIAL PRIMARY KEY, 
  name VARCHAR(50) NOT NULL UNIQUE, 
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products ( 
  id BIGSERIAL PRIMARY KEY, 
  name VARCHAR(255) NOT NULL,
  brand_id BIGINT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  
  price BIGINT NOT NULL DEFAULT 0,
  discount INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  
  sold_out BIGINT NOT NULL DEFAULT 0, 
  description TEXT NOT NULL, 
  created_at TIMESTAMP DEFAULT NOW(), 
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_variants( 
  id BIGSERIAL PRIMARY KEY, 
  name VARCHAR(40) NOT NULL, 
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_images( 
  id BIGSERIAL PRIMARY KEY, 
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TABLE users( 
  id BIGSERIAL PRIMARY KEY, 
  email VARCHAR(50) NOT NULL UNIQUE, 
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id BIGINT REFERENCES product_variants(id) ON DELETE SET NULL,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles( 
  id BIGSERIAL PRIMARY KEY, 
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  fullname VARCHAR(80) NOT NULL,
  phone_number VARCHAR(20),
  date_of_birth VARCHAR(20),
  gender VARCHAR(10),
  image_profile TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_address(
  id BIGSERIAL PRIMARY KEY, 
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  recipient_name VARCHAR(80),
  phone_number VARCHAR(20), 
  recipient_email VARCHAR(40), 
  recipient_address_full TEXT,
  recipient_city VARCHAR(30), 
  recipient_province VARCHAR(30),
  zip_code VARCHAR(8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_carts(
  id BIGSERIAL PRIMARY KEY, 
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, 
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE, 
  quantity INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_orders(
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  address_id BIGINT REFERENCES user_address(id) ON DELETE SET NULL,
  total_price DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_order_items(
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES user_orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE user_wishlists(
  id BIGSERIAL PRIMARY KEY, 
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_methods( 
  id  SERIAL PRIMARY KEY, 
  code VARCHAR(20) UNIQUE NOT NULL,
  va_code VARCHAR(10), 
  va_length INT,
  name VARCHAR(50) NOT NULL, 
  type VARCHAR(20) NOT NULL, 
  logo_url VARCHAR(255), 
  admin_fee NUMERIC(10, 2) DEFAULT 0, 
  is_active BOOLEAN DEFAULT true, 
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments( 
  id BIGSERIAL PRIMARY KEY, 
  order_id BIGINT NOT NULL REFERENCES user_orders(id), 
  payment_method_id INT NOT NULL REFERENCES payment_methods(id), 
  va_number VARCHAR(20) UNIQUE,
  amount NUMERIC(12, 2) NOT NULL, 
  admin_fee NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', 
  expired_at TIMESTAMP, 
  paid_at TIMESTAMP, 
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO brands(name)
VALUES 
('SoundWare'),
('LogiTech'),
('HyperGear'),
('Vortex'),
('ApexTech'),
('RazerBlade'),
('CorsairX'),
('SteelSeries'),
('ZowieGear'),
('ElgatoPro');

INSERT INTO categories(name)
VALUES 
('Audio'),
('Aksesoris Komputer'),
('Periferal'),
('Penyimpanan'),
('Gaming Gear'),
('Streaming & Content Creator'),
('Networking'),
('Power & Cable'),
('Ergonomic & Office'),
('Cooling System');

INSERT INTO products(
    name,
    brand_id,
    category_id,
    price,
    stock,
    discount,
    sold_out,
    description
)
VALUES
(
    'Headphone Wireless Premium',
    1,
    1,
    650000,
    120,
    0,
    156,
    'Nikmati pengalaman mendengar yang superior dengan Headphone Wireless Premium dari SoundWare.'
),
(
    'Mouse Gaming RGB Pro',
    2,
    5,
    350000,
    120,
    10,
    89,
    'Tingkatkan permainan Anda dengan Mouse Gaming RGB Pro dari LogiTech.'
),
(
    'Keyboard Mechanical RGB TKL',
    6,
    5,
    750000,
    85,
    5,
    210,
    'Keyboard mechanical Tenkeyless dengan switch blue/red yang responsif.'
),
(
    'Speaker Bluetooth Portable',
    1,
    1,
    450000,
    150,
    15,
    320,
    'Speaker portabel tahan air IPX7 dengan suara bass menggelegar.'
),
(
    'Webcam HD 1080p Autofocus',
    10,
    6,
    550000,
    60,
    0,
    95,
    'Webcam berkualitas tinggi dengan resolusi 1080p dan fitur autofocus.'
),
(
    'External SSD 1TB NVMe',
    7,
    4,
    1450000,
    40,
    10,
    150,
    'SSD eksternal super cepat dengan kecepatan transfer hingga 1050 MB/s.'
),
(
    'Mousepad Gaming Extended',
    8,
    5,
    120000,
    200,
    0,
    450,
    'Mousepad ukuran besar dengan permukaan kain mikro-tebal untuk kontrol presisi.'
),
(
    'Headset Gaming 7.1 Surround',
    8,
    5,
    600000,
    90,
    20,
    180,
    'Headset gaming dengan virtual 7.1 surround sound dan mic fleksibel.'
),
(
    'Flashdisk USB 3.1 64GB',
    4,
    4,
    95000,
    300,
    5,
    520,
    'Penyimpanan portabel berkecepatan tinggi dengan koneksi USB 3.1.'
),
(
    'Cooling Pad Laptop RGB',
    3,
    10,
    220000,
    110,
    10,
    130,
    'Pendingin laptop dengan 5 kipas berkecepatan tinggi dan lampu RGB.'
),
(
    'Earbuds TWS Gaming Low Latency',
    1,
    1,
    380000,
    130,
    15,
    240,
    'Earbuds True Wireless Stereo dengan mode gaming ultra-low latency.'
),
(
    'Microphone Condenser USB',
    10,
    6,
    850000,
    45,
    0,
    85,
    'Mikrofon kondenser profesional untuk podcast dan streaming.'
),
(
    'Harddisk Eksternal 2TB',
    4,
    4,
    1100000,
    70,
    8,
    310,
    'Harddisk portabel berkapasitas besar dengan perlindungan password.'
),
(
    'Ergonomic Vertical Mouse',
    9,
    9,
    420000,
    80,
    12,
    115,
    'Mouse ergonomis vertikal untuk mengurangi ketegangan pergelangan tangan.'
),
(
    'Gaming Controller Wireless',
    5,
    5,
    520000,
    95,
    10,
    270,
    'Gamepad stik kontrol nirkabel kompatibel dengan PC dan Android.'
),
(
    'Hub USB-C 7 in 1',
    4,
    8,
    490000,
    100,
    5,
    190,
    'Multiport hub dengan port HDMI 4K, USB 3.0, dan Power Delivery 100W.'
),
(
    'Desk Mat Kulit Sintetis',
    3,
    9,
    150000,
    160,
    0,
    210,
    'Alas meja kerja anti air dan anti gores berbahan kulit sintetis.'
),
(
    'Soundbar LED Gaming',
    1,
    1,
    320000,
    75,
    15,
    140,
    'Speaker soundbar compact dengan efek lampu LED RGB dinamis.'
),
(
    'Kabel HDMI 2.1 4K/8K 2M',
    4,
    8,
    125000,
    250,
    0,
    410,
    'Kabel HDMI mendukung resolusi hingga 8K 60Hz dan 4K 120Hz.'
),
(
    'Mouse Silent Click Office',
    2,
    9,
    175000,
    140,
    10,
    300,
    'Mouse wireless senyap tanpa suara klik untuk kantor.'
),
(
    'Stand Laptop Aluminium',
    3,
    9,
    250000,
    115,
    5,
    340,
    'Dudukan laptop lipat berbahan aluminium ringan dan kokoh.'
),
(
    'Arm Monitor Single Gas Spring',
    3,
    9,
    680000,
    50,
    10,
    90,
    'Lengan monitor meja fleksibel dengan sistem gas spring.'
),
(
    'Flashdisk OTG Dual 128GB',
    4,
    4,
    195000,
    180,
    0,
    230,
    'Flashdisk dengan dua konektor USB Type-A dan Type-C.'
),
(
    'Mechanical Numeric Keypad',
    6,
    3,
    290000,
    60,
    0,
    75,
    'Keypad angka tambahan mekanikal dengan switch red.'
),
(
    'Mouse Gaming Ultralight',
    9,
    5,
    480000,
    85,
    10,
    165,
    'Mouse gaming berdesain sarang lebah yang sangat ringan.'
),
(
    'Speaker Hi-Fi Bookshelf 2.0',
    1,
    1,
    1250000,
    30,
    5,
    65,
    'Speaker aktif stereo kelas atas dengan kayu MDF berkualitas.'
),
(
    'Kabel Charger Braided Type-C',
    4,
    8,
    75000,
    400,
    20,
    890,
    'Kabel pengisian daya cepat 100W dengan balutan nilon braided.'
),
(
    'Adapter Bluetooth 5.3 USB',
    2,
    7,
    85000,
    220,
    0,
    310,
    'Dongle USB Bluetooth versi terbaru untuk PC lama.'
),
(
    'Webcam 2K Ultra HD dengan Ring Light',
    10,
    6,
    790000,
    40,
    15,
    110,
    'Webcam resolusi 2K jernih dilengkapi lampu ring light built-in.'
),
(
    'External Enclosure SSD M.2 NVMe',
    7,
    4,
    210000,
    90,
    0,
    145,
    'Housing SSD NVMe ke USB-C 3.2 Gen 2 dengan pendingin.'
),
(
    'Mousepad Gaming Hard Surface',
    9,
    5,
    180000,
    70,
    5,
    95,
    'Mousepad permukaan keras khusus kecepatan tinggi.'
),
(
    'Headphone Over-Ear Studio Monitor',
    1,
    1,
    890000,
    55,
    10,
    175,
    'Headphone kabel profesional untuk mixing dan monitoring audio.'
),
(
    'Keyboard Membrane Gaming Slim',
    2,
    5,
    210000,
    130,
    0,
    220,
    'Keyboard gaming ramping dengan tombol empuk.'
),
(
    'Microphone Lavalier Wireless',
    10,
    6,
    350000,
    100,
    10,
    260,
    'Mic klip jepit nirkabel untuk konten kreator dan vlogger.'
),
(
    'Flashdisk Secure Encrypted 256GB',
    4,
    4,
    650000,
    35,
    0,
    50,
    'Flashdisk keamanan tinggi dengan enkripsi hardware AES.'
),
(
    'Cooling Pad Dual Fan Besar',
    3,
    10,
    160000,
    150,
    5,
    190,
    'Pendingin laptop dengan kipas sunyi berukuran besar.'
),
(
    'Headset Stand RGB',
    7,
    5,
    270000,
    85,
    15,
    140,
    'Gantungan headset gaming dengan port USB tambahan.'
),
(
    'Speaker Mini USB Portable',
    1,
    1,
    90000,
    200,
    0,
    380,
    'Speaker kecil praktis ditenagai kabel USB.'
),
(
    'Kabel LAN UTP Cat6 10M',
    4,
    7,
    65000,
    300,
    0,
    450,
    'Kabel internet LAN terpasang konektor RJ45 kecepatan 1Gbps.'
),
(
    'Mouse Wireless Ergonomic Office',
    9,
    9,
    190000,
    160,
    10,
    290,
    'Mouse nirkabel harian yang nyaman digenggam.'
),
(
    'Vertical Laptop Stand',
    3,
    9,
    140000,
    110,
    0,
    185,
    'Dudukan laptop vertikal hemat tempat.'
),
(
    'Arm Monitor Dual Gas Spring',
    3,
    9,
    1150000,
    25,
    10,
    45,
    'Lengan ganda monitor meja untuk menopang dua layar sekaligus.'
),
(
    'Microphone Arm Stand Professional',
    10,
    6,
    195000,
    90,
    5,
    215,
    'Lengan penjepit meja untuk mikrofon yang kokoh.'
),
(
    'External SSD Rugged 2TB',
    7,
    4,
    2400000,
    20,
    15,
    70,
    'SSD eksternal tahan banting dan tahan air dengan proteksi karet.'
),
(
    'Mousepad LED RGB XL',
    8,
    5,
    190000,
    120,
    10,
    230,
    'Mousepad gaming ekstra besar dengan lampu RGB.'
),
(
    'Speaker Bluetooth Mini Waterproof',
    1,
    1,
    220000,
    140,
    0,
    280,
    'Speaker mini tahan air dilengkapi tali gantung.'
),
(
    'Kabel DisplayPort 1.4 2M',
    4,
    8,
    145000,
    130,
    0,
    190,
    'Kabel DisplayPort mendukung resolusi 4K 144Hz.'
),
(
    'Keyboard Wireless Multi-Device',
    2,
    3,
    450000,
    75,
    10,
    160,
    'Keyboard nirkabel yang terhubung ke 3 perangkat sekaligus.'
),
(
    'Headset Gaming Budget RGB',
    5,
    5,
    250000,
    160,
    20,
    340,
    'Headset gaming ekonomis dengan lampu LED menarik.'
),
(
    'Mouse Gaming Pro Wireless',
    6,
    5,
    1150000,
    45,
    10,
    125,
    'Mouse gaming nirkabel profesional dengan sensor super akurat.'
);

INSERT INTO product_variants(product_id, name)
VALUES
(1, 'Hitam'),
(1, 'Putih'),
(1, 'Biru'),
(2, 'Hitam'),
(2, 'Putih'),
(3, 'Hitam'),
(3, 'Putih'),
(4, 'RGB Blue Switch'),
(4, 'RGB Red Switch'),
(5, 'Hitam'),
(6, 'Silver'),
(12, 'Hitam'),
(12, 'Abu-abu');

-- 5. Insert Product Images
-- INSERT INTO product_images(product_id, url)
-- VALUES
-- (1, '/headphone1.png'),
-- (1, '/headphone2.png'),
-- (1, '/headphone3.png'),
-- (3, '/keyboard1.png'),
-- (3, '/keyboard2.png'),
-- (4, '/speaker1.png'),
-- (5, '/webcam1.png'),
-- (6, '/ssd1.png');

SELECT
    p.id,
    p.name,
    b.name AS brand,
    c.name AS category,
    string_agg(pv.name, ', ' ORDER BY p.id) AS variant,
    p.price,
    p.description
FROM products p
JOIN brands b
    ON p.brand_id = b.id
JOIN categories c
    ON p.category_id = c.id
JOIN product_variants pv
    ON pv.product_id = p.id
GROUP BY 
    p.id,
    p.name,
    b.name,
    c.name,
    p.price;


INSERT INTO payment_methods (code, name, type, va_code, va_length, admin_fee) VALUES 
('BCA_VA', 'BCA Virtual Account', 'VA', '88810', 15, 0),
('BNI_VA', 'BNI Virtual Account', 'VA', '988', 12, 0),
('MANDIRI_VA', 'Mandiri Virtual Account', 'VA', '89508', 13, 0),
('BRI_VA', 'BRI Virtual Account', 'VA', '128', 15, 0);
-- ('GOPAY', 'GoPay', 'EWALLET', 0),
-- ('OVO', 'OVO', 'EWALLET', 0)

SELECT * FROM products;
SELECT * FROM users;
SELECT * FROM user_profiles;
SELECT * FROM user_carts;
SELECT * FROM payments;
SELECT * FROM user_address;
SELECT * FROM user_orders;

-- UPDATE users SET role 'ADMIN', updated_at = NOW() WHERE id = 1;
UPDATE users SET role = 'ADMIN', updated_at = NOW() WHERE id = 1;

DELETE FROM categories WHERE id = 2;
