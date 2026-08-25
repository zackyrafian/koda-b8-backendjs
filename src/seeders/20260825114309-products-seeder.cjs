'use strict';

const products = [
  ['Headphone Wireless Premium', 1, 1, 650000, 120, 0, 156, 'Nikmati pengalaman mendengar yang superior dengan Headphone Wireless Premium dari SoundWare.'],
  ['Mouse Gaming RGB Pro', 2, 5, 350000, 120, 10, 89, 'Tingkatkan permainan Anda dengan Mouse Gaming RGB Pro dari LogiTech.'],
  ['Keyboard Mechanical RGB TKL', 6, 5, 750000, 85, 5, 210, 'Keyboard mechanical Tenkeyless dengan switch blue/red yang responsif.'],
  ['Speaker Bluetooth Portable', 1, 1, 450000, 150, 15, 320, 'Speaker portabel tahan air IPX7 dengan suara bass menggelegar.'],
  ['Webcam HD 1080p Autofocus', 10, 6, 550000, 60, 0, 95, 'Webcam berkualitas tinggi dengan resolusi 1080p dan fitur autofocus.'],
  ['External SSD 1TB NVMe', 7, 4, 1450000, 40, 10, 150, 'SSD eksternal super cepat dengan kecepatan transfer hingga 1050 MB/s.'],
  ['Mousepad Gaming Extended', 8, 5, 120000, 200, 0, 450, 'Mousepad ukuran besar dengan permukaan kain mikro-tebal untuk kontrol presisi.'],
  ['Headset Gaming 7.1 Surround', 8, 5, 600000, 90, 20, 180, 'Headset gaming dengan virtual 7.1 surround sound dan mic fleksibel.'],
  ['Flashdisk USB 3.1 64GB', 4, 4, 95000, 300, 5, 520, 'Penyimpanan portabel berkecepatan tinggi dengan koneksi USB 3.1.'],
  ['Cooling Pad Laptop RGB', 3, 10, 220000, 110, 10, 130, 'Pendingin laptop dengan 5 kipas berkecepatan tinggi dan lampu RGB.'],
  ['Earbuds TWS Gaming Low Latency', 1, 1, 380000, 130, 15, 240, 'Earbuds True Wireless Stereo dengan mode gaming ultra-low latency.'],
  ['Microphone Condenser USB', 10, 6, 850000, 45, 0, 85, 'Mikrofon kondenser profesional untuk podcast dan streaming.'],
  ['Harddisk Eksternal 2TB', 4, 4, 1100000, 70, 8, 310, 'Harddisk portabel berkapasitas besar dengan perlindungan password.'],
  ['Ergonomic Vertical Mouse', 9, 9, 420000, 80, 12, 115, 'Mouse ergonomis vertikal untuk mengurangi ketegangan pergelangan tangan.'],
  ['Gaming Controller Wireless', 5, 5, 520000, 95, 10, 270, 'Gamepad stik kontrol nirkabel kompatibel dengan PC dan Android.'],
  ['Hub USB-C 7 in 1', 4, 8, 490000, 100, 5, 190, 'Multiport hub dengan port HDMI 4K, USB 3.0, dan Power Delivery 100W.'],
  ['Desk Mat Kulit Sintetis', 3, 9, 150000, 160, 0, 210, 'Alas meja kerja anti air dan anti gores berbahan kulit sintetis.'],
  ['Soundbar LED Gaming', 1, 1, 320000, 75, 15, 140, 'Speaker soundbar compact dengan efek lampu LED RGB dinamis.'],
  ['Kabel HDMI 2.1 4K/8K 2M', 4, 8, 125000, 250, 0, 410, 'Kabel HDMI mendukung resolusi hingga 8K 60Hz dan 4K 120Hz.'],
  ['Mouse Silent Click Office', 2, 9, 175000, 140, 10, 300, 'Mouse wireless senyap tanpa suara klik untuk kantor.'],
  ['Stand Laptop Aluminium', 3, 9, 250000, 115, 5, 340, 'Dudukan laptop lipat berbahan aluminium ringan dan kokoh.'],
  ['Arm Monitor Single Gas Spring', 3, 9, 680000, 50, 10, 90, 'Lengan monitor meja fleksibel dengan sistem gas spring.'],
  ['Flashdisk OTG Dual 128GB', 4, 4, 195000, 180, 0, 230, 'Flashdisk dengan dua konektor USB Type-A dan Type-C.'],
  ['Mechanical Numeric Keypad', 6, 3, 290000, 60, 0, 75, 'Keypad angka tambahan mekanikal dengan switch red.'],
  ['Mouse Gaming Ultralight', 9, 5, 480000, 85, 10, 165, 'Mouse gaming berdesain sarang lebah yang sangat ringan.'],
  ['Speaker Hi-Fi Bookshelf 2.0', 1, 1, 1250000, 30, 5, 65, 'Speaker aktif stereo kelas atas dengan kayu MDF berkualitas.'],
  ['Kabel Charger Braided Type-C', 4, 8, 75000, 400, 20, 890, 'Kabel pengisian daya cepat 100W dengan balutan nilon braided.'],
  ['Adapter Bluetooth 5.3 USB', 2, 7, 85000, 220, 0, 310, 'Dongle USB Bluetooth versi terbaru untuk PC lama.'],
  ['Webcam 2K Ultra HD dengan Ring Light', 10, 6, 790000, 40, 15, 110, 'Webcam resolusi 2K jernih dilengkapi lampu ring light built-in.'],
  ['External Enclosure SSD M.2 NVMe', 7, 4, 210000, 90, 0, 145, 'Housing SSD NVMe ke USB-C 3.2 Gen 2 dengan pendingin.'],
  ['Mousepad Gaming Hard Surface', 9, 5, 180000, 70, 5, 95, 'Mousepad permukaan keras khusus kecepatan tinggi.'],
  ['Headphone Over-Ear Studio Monitor', 1, 1, 890000, 55, 10, 175, 'Headphone kabel profesional untuk mixing dan monitoring audio.'],
  ['Keyboard Membrane Gaming Slim', 2, 5, 210000, 130, 0, 220, 'Keyboard gaming ramping dengan tombol empuk.'],
  ['Microphone Lavalier Wireless', 10, 6, 350000, 100, 10, 260, 'Mic klip jepit nirkabel untuk konten kreator dan vlogger.'],
  ['Flashdisk Secure Encrypted 256GB', 4, 4, 650000, 35, 0, 50, 'Flashdisk keamanan tinggi dengan enkripsi hardware AES.'],
  ['Cooling Pad Dual Fan Besar', 3, 10, 160000, 150, 5, 190, 'Pendingin laptop dengan kipas sunyi berukuran besar.'],
  ['Headset Stand RGB', 7, 5, 270000, 85, 15, 140, 'Gantungan headset gaming dengan port USB tambahan.'],
  ['Speaker Mini USB Portable', 1, 1, 90000, 200, 0, 380, 'Speaker kecil praktis ditenagai kabel USB.'],
  ['Kabel LAN UTP Cat6 10M', 4, 7, 65000, 300, 0, 450, 'Kabel internet LAN terpasang konektor RJ45 kecepatan 1Gbps.'],
  ['Mouse Wireless Ergonomic Office', 9, 9, 190000, 160, 10, 290, 'Mouse nirkabel harian yang nyaman digenggam.'],
  ['Vertical Laptop Stand', 3, 9, 140000, 110, 0, 185, 'Dudukan laptop vertikal hemat tempat.'],
  ['Arm Monitor Dual Gas Spring', 3, 9, 1150000, 25, 10, 45, 'Lengan ganda monitor meja untuk menopang dua layar sekaligus.'],
  ['Microphone Arm Stand Professional', 10, 6, 195000, 90, 5, 215, 'Lengan penjepit meja untuk mikrofon yang kokoh.'],
  ['External SSD Rugged 2TB', 7, 4, 2400000, 20, 15, 70, 'SSD eksternal tahan banting dan tahan air dengan proteksi karet.'],
  ['Mousepad LED RGB XL', 8, 5, 190000, 120, 10, 230, 'Mousepad gaming ekstra besar dengan lampu RGB.'],
  ['Speaker Bluetooth Mini Waterproof', 1, 1, 220000, 140, 0, 280, 'Speaker mini tahan air dilengkapi tali gantung.'],
  ['Kabel DisplayPort 1.4 2M', 4, 8, 145000, 130, 0, 190, 'Kabel DisplayPort mendukung resolusi 4K 144Hz.'],
  ['Keyboard Wireless Multi-Device', 2, 3, 450000, 75, 10, 160, 'Keyboard nirkabel yang terhubung ke 3 perangkat sekaligus.'],
  ['Headset Gaming Budget RGB', 5, 5, 250000, 160, 20, 340, 'Headset gaming ekonomis dengan lampu LED menarik.'],
  ['Mouse Gaming Pro Wireless', 6, 5, 1150000, 45, 10, 125, 'Mouse gaming nirkabel profesional dengan sensor super akurat.'],
];

