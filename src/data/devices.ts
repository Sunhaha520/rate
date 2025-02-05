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
    // 可以继续添加更多设备信息
];

