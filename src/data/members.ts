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
        id: '5',
        name: 'Yifeng SUN',
        year: '2023',
        role: 'Master',
        photo: '/people/sunyifeng/sunyifeng.webp',
        homepage: '/members/sunyifeng',
        researchTopic: [
            'Generative design of architectural floor plans',
            'Object detection and transfer learning with deep learning',
            'Homepage to learn more directions',
        ]
    },
    {
        id: '2',
        name: 'Zhenyu SUN',
        year: '2024',
        role: 'Master',
        photo: '/people/sunzhenyu/sunzhenyu.webp',
        github: 'https://github.com/Sunhaha520',
        email: 'mc45046@um.edu.mo',
        homepage: 'https://home.kelejun.cn',
        researchTopic: [
            ' ​Point Cloud Information Completion Based on Photo-Generated Point Clouds',
        ]
    },
    {
        id: '3',
        name: 'Shaobin ZHOU',
        year: '2024',
        role: 'Master',
        photo: '/people/zhoushaobin/zhoushaobin.webp',
        homepage: '/members/zhoushaobin',
        researchTopic: [
            'Multiuser collaboration with Augmented Reality technology'
        ]
    },
    {
        id: '4',
        name: 'Xinzi LENG',
        year: '2024',
        role: 'Master',
        photo: '/people/lengxinzi/lengxinzi.webp',
        github: 'https://github.com/LychEe-Mor',
        homepage: '/members/LychEe',
        email: 'mc45368@um.edu.mo',
        researchTopic: [
            'Prefabricated construction supply chain',
            'Multi-agent reinforcement learning',
            'Optimize management'
        ]
    },
    {
        id: '5',
        name: 'Su YANG',
        year: '2024',
        role: 'Master',
        photo: '/people/yangsu/yangsu.webp',
        github: 'https://github.com/yangsu666',
        email: 'mc45365@um.edu.mo',
        researchTopic: [
            'Virtual construction training using collaborative VR and EEG',
        ]
    },
    {
        id: '6',
        name: 'Yutong QIAO',
        year: '2023',
        role: 'PhD',
        photo: '/people/qiaoyutong/qiaoyutong.webp',
        homepage: '/members/QiaoYutong',
        researchTopic: [
            'Building information modeling (BIM) throughout building lifecycles',
            'Combining different data types for city information models (CIM)',
            'Homepage to learn more directions',
        ]
    },
    {
        id: '7',
        name: 'HO Man Hin',
        year: '2023',
        role: 'PhD',
        photo: '/people/hewenxuan/mark.webp',
        homepage: '/members/homanhin',
        researchTopic: [
            'AI-driven automation for construction data extraction',
            'Programmatic BIM/digital twin development for lifecycle analytics',
            'UAV/robotics integration for autonomous site monitoring',
        ]
    },
];
