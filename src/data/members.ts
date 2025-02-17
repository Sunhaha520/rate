// 定义 Member 接口
export interface Member {
    id: string; // 根据新数据，id 类型改为 string
    name: string;
    year: string;
    role: 'PhD' | 'Master' | 'Undergraduate' | 'RA' | 'Supervisor';
    photo: string;
    github?: string;
    homepage?: string;
    email?: string;
    researchTopic: string[]; // 研究主题为字符串数组
}

// 定义成员数据数组
export const members: Member[] = [
    {
        id: '1',
        name: 'WONG Mun On', // 原数据 name 为空，这里补充示例
        year: '2021',
        role: 'Supervisor',
        photo: '/img/photo.webp',
        github: 'https://github.com/johndoe',
        homepage: '/supervisor',
        email: 'mowong@um.edu.mo',
        researchTopic: [
            'Construction informatics and building information modeling',
            'Modular construction and smart construction management',
            'Virtual design and construction using collaborative AR/VR',
            'Indoor navigation with multi-sensor data fusion'
        ]
    },
    {
        id: '2',
        name: 'Jane Smith',
        year: '2022',
        role: 'Master',
        photo: '/people/1.webp',
        github: 'https://github.com/janesmith',
        researchTopic: [
            'Research and application of BIM and AR-based digital information modeling of bridges: A case study of Macao - Taipa Bridge'
        ]
    },
    {
        id: '3',
        name: 'Alice Johnson',
        year: '2020',
        role: 'PhD',
        photo: '/people/2.webp',
        github: 'https://github.com/alicej',
        homepage: 'https://alicej.com',
        email: 'alicej@example.com',
        researchTopic: [
            'Machine Learning for Structural Health Monitoring'
        ]
    },
    {
        id: '4',
        name: 'Bob Brown',
        year: '2023',
        role: 'Master',
        photo: '/people/2.webp',
        github: 'https://github.com/bobb',
        email: 'bobb@example.com',
        researchTopic: [
            'Optimization of Construction Scheduling Using AI'
        ]
    },
    {
        id: '7',
        name: 'Ethan Green',
        year: '2023',
        role: 'PhD',
        photo: '/people/1.webp',
        github: 'https://github.com/ethang',
        homepage: 'https://ethang.com',
        email: 'ethang@example.com',
        researchTopic: [
            'Application of IoT in Smart Buildings'
        ]
    },
    {
        id: '8',
        name: 'Fiona Harris',
        year: '2022',
        role: 'Master',
        photo: '/people/1.webp',
        github: 'https://github.com/fionah',
        researchTopic: [
            'Risk Management in Large - Scale Construction Projects'
        ]
    }
];
