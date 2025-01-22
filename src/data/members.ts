export interface Member {
    id: string;
    name: string;
    year: string;
    researchTopic: string;
    photo: string;
    github?: string;
    homepage?: string;
    email?: string;
    role: 'PhD' | 'Master' | 'Undergraduate' | 'RA';
}

export const members: Member[] = [
    {
        id: '1',
        name: 'John Doe',
        year: '2021',
        researchTopic: 'Application of Point Clouds in the Construction Field',
        photo: '/people/1.webp',
        github: 'https://github.com/johndoe',
        homepage: 'https://johndoe.com',
        email: 'johndoe@example.com',
        role: 'PhD',
    },
    {
        id: '2',
        name: 'Jane Smith',
        year: '2022',
        researchTopic: 'Research and application of BIM and AR-based digital information modeling of bridges: A case study of Macao-Taipa Bridge',
        photo: '/people/1.webp',
        github: 'https://github.com/janesmith',
        role: 'Master',
    },
    {
        id: '3',
        name: 'Alice Johnson',
        year: '2020',
        researchTopic: 'Machine Learning for Structural Health Monitoring',
        photo: '/people/2.webp',
        github: 'https://github.com/alicej',
        homepage: 'https://alicej.com',
        email: 'alicej@example.com',
        role: 'PhD',
    },
    {
        id: '4',
        name: 'Bob Brown',
        year: '2023',
        researchTopic: 'Optimization of Construction Scheduling Using AI',
        photo: '/people/2.webp',
        github: 'https://github.com/bobb',
        email: 'bobb@example.com',
        role: 'Master',
    },
    {
        id: '5',
        name: 'Charlie Davis',
        year: '2022',
        researchTopic: 'Sustainable Materials in Civil Engineering',
        photo: '/people/1.webp',
        github: 'https://github.com/charlied',
        homepage: 'https://charlied.com',
        role: 'Undergraduate',
    },
    {
        id: '6',
        name: 'Diana Evans',
        year: '2021',
        researchTopic: 'Geotechnical Analysis of Urban Infrastructure',
        photo: '/people/2.webp',
        email: 'dianae@example.com',
        role: 'RA',
    },
    {
        id: '7',
        name: 'Ethan Green',
        year: '2023',
        researchTopic: 'Application of IoT in Smart Buildings',
        photo: '/people/1.webp',
        github: 'https://github.com/ethang',
        homepage: 'https://ethang.com',
        email: 'ethang@example.com',
        role: 'PhD',
    },
    {
        id: '8',
        name: 'Fiona Harris',
        year: '2022',
        researchTopic: 'Risk Management in Large-Scale Construction Projects',
        photo: '/people/1.webp',
        github: 'https://github.com/fionah',
        role: 'Master',
    },
];