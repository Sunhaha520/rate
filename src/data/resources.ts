export interface Resource {
    id: number;
    title: string;
    description: string;
    fullDescription: string;
    coverImage: string;
    headImage: string;
    isVideo: boolean;
    tag: 'Demo videos' | 'Resources';
    link?: string; // 添加 link 字段，设为可选
}

export const resources: Resource[] = [
    {
        id: 1,
        title: 'Loco-AR: Lift Operation Coordination using BIM and Multi-user AR',
        description: 'Loco-AR is developed to connect lifting supervisors and crane operators to enhance lifting operation coordination. It consists of two units: a BIM-based information exchange unit that supplies workers with critical project information and provides geometries of building structures and cranes for visualization; and a multi-user AR interaction unit that superimposes the tempo-spatial AR-BIM models to reality and engages workers in a shared environment for concurrent manipulation. The system shares a vision of promoting the adoption of BIM and multi-user AR for remote collaboration in onsite construction.',
        fullDescription: 'Loco-AR is developed to connect lifting supervisors and crane operators to enhance lifting operation coordination. It consists of two units: a BIM-based information exchange unit that supplies workers with critical project information and provides geometries of building structures and cranes for visualization; and a multi-user AR interaction unit that superimposes the tempo-spatial AR-BIM models to reality and engages workers in a shared environment for concurrent manipulation. The system shares a vision of promoting the adoption of BIM and multi-user AR for remote collaboration in onsite construction.',
        coverImage: '/img/lococover.webp',
        headImage: 'https://r2.xiaoayu.eu.org/2025/02/00ea8704689a8de5f461e171245c9330.mp4',
        isVideo: true,
        tag: 'Demo videos'
    },
    {
        id: 2,
        title: 'Collaborative Training for Precast Facade Installation using BIM and Multi-user VR',
        description: 'Enabled by BIM and multi-user VR, the system aims to empower collaborative training of precast facade installation among crane operators and riggers. Compared to conventional practice and prevalent VR systems, our system provides a safe, economical, and collaborative approach for construction trainees to better know the operational procedures as well as the mutual influence among co-workers in different trades.',
        fullDescription: 'Enabled by BIM and multi-user VR, the system aims to empower collaborative training of precast facade installation among crane operators and riggers. Compared to conventional practice and prevalent VR systems, our system provides a safe, economical, and collaborative approach for construction trainees to better know the operational procedures as well as the mutual influence among co-workers in different trades.',
        coverImage: '/img/arcover.webp',
        headImage: 'https://r2.xiaoayu.eu.org/2025/02/1b662ff01d87dc7582a16773532ffebc.mp4',
        isVideo: true,
        tag: 'Demo videos'
    },
    {
        id: 3,
        title: 'HBD: A Semantic 3D Reconstruction-oriented Image Dataset for Building Component Segmentation',
        description: 'The HBD (Hong Kong University Building Image Dataset) dataset contains 3,378 images collected from both interiors and exteriors of 36 buildings with different architectural styles and various space types on the campus of HKU. The dataset was precisely annotated with 11 common building component types on the object instance level, including wall, curtain wall, floor, ceiling, roof, column, beam, lift, window, door, and opening, in a way suitable for 3D building semantic reconstruction. This yielded 49,380 object instances. Compared to existing building datasets, our HBD dataset stands out by offering significant advantages: it encompasses more object types essential to building reconstruction, includes a larger number of object instances, covers both interior and exterior scenes, and features annotations tailored for 3D building reconstruction.',
        fullDescription: 'The HBD (Hong Kong University Building Image Dataset) dataset contains 3,378 images collected from both interiors and exteriors of 36 buildings with different architectural styles and various space types on the campus of HKU. The dataset was precisely annotated with 11 common building component types on the object instance level, including wall, curtain wall, floor, ceiling, roof, column, beam, lift, window, door, and opening, in a way suitable for 3D building semantic reconstruction. This yielded 49,380 object instances. Compared to existing building datasets, our HBD dataset stands out by offering significant advantages: it encompasses more object types essential to building reconstruction, includes a larger number of object instances, covers both interior and exterior scenes, and features annotations tailored for 3D building reconstruction.',
        coverImage: '/img/hbdcover.webp',
        headImage: '/img/topimg.webp',
        isVideo: false,
        tag: 'Resources',
        link: 'https://github.com/EnochYing/Image2BIM/tree/main/HBD' // 提取原 fullDescription 中的链接
    }
];


