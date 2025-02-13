export interface Project {
    id: number;
    name: string;
    members: string[];
    startYear: string;
    endYear: string;
    fundingInstitution: string;
    projectType: string;
    projectCategory: 'Active projects' | 'Past projects';
}

export const projects: Project[] = [
    {
        id: 1,
        name: "Digital Twinning for Intelligent Fire Safety Management of Heritage Buildings",
        members: ["Wong, M. O.", "Lam, C. C.", "Pan, M.", "Qiao, Y."],
        startYear: "2024",
        endYear: "2026",
        fundingInstitution: "The Science and Technology Development Fund, Macao S.A.R (FDCT) - Scientific Research and Innovation",
        projectType: "Research",
        projectCategory: 'Active projects'
    },
    {
        id: 2,
        name: "Research and Application of AI-driven Road Damage Inspection",
        members: ["Wong, M. O.", "Lam, C. C.", "Yin, M.", "Ho, M. H.", "Jun, Y."],
        startYear: "2024",
        endYear: "2026",
        fundingInstitution: "The Science and Technology Development Fund, Macao S.A.R (FDCT) - Innovation and Technology Promotion",
        projectType: "Research",
        projectCategory: 'Active projects'
    },
    {
        id: 3,
        name: "Economic Feasibility Analysis of Hengqin-Macau Wharf Project",
        members: ["Zhou, W.", "Pan, M.", "Wong, M. O.", "Chen, T.", "Zhong, H."],
        startYear: "2023",
        endYear: "2023",
        fundingInstitution: "Hengqin Government Project",
        projectType: "Research",
        projectCategory: 'Past projects'
    },
    {
        id: 4,
        name: "Multi - user voice - driven BIM - related navigation system for fire emergency response",
        members: ["Zhou, H.", "Wong, M. O.", "Ying, H.", "Ye, Y.", "Feng, Z.", "Jiang, L."],
        startYear: "2018",
        endYear: "2019",
        fundingInstitution: "Universitas 21 Graduate Collaborative Research Awards",
        projectType: "Research",
        projectCategory: 'Past projects'
    }
    // 可以添加更多项目...
];
