export interface Paper {
    id: number;
    title: string;
    authors: string[];
    journal: string;
    year: number;
    link: string;
}

export const papers: Paper[] = [
    {
        id: 1,
        title: "Semantics-based connectivity graph for indoor pathfinding powered by IFC-Graph.",
        authors: ["Zhu., J.", "Wong, M. O.", "Nisbet, N.", "Xu, J.", "Kelly, T.", "Zlatanova, S.", "Brilakis, I."],
        journal: "Automation in Construction",
        year: 2025,
        link: "https://doi.org/10.1016/j.autcon.2025.106019"
    },
    {
        id: 2,
        title: "Information requirement analysis for establishing intelligent natural language query interfaces in BIM-based construction projects.",
        authors: ["Yin, M.", "Wu, Z.", "Li, H.", "Wong, M. O.", "Tang, L.", "Tang, S.", "Zhu, J."],
        journal: "Journal of Intelligent Construction",
        year: 2025,
        link: "https://doi.org/10.26599/JIC.2025.9180084"
    },
    {
        id: 3,
        title: "Understanding workers’ acceptance of robotics in construction.",
        authors: ["Zhang, Z.", "Meng, F.", "Wong, M. O.", "Pan, M."],
        journal: "6th International Conference on Civil and Building Engineering Informatics (ICCBEI 2025), Hong Kong, China.",
        year: 2025,
        link: "https://iccbei2025.hkust.edu.hk/ICCBEI_2025%20Proceedings.pdf"
    },
    {
        id: 4,
        title: "Semantic 3D reconstruction-oriented image dataset for building component segmentation.",
        authors: ["Wong, M. O.", "Ying, H.", "Yin, M.", "Yi, X.", "Xiao, L.", "Duan, W.", "He, C.", "Tang, L."],
        journal: "Automation in Construction",
        year: 2024,
        link: " https://doi.org/10.1016/j.autcon.2024.105558"
    },
    {
        id: 5,
        title: "Multiuser Virtual Reality-Enabled Collaborative Heavy Lift Planning in Construction.",
        authors: ["Wong, M. O.", "Zhang, Z.", "Pan, W."],
        journal: "ASCE Journal of Construction Engineering and Management",
        year: 2024,
        link: "https://doi.org/10.1061/JCEMD4.COENG-14102"
    },
    {
        id: 6,
        title: "Integrating extended reality and robotics in construction: A critical review.",
        authors: ["Pan, M.", "Wong, M. O.", "Lam, C. C.", "Pan, W."],
        journal: "Advanced Engineering Informatics",
        year: 2024,
        link: "https://doi.org/10.1016/j.aei.2024.102795"
    },
    {
        id: 7,
        title: "A Framework of Integrating HBIM and GIS for Automated Fire Risk Assessment of Heritage Buildings.",
        authors: ["Qiao, Y.", "Lam, C. C.", "Wong, M. O.", "Xu, Y. "],
        journal: "41st International Symposium on Automation and Robotics in Construction (ISARC 2024), Lille, France.",
        year: 2024,
        link: "https://doi.org/10.22260/ISARC2024/0093"
    },
    {
        id: 8,
        title: "Integrating deep learning and real-time GNSS localization for GIS-based traffic sign management.",
        authors: ["Sun, Y.", "Zhao, H.", "Lam, C. C.", "Wong, M. O.", "Liang, H.", "Kou, K. P."],
        journal: "2024 ASCE International Conference on Computing in Civil Engineering (I3CE 2024), Pittsburgh, United States. (In press)",
        year: 2024,
        link: ""
    },
    {
        id: 9,
        title: "The Future of Autonomous Vehicles: Technological and Ethical Considerations",
        authors: ["Ho, M. H.", "Lam, C. C.", "Wong, M. O.", "Yin, X."],
        journal: "2024 International Conference on Construction Applications of Virtual Reality (CONVR2024), Sydney, Australia.",
        year: 2024,
        link: ""
    },
    {
        id: 10,
        title: "Indoor navigation and information sharing for collaborative fire emergency response with BIM and multi-user networking.",
        authors: ["Wong, M. O.", "Lee. S."],
        journal: "Automation in Construction",
        year: 2023,
        link: "https://doi.org/10.1016/j.autcon.2023.104781"
    },
    {
        id: 11,
        title: "How does VR differ from renderings in human perception of office layout design? A quantitative evaluation of a full-scale immersive VR.",
        authors: ["Wong, M. O.", "Zheng, Z.", "Liang, H.", "Du, J.", "Zhou, S.", "Lee. S."],
        journal: "Journal of Environmental Psychology",
        year: 2023,
        link: "https://doi.org/10.1016/j.jenvp.2023.102043"
    },
    {
        id: 12,
        title: "Virtual reality enhanced multi-role collaboration in crane-lift training for modular construction.",
        authors: ["Zheng, Z.", "Wong, M. O.", "Pan, W."],
        journal: "Automation in Construction",
        year: 2023,
        link: "https://doi.org/10.1016/j.autcon.2023.104848"
    },
    {
        id: 13,
        title: "A GIS-based framework of fire risk assessment and emergency route planning for heritage buildings.",
        authors: ["Qiao, Y.", "Lam, C. C.", "Wong. M. O."],
        journal: "28th International Symposium on Advancement of Construction Management and Real Estate (CRIOCM 2023), Nanjing, China. ",
        year: 2023,
        link: "https://doi.org/10.1007/978-981-97-1949-5_120"
    },
    {
        id: 14,
        title: "IFC-based information exchange for multi-agency response to indoor fire emergencies.",
        authors: ["Wong, M. O.", "Lee. S."],
        journal: "Automation in Construction",
        year: 2022,
        link: "https://doi.org/10.1016/j.autcon.2022.104623"
    },
    {
        id: 15,
        title: "A voice-driven IMU-enabled BIM-based multi-user system for indoor navigation in fire emergencies.",
        authors: ["Wong, M. O.", "Zhou, H.", "Ying, H.", "Lee. S."],
        journal: "Automation in Construction",
        year: 2022,
        link: "https://doi.org/10.1016/j.autcon.2022.104137"
    },
    {
        id: 16,
        title: "Crane Lift Coordination using Building Information Modeling and Multi-User Augmented Reality.",
        authors: ["Wong, M. O.", "Zhang, Z.", "Pan, W."],
        journal: "2022 International Conference on Construction Applications of Virtual Reality (CONVR2022), Seoul, Korea.",
        year: 2022,
        link: "https://drive.google.com/file/d/19N4OdN-Ul386fzOLjwZUDa01ApvEgMQh/view"
    },
    {
        id: 17,
        title: "Interactive Agent-based Simulation for Multi-crane Lift Planning in Modular Construction.",
        authors: ["Zhang, Z.", "Wong, M. O.", "Pan, W."],
        journal: "2022 International Conference on Construction Applications of Virtual Reality (CONVR2022), Seoul, Korea.",
        year: 2022,
        link: "https://drive.google.com/file/d/19N4OdN-Ul386fzOLjwZUDa01ApvEgMQh/view"
    },
    {
        id: 18,
        title: "A technical review on developing BIM-oriented indoor route planning.",
        authors: ["Wong, M. O.", "Lee. S."],
        journal: "Computing in Civil Engineering 2019",
        year: 2019,
        link: "http://ascelibrary.org/doi/10.1061/9780784482421.043"
    },
    {
        id: 19,
        title: "An experience-based spatial design framework using VR technology: a case study of designing an office layout.",
        authors: ["Wong, M. O.", "Du, J.", " Liang, H.", "Zhang, Z.", "Zheng, Z.", "Zhou, S.", "Feng, Q.", "Lee. S."],
        journal: "2019 CSCE-CRC Annual Conference",
        year: 2019,
        link: "https://www.researchgate.net/profile/Haoyang-Liang/publication/355173064_An_experience-based_spatial_design_framework_using_VR_technology_a_case_study_of_designing_an_office_layout/links/616417e71eb5da761e7a10ea/An-experience-based-spatial-design-framework-using-VR-technology-a-case-study-of-designing-an-office-layout.pdf?origin=publication_detail&_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6InByb2ZpbGUiLCJwYWdlIjoicHVibGljYXRpb25Eb3dubG9hZCIsInByZXZpb3VzUGFnZSI6InB1YmxpY2F0aW9uIn19"
    },
    {
        id: 20,
        title: "An experience-based interactive lighting design approach using BIM and VR: a case study.",
        authors: ["Wong, M. O.", "Du, J.", "Zhang, Z. Q.", "Liu, Y. Q.", "Chen, S. M.", "Lee. S."],
        journal: "2019 CSCE-CRC Annual Conference",
        year: 2019,
        link: "https://iopscience.iop.org/article/10.1088/1755-1315/238/1/012006/pdf"
    },
    {
        id: 21,
        title: "A framework of a multi-user voice-driven BIM-based navigation system for fire emergency response.",
        authors: ["Zhou, H.", "Wong, M. O.", "Ying, H.", "Lee. S."],
        journal: "CEUR Workshop Proceedings",
        year: 2019,
        link: "http://ceur-ws.org/Vol-2394/paper25.pdf"
    }
];
