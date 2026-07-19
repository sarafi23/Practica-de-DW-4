require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const User = require('./models/User');

const productos = [
  { nombre: 'AMD Ryzen 7 7800X3D', categoria: 'CPU', precio: 449, stock: 15, descripcion: 'Procesador de 8 núcleos y 16 hilos con tecnología 3D V-Cache para gaming.', imagen: 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-7-7800x3d-front.jpg', especificaciones: { Núcleos: '8', Hilos: '16', Frecuencia: '4.2GHz / 5.0GHz', Socket: 'AM5', TDP: '120W' } },
  { nombre: 'Intel Core i5-14600K', categoria: 'CPU', precio: 319, stock: 20, descripcion: 'Procesador de 14ª generación con 14 núcleos y 20 hilos.', imagen: 'https://multimedia.bbycastatic.ca/multimedia/products/500x500/172/17263/17263629.jpg', especificaciones: { Núcleos: '14 (6P+8E)', Hilos: '20', Frecuencia: '3.5GHz / 5.3GHz', Socket: 'LGA1700', TDP: '125W' } },
  { nombre: 'NVIDIA RTX 4070 Super', categoria: 'GPU', precio: 599, stock: 10, descripcion: 'Tarjeta gráfica con 12GB GDDR6X, ideal para gaming 1440p.', imagen: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/40-series/rtx-4070-4070ti/geforce-rtx-4070-super-og-1200x630.jpg', especificaciones: { VRAM: '12GB GDDR6X', 'CUDA Cores': '7168', 'Ray Tracing': 'Sí', DLSS: '3.5', Consumo: '220W' } },
  { nombre: 'AMD Radeon RX 7800 XT', categoria: 'GPU', precio: 499, stock: 8, descripcion: 'GPU con 16GB GDDR6, excelente para gaming 1440p y 4K.', imagen: 'https://www.amd.com/content/dam/amd/en/images/products/graphics/2648997-amd-radeon-7800xt.jpg', especificaciones: { VRAM: '16GB GDDR6', 'Stream Processors': '3840', 'Ray Tracing': 'Sí', FSR: '3.0', Consumo: '263W' } },
  { nombre: 'Corsair Vengeance DDR5 32GB', categoria: 'RAM', precio: 109, stock: 30, descripcion: 'Kit de 2x16GB DDR5 a 6000MHz con perfil bajo.', imagen: 'https://m.media-amazon.com/images/I/71AV5PQu1yL._AC_SL1500_.jpg', especificaciones: { Capacidad: '32GB (2x16GB)', Tipo: 'DDR5', Velocidad: '6000MHz', Latencia: 'CL36', Voltaje: '1.35V' } },
  { nombre: 'Samsung 990 Pro 2TB', categoria: 'Almacenamiento', precio: 179, stock: 25, descripcion: 'SSD NVMe M.2 PCIe 4.0 con velocidades de lectura de 7450MB/s.', imagen: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6523/6523595_sd.jpg', especificaciones: { Capacidad: '2TB', Interfaz: 'M.2 NVMe PCIe 4.0', Lectura: '7450 MB/s', Escritura: '6900 MB/s', Tipo: 'NAND TLC' } },
  { nombre: 'Corsair RM850x', categoria: 'Fuente', precio: 139, stock: 18, descripcion: 'Fuente de poder modular 80+ Gold de 850W con ventilador de 135mm.', imagen: 'https://m.media-amazon.com/images/I/71dj+5GQwEL._AC_SL1500_.jpg', especificaciones: { Potencia: '850W', Certificación: '80+ Gold', Modular: 'Sí', Ventilador: '135mm', Protección: 'OVP/OCP/SCP' } },
  { nombre: 'ASUS ROG STRIX B650E-F', categoria: 'Placa Madre', precio: 259, stock: 12, descripcion: 'Placa madre AM5 con WiFi 6E, PCIe 5.0 y RGB.', imagen: 'https://dlcdnwebimgs.asus.com/gain/566A4DF8-85E5-4958-9CEE-21F4629E53AB', especificaciones: { Socket: 'AM5', Chipset: 'B650E', RAM: 'DDR5 (4 slots)', PCIe: '5.0', WiFi: '6E' } },
  { nombre: 'NZXT H7 Flow', categoria: 'Gabinete', precio: 129, stock: 14, descripcion: 'Gabinete ATX de vidrio templado con panel frontal mesh y excelente flujo de aire.', imagen: 'https://nzxt.com/cdn/shop/files/h7-flow-hero-white.png?v=1762528078', especificaciones: { Formato: 'ATX', Material: 'Acero / Vidrio templado', Ventiladores: '3x 120mm incluidos', 'Bahías': '2x 3.5" / 3x 2.5"', 'GPU max': '400mm' } },
  { nombre: 'Noctua NH-D15', categoria: 'Refrigeración', precio: 109, stock: 10, descripcion: 'Disipador de aire dual-torre con dos ventiladores NF-A15 de 140mm.', imagen: 'https://m.media-amazon.com/images/I/91Hw1zcAIjL._AC_SL1500_.jpg', especificaciones: { Tipo: 'Aire (Dual Torre)', Ventiladores: '2x 140mm NF-A15', Altura: '165mm', TDP: '~250W', Socket: 'AM5 / LGA1700' } },
  { nombre: 'Corsair iCUE H150i Elite', categoria: 'Refrigeración', precio: 179, stock: 7, descripcion: 'Refrigeración líquida AIO de 360mm con pantalla LCD y RGB.', imagen: 'https://m.media-amazon.com/images/I/7107JaxG7XL._AC_SL1500_.jpg', especificaciones: { Tipo: 'Líquida AIO', Radiador: '360mm', Ventiladores: '3x 120mm RGB', RGB: 'Sí', Pantalla: 'LCD' } },
  { nombre: 'Kingston NV3 1TB', categoria: 'Almacenamiento', precio: 69, stock: 40, descripcion: 'SSD NVMe M.2 económico con buen rendimiento para el día a día.', imagen: 'https://media.kingston.com/kingston/press/ktc-ssd-nv3-1tb-s-400x400.jpg', especificaciones: { Capacidad: '1TB', Interfaz: 'M.2 NVMe PCIe 4.0', Lectura: '6000 MB/s', Escritura: '4000 MB/s', Tipo: 'NAND QLC' } },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    await Producto.deleteMany({});
    const docs = await Producto.insertMany(productos);
    console.log(`${docs.length} productos insertados`);

    const cpuAmd = docs.find(p => p.nombre.includes('7800X3D'));
    const ramCorsair = docs.find(p => p.nombre.includes('Vengeance'));

    await User.deleteMany({});
    await User.create({
      nombre: 'Admin',
      email: 'admin@mypc.com',
      password: 'admin123',
      telefono: '555-0100',
      direccion: 'Av. Principal 123, Ciudad',
      rol: 'admin',
      compras: [
        { producto: cpuAmd._id, categoria: 'CPU', marca: 'AMD', precio: cpuAmd.precio },
        { producto: ramCorsair._id, categoria: 'RAM', marca: 'Corsair', precio: ramCorsair.precio },
      ],
    });
    await User.create({
      nombre: 'Usuario Demo',
      email: 'demo@test.com',
      password: '123456',
      telefono: '555-0200',
      direccion: 'Calle Secundaria 456, Ciudad',
      compras: [
        { producto: cpuAmd._id, categoria: 'CPU', marca: 'AMD', precio: cpuAmd.precio },
        { producto: ramCorsair._id, categoria: 'RAM', marca: 'Corsair', precio: ramCorsair.precio },
        { producto: cpuAmd._id, categoria: 'CPU', marca: 'AMD', precio: cpuAmd.precio },
      ],
    });
    console.log('2 usuarios insertados con compras de ejemplo');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seed();
