// @/data/devices.ts
export interface Device {
    id: string;
    name: string;
    image: string;
    features: string[];
    category: string;
}

export const devices: Device[] = [
    {
        id: '1',
        name: 'Deep Robotics Lite 2 Pro',
        image: '/devices/1.webp',
        features: ['10-cm step climbing capability', '>7.5kg load capability', 'RGB-D Intel® RealSense™ camera','NVIDIA® Jetson Xavier NX','RoboSense RS-LiDAR-16 3D sensor'],
        category: 'Construction robots'
    },
    {
        id: '2',
        name: 'DJI Mavic 3T',
        image: '/devices/2.webp',
        features: ['Thermal camera, resolution 640x512 920g weight', '61-degree DFOV'],
        category: 'Construction robots'
    },
    {
        id: '3',
        name: 'DJI Mini 3 Pro',
        image: '/devices/3.webp',
        features: ['<250g weight', '34-min max flight time x 3 batteries','4K/60fps video and 4K/30fps HDR video'],
        category: 'Construction robots'
    },
    {
        id: '16',
        name: 'Robotic tower cranes',
        image: '/devices/16.webp',
        features: ['Self-developed device', 'Arduino/Unity-based programming controls','3-DoF motion capability','With 3D-printed building blocks'],
        category: 'Construction robots'
    },
    {
        id: '5',
        name: 'HTC VIVE Focus 3 VR headset',
        image: '/devices/5.webp',
        features: ['Inside-Out Tracking with 6DoF', 'Standalone Headset with All-in-One VR','4896 x 2448 Total Resolution | 120° FOV','Dual 2.88", 90 Hz LCD Displays'],
        category: 'Extended reality devices'
    },
    {
        id: '6',
        name: 'HoloLens 2 XR headset',
        image: '/devices/6.webp',
        features: ['HoloLens 2', 'Hand and eye tracking','6DoF tracking'],
        category: 'Extended reality devices'
    },
    {
        id: '7',
        name: 'Oculus Quest 2 VR headset',
        image: '/devices/7.webp',
        features: ['2 sets', '1832 x 1920 resolution','97° HFOV'],
        category: 'Extended reality devices'
    },
    {
        id: '8',
        name: 'DaSpatial R100 Lidar device',
        image: '/devices/8.webp',
        features: ['Both handheld and wearable mode', '360 camera','Accuracy error <5 cm'],
        category: 'Reality capture and sensing devices'
    },
    {
        id: '9',
        name: 'Insta360 X4 360 camera',
        image: '/devices/9.webp',
        features: ['8K video @ 30 fps', '75-min max capturing time'],
        category: 'Reality capture and sensing devices'
    },
    {
        id: '10',
        name: 'Zhuolin Tec P60 RTK device',
        image: '/devices/10.webp',
        features: ['RTK: 2cm+1ppm', 'Horizontal positioning accuracy 1.5m CEP'],
        category: 'Reality capture and sensing devices'
    },
    {
        id: '11',
        name: 'Camera (Canon)',
        image: '/devices/11.webp',
        features: ['Canon EOS-R8 Mirrorless Camera Body', 'Canon RF24-105MM F4-7.1 IS STM Lens','Canon LP-E17 LITHIUM ION Battery'],
        category: 'Reality capture and sensing devices'
    },
    {
        id: '12',
        name: 'Z790 workstation',
        image: '',
        features: ['Intel® I9-14900K, Windows 11 Home', '2x48 GB RAM','NVIDIA® RTX 4090 GPU with 24 GB RAM','NVIDIA® RTX 4060 Ti GPU with 8 GB RAM','2TB SSD + 16TB HDD'],
        category: 'High-performance computers'
    },
    {
        id: '13',
        name: 'Lenovo 9000K Blade 2023 workstation',
        image: '',
        features: ['Intel® I7-13700K(F), Windows 11 Home', '2x16 GB RAM','NVIDIA® RTX 4080 GPU with 16 GB RAM','1TB SSD','Synology DS423 4-Bay NAS (4 x 4TB HDD)'],
        category: 'High-performance computers'
    },
    {
        id: '14',
        name: 'Lenovo ThinkStation P520c workstation',
        image: '',
        features: ['Intel® Xeon™ W-2223, Windows 11 Pro 64', '2x16 GB RAM','NVIDIA® RTX A2000 with 12 GB RAM','1TB SSD + 2TB HDD'],
        category: 'High-performance computers'
    },
    {
        id: '15',
        name: 'Lenovo Y9000P 2023 Intel i9 16-inch laptop',
        image: '',
        features: ['Intel® I9-13900HX CPU, Windows 11 Home', '16 GB RAM','NVIDIA® RTX 4060 GPU with 8 GB RAM','1TB SSD'],
        category: 'High-performance computers'
    },
    {
        id: '16',
        name: 'DJI Matrice 350 RTK',
        image: '/devices/17.webp',
        features: ['Empty weight ~3.77 kg, max payload 2.7 kg', 'Maximum flight altitude: 7,000 meters','Supports DJI Zenmuse series lenses'],
        category: 'Construction robots'
    },
    {
        id: '17',
        name: 'DJI Mavic 4 Pro',
        image: '/devices/18.webp',
        features: ['Body weight: 1063g (approx. 2.34 lbs)', '100MP main camera (28mm, 6K/60fps HDR)', '50MP telephoto (168mm, 4K/60fps HDR)', '48MP mid-focal (70mm, 4K/60fps HDR)'],
        category: 'Construction robots'
    },
    {
        id: '18',
        name: 'UNICORN HYBRID BLACK',
        image: '/devices/19.webp',
        features: ['256 channels, 24-bit resolution, 38.4kHz sampling rate', 'Noise <0.5μV rms, 8.57nV detection', 'Active/passive electrode support, single/bipolar switch'],
        category: 'Extended reality devices'
    },
    // 可以继续添加更多设备信息
];