const productVariants = [
  ['Headphone Wireless Premium', 'Hitam'],
  ['Headphone Wireless Premium', 'Putih'],
  ['Headphone Wireless Premium', 'Biru'],
  ['Mouse Gaming RGB Pro', 'Hitam'],
  ['Mouse Gaming RGB Pro', 'Putih'],
  ['Keyboard Mechanical RGB TKL', 'Hitam'],
  ['Keyboard Mechanical RGB TKL', 'Putih'],
  ['Speaker Bluetooth Portable', 'RGB Blue Switch'],
  ['Speaker Bluetooth Portable', 'RGB Red Switch'],
  ['Webcam HD 1080p Autofocus', 'Hitam'],
  ['External SSD 1TB NVMe', 'Silver'],
  ['Microphone Condenser USB', 'Hitam'],
  ['Microphone Condenser USB', 'Abu-abu'],
];

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const cols = 8;
    const productValues = products
      .map((_, r) => `(${Array.from({ length: cols }, (_, c) => `$${r * cols + c + 1}`).join(', ')})`)
      .join(', ');
    const binds = products.flat();

    await queryInterface.sequelize.query(
      `INSERT INTO products (name, brand_id, category_id, price, stock, discount, sold_out, description)
       SELECT v.name, v.brand_id::int, v.category_id::int, v.price::numeric, v.stock::int, v.discount::int, v.sold_out::int, v.description
       FROM (VALUES ${productValues}) AS v(name, brand_id, category_id, price, stock, discount, sold_out, description)
       WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name = v.name)`,
      { bind: binds }
    );

    const variantValues = productVariants
      .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`)
      .join(', ');
    await queryInterface.sequelize.query(
      `INSERT INTO product_variants (product_id, name, created_at, updated_at)
       SELECT p.id, v.vname, NOW(), NOW()
       FROM (VALUES ${variantValues}) AS v(pname, vname)
       JOIN products p ON p.name = v.pname
       WHERE NOT EXISTS (
         SELECT 1 FROM product_variants pv
         WHERE pv.product_id = p.id AND pv.name = v.vname
       )`,
      { bind: productVariants.flat() }
    );
  },

  async down(queryInterface) {
    const names = products.map((p) => p[0]);
    const values = names.map((_, i) => `$${i + 1}`).join(', ');

    await queryInterface.sequelize.query(
      `DELETE FROM product_variants pv USING products p
       WHERE pv.product_id = p.id AND p.name IN (${values})`,
      { bind: names }
    );
    await queryInterface.sequelize.query(
      `DELETE FROM products WHERE name IN (${values})`,
      { bind: names }
    );
  },
};
