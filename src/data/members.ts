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
        name: 'Zhenyu Sun',
        year: '2024',
        role: 'Master',
        photo: '/people/sunzhenyu/sunzhenyu.webp',
        github: 'https://github.com/Sunhaha520',
        email: 'mc45046@um.edu.mo',
        homepage: 'https://cv.kelejun.cn',
        researchTopic: [
            ' ​Point Cloud Information Completion Based on Photo-Generated Point Clouds',
        ]
    },
    {
        id: '3',
        name: 'Shaobin Zhou',
        year: '2024',
        role: 'Master',
        photo: '/people/zhoushaobin/zhoushaobin.webp',
        homepage: '/members/zhoushaobin',
        researchTopic: [
            'Multiuser collaboration with Augmented Reality technology'
        ]
    }
];
