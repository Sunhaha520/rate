export interface Alumni {
    id: number;
    name: string;
    year: string; // 毕业/离开届别
    role: string; // 身份（PhD, Master, UG, RA）
    researchTopic: string; // 研究课题
    photo?: string; // 头像
    email?: string; // 邮箱
    destination?: string; // 去向公司 / 单位
    position?: string; // 现任职位
}

export const alumni: Alumni[] = [
    {
        id: 1,
        name: "Sun Zhenyu",
        year: "2024",
        role: "Master",
        researchTopic: "Advanced Machine Learning Techniques for Autonomous Vehicle Navigation",
        photo: "/people/sunzhenyu/sunzhenyu.webp",
        email: "dereksunmo@163.com",
        destination: "MANN+HUMMEL",
        position: "Procurement Digitalization Engineer-AMEA",
    }
];
