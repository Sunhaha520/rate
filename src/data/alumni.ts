export interface Alumni {
    id: number;
    name: string;
    year: string; // 哪届的
    role: string; // 身份（PhD, Master, UG, RA）
    researchTopic: string; // 研究课题
}

export const alumni: Alumni[] = [
    {
        id: 1,
        name: "Zhang Sanfeng",
        year: "2018",
        role: "PhD",
        researchTopic: "Advanced Machine Learning Techniques for Autonomous Vehicle Navigation",
    },
    {
        id: 2,
        name: "Li Siming",
        year: "2019",
        role: "Master",
        researchTopic: "Exploring the Impact of Transformer Models on Multilingual Sentiment Analysis",
    },
    {
        id: 3,
        name: "Wang Wuji",
        year: "2020",
        role: "UG",
        researchTopic: "A Comprehensive Study on the Security and Scalability of Blockchain Networks",
    },
    {
        id: 4,
        name: "Zhao Liuer",
        year: "2021",
        role: "RA",
        researchTopic: "Deep Learning Approaches for Real-Time Object Detection in Surveillance Systems",
    },
    {
        id: 5,
        name: "Chen Xiaolong",
        year: "2017",
        role: "PhD",
        researchTopic: "Quantum Computing and Its Applications in Cryptography",
    },
    {
        id: 6,
        name: "Liu Yifei",
        year: "2019",
        role: "Master",
        researchTopic: "The Role of Reinforcement Learning in Robotic Arm Manipulation",
    },
    {
        id: 7,
        name: "Sun Wukong",
        year: "2022",
        role: "UG",
        researchTopic: "Investigating the Ethical Implications of AI in Healthcare Decision-Making",
    },
    {
        id: 8,
        name: "Tang Seng",
        year: "2020",
        role: "RA",
        researchTopic: "Neural Network Optimization Techniques for Large-Scale Data Processing",
    },
    {
        id: 9,
        name: "Zhu Bajie",
        year: "2018",
        role: "PhD",
        researchTopic: "The Evolution of Generative Adversarial Networks in Art and Design",
    },
    {
        id: 10,
        name: "Sha Wujing",
        year: "2021",
        role: "Master",
        researchTopic: "The Application of AI in Predictive Maintenance for Industrial Equipment",
    },
];