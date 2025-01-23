export interface Paper {
    id: number;
    title: string;
    authors: string[];
    journal: string;
    year: number;
    abstract: string;
    keywords: string[]; // 数据关键词
    link: string; // 论文链接
    color: string; // 卡片背景颜色
}

export const papers: Paper[] = [
    {
        id: 1,
        title: "Advancements in AI for Engineering: A Comprehensive Review",
        authors: ["Author 1", "Author 2", "Author 3", "Author 4"],
        journal: "Journal of Advanced Research in Artificial Intelligence",
        year: 2023,
        abstract: "This paper provides a comprehensive review of the latest advancements in artificial intelligence (AI) and their applications in various engineering fields. We discuss the challenges and opportunities of integrating AI into engineering practices, including machine learning, deep learning, and natural language processing. The paper also highlights future research directions and potential impacts on the industry.",
        keywords: [
            "Artificial Intelligence",
            "Machine Learning",
            "Deep Learning",
            "Natural Language Processing",
            "Engineering Applications",
            "Future Research Directions",
            "Industry Impact",
        ],
        link: "https://example.com/paper1",
        color: "hsl(210, 70%, 60%)", // 蓝色
    },
    {
        id: 2,
        title: "Sustainable Materials for Modern Construction: Challenges and Opportunities",
        authors: ["Author 5", "Author 6", "Author 7"],
        journal: "Nature Materials",
        year: 2022,
        abstract: "This study explores the use of sustainable materials in modern construction practices. We analyze the environmental impact of traditional construction materials and compare them with emerging sustainable alternatives. The paper also discusses the challenges of adopting these materials on a large scale and proposes potential solutions to overcome these barriers.",
        keywords: [
            "Sustainable Materials",
            "Modern Construction",
            "Environmental Impact",
            "Green Building",
            "Circular Economy",
            "Material Innovation",
            "Construction Industry",
        ],
        link: "https://example.com/paper2",
        color: "hsl(120, 70%, 60%)", // 绿色
    },
    {
        id: 3,
        title: "The Role of Blockchain in Supply Chain Management: A Systematic Review",
        authors: ["Author 8", "Author 9", "Author 10"],
        journal: "International Journal of Supply Chain Management",
        year: 2021,
        abstract: "This paper presents a systematic review of the role of blockchain technology in supply chain management. We examine the potential benefits of blockchain, such as increased transparency, security, and efficiency, as well as the challenges of implementation. The study also identifies key areas for future research and development in this field.",
        keywords: [
            "Blockchain Technology",
            "Supply Chain Management",
            "Transparency",
            "Security",
            "Efficiency",
            "Decentralization",
            "Future Research Directions",
        ],
        link: "https://example.com/paper3",
        color: "hsl(30, 70%, 60%)", // 橙色
    },
    {
        id: 4,
        title: "Climate Change and Its Impact on Coastal Ecosystems: A Global Perspective",
        authors: ["Author 11", "Author 12", "Author 13"],
        journal: "Global Environmental Change",
        year: 2020,
        abstract: "This paper examines the impact of climate change on coastal ecosystems from a global perspective. We analyze the effects of rising sea levels, ocean acidification, and extreme weather events on biodiversity and ecosystem services. The study also discusses potential mitigation strategies and policy recommendations to address these challenges.",
        keywords: [
            "Climate Change",
            "Coastal Ecosystems",
            "Biodiversity",
            "Ocean Acidification",
            "Sea Level Rise",
            "Mitigation Strategies",
            "Policy Recommendations",
        ],
        link: "https://example.com/paper4",
        color: "hsl(270, 70%, 60%)", // 紫色
    },
    {
        id: 5,
        title: "The Future of Quantum Computing: Opportunities and Challenges",
        authors: ["Author 14", "Author 15", "Author 16"],
        journal: "Quantum Information Science",
        year: 2024,
        abstract: "This paper explores the future of quantum computing, focusing on the opportunities and challenges of this emerging technology. We discuss the potential applications of quantum computing in cryptography, optimization, and material science, as well as the technical and theoretical hurdles that need to be overcome for widespread adoption.",
        keywords: [
            "Quantum Computing",
            "Cryptography",
            "Optimization",
            "Material Science",
            "Quantum Algorithms",
            "Technical Challenges",
            "Future Applications",
        ],
        link: "https://example.com/paper5",
        color: "hsl(0, 70%, 60%)", // 红色
    },
    {
        id: 6,
        title: "Advancements in Renewable Energy Technologies: A Comprehensive Analysis",
        authors: ["Author 17", "Author 18", "Author 19"],
        journal: "Renewable Energy Journal",
        year: 2023,
        abstract: "This paper provides a comprehensive analysis of the latest advancements in renewable energy technologies, including solar, wind, and hydroelectric power. We discuss the challenges of integrating these technologies into existing energy systems and propose innovative solutions to enhance their efficiency and scalability.",
        keywords: [
            "Renewable Energy",
            "Solar Power",
            "Wind Power",
            "Hydroelectric Power",
            "Energy Efficiency",
            "Sustainability",
            "Innovative Solutions",
        ],
        link: "https://example.com/paper6",
        color: "hsl(60, 70%, 60%)", // 黄色
    },
    {
        id: 7,
        title: "The Impact of Big Data on Healthcare: Opportunities and Challenges",
        authors: ["Author 20", "Author 21", "Author 22"],
        journal: "Healthcare Informatics Research",
        year: 2022,
        abstract: "This paper explores the impact of big data on healthcare, focusing on the opportunities and challenges of leveraging large datasets to improve patient outcomes. We discuss the potential applications of big data in disease prediction, personalized medicine, and healthcare management, as well as the ethical and technical challenges of implementation.",
        keywords: [
            "Big Data",
            "Healthcare",
            "Disease Prediction",
            "Personalized Medicine",
            "Healthcare Management",
            "Ethical Challenges",
            "Technical Challenges",
        ],
        link: "https://example.com/paper7",
        color: "hsl(150, 70%, 60%)", // 青色
    },
    {
        id: 8,
        title: "The Role of 5G in the Development of Smart Cities",
        authors: ["Author 23", "Author 24", "Author 25"],
        journal: "Smart Cities Journal",
        year: 2021,
        abstract: "This paper examines the role of 5G technology in the development of smart cities. We analyze the potential benefits of 5G, such as enhanced connectivity, real-time data processing, and improved infrastructure management, as well as the challenges of implementation in urban environments.",
        keywords: [
            "5G Technology",
            "Smart Cities",
            "Connectivity",
            "Real-Time Data Processing",
            "Infrastructure Management",
            "Urban Development",
            "Challenges",
        ],
        link: "https://example.com/paper8",
        color: "hsl(300, 70%, 60%)", // 粉色
    },
    {
        id: 9,
        title: "The Future of Autonomous Vehicles: Technological and Ethical Considerations",
        authors: ["Author 26", "Author 27", "Author 28"],
        journal: "Autonomous Systems Review",
        year: 2020,
        abstract: "This paper explores the future of autonomous vehicles, focusing on the technological advancements and ethical considerations of self-driving cars. We discuss the potential benefits of autonomous vehicles, such as reduced traffic accidents and improved mobility, as well as the ethical dilemmas and regulatory challenges of widespread adoption.",
        keywords: [
            "Autonomous Vehicles",
            "Self-Driving Cars",
            "Technological Advancements",
            "Ethical Considerations",
            "Traffic Safety",
            "Mobility",
            "Regulatory Challenges",
        ],
        link: "https://example.com/paper9",
        color: "hsl(180, 70%, 60%)", // 青色
    },
    {
        id: 10,
        title: "The Role of Artificial Intelligence in Financial Markets",
        authors: ["Author 29", "Author 30", "Author 31"],
        journal: "Journal of Financial Technology",
        year: 2024,
        abstract: "This paper examines the role of artificial intelligence in financial markets, focusing on the applications of AI in trading, risk management, and fraud detection. We discuss the potential benefits of AI, such as increased efficiency and accuracy, as well as the challenges of implementation and regulation.",
        keywords: [
            "Artificial Intelligence",
            "Financial Markets",
            "Trading",
            "Risk Management",
            "Fraud Detection",
            "Efficiency",
            "Regulation",
        ],
        link: "https://example.com/paper10",
        color: "hsl(240, 70%, 60%)", // 蓝色
    },
];