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
        title: "Semantics-based connectivity graph for indoor pathfinding powered by IFC-Graph.",
        authors: ["Zhu., J.", "Wong, M. O.", "Nisbet, N.", "Xu, J.","Kelly, T."," Zlatanova, S.","Brilakis, I."],
        journal: " Automation in Construction",
        year: 2025,
        abstract: "Pathfinding is important for many indoor location-based applications such as facility management and indoor navigation. Conventional approaches for constructing indoor networks for pathfinding are mostly based on geometry processing, which can be computing-intensive and time-consuming, especially for buildings with complex irregular shapes. In addition, the generated geometric networks often lack semantics. This paper proposes a new semantics-based approach for constructing navigable indoor networks. This approach uses the rich semantic information from Industry Foundation Classes (IFC) in the form of IFC-Graph (i.e., a graph-based representation of building information developed in a prior study) so as to meet the needs of indoor pathfinding. Real-world building models are used to validate the proposed approach. The results show that 1) the semantics-based approach has advantages in object-to-object pathfinding such as space-to-space, space-to-exit, and space-to-facility, 2) the use of graph technology makes it flexible to add semantic information to the network to better support pathfinding applications. The semantics-based approach can fit into digital twin technology and integrate with augmented reality.",
        keywords: [
            "Indoor Navigation and Pathfinding",
            "Labelled Property Graph (LPG)",
            "Labelled Property Graph (LPG)",
            "Building Information Modeling (BIM)",
            "Industry Foundation Classes (IFC)",
            "Geographic Information System (GIS)",
            "Digital Twin (DT)",
        ],
        link: "https://doi.org/10.1016/j.autcon.2025.106019",
        color: "hsl(210, 70%, 60%)", // 蓝色
    },
    {
        id: 2,
        title: "Information requirement analysis for establishing intelligent natural language query interfaces in BIM-based construction projects.",
        authors: ["Yin, M.", "Wu, Z.", "Li, H.","Wong, M. O.","Tang, L.","Tang, S.","Zhu, J."],
        journal: "Journal of Intelligent Construction",
        year: 2025,
        abstract: "Emerging artificial intelligence (AI)-based natural language interface (NLI) systems show significant potential for enabling stakeholders to efficiently retrieve complicated building information models (BIM). Previous studies have shown many technical pathways, but they have not investigated which information entities in complex BIM schemas and constraint types were most important for NLI-based data querying. This study investigates the information requirements for NLI-based BIM model retrieval. It begins with a survey of existing BIM query languages (BIMQLs) and software applications to identify popular information entities and constraints. We then recruited ten practitioners to create 200 queries and analyzed them to refine the information scope (IS) for NLI applications. Finally, we tested 14 selected queries via the NLI approach and other methods, revealing the types of queries that NLIs could better manage. This study identifies the most important information entities, constraint types, question forms, and condition combinations to develop intelligent NLI systems in BIM-based construction projects. The findings lay a crucial foundation for the advancement of AI-based NLIs by offering a definite IS, which can be used to generate training datasets or prompts for large language models.",
        keywords: [
            "building information modeling",
            "natural language interface",
            "project information retrieval",
            "information requirement analysis",
            "digital construction management",
        ],
        link: "https://doi.org/10.26599/JIC.2025.9180084",
        color: "hsl(120, 70%, 60%)", // 绿色
    },
    {
        id: 3,
        title: "Understanding workers’ acceptance of robotics in construction.",
        authors: ["Zhang, Z.", "Meng, F.", "Wong, M. O.","Pan, M."],
        journal: "6th International Conference on Civil and Building Engineering Informatics (ICCBEI 2025), Hong Kong, China.",
        year: 2025,
        abstract: "Robotics is expected to enhance productivity and safety in the construction industry but real - world application remains limited; introducing it may require humans and robots to work together on tasks or closely; while much attention is on organizational - level adoption, little exploration is from construction workers' perspective; this paper aims to comprehensively understand factors influencing workers' attitudinal acceptance of construction robotics; a case study with 40 construction workers in a Guangdong - Hong Kong - Macao Greater Bay Area project (including observations and interviews) and 13 site managers (semi - structured interviews) was conducted; factors like workers' individual differences, technological performance, robot output quality, and external factors such as organizational support and social influences affecting workers' acceptance were identified; findings show most workers will passively accept construction robots when mandated by their organization though income change is a major concern; strategies for future research and practice for various stakeholders like guaranteeing workers' income, strategizing practice - based technology, improving multi - level robot interface management, and enhancing government support are recommended; this study should encourage different stakeholders to design and adopt construction robots guided by human - centered design principles.",
        keywords: [
            "Construction Robotic",
            "Worker Acceptanc",
            "Human-Centered Robotics",
            "Technology Acceptance Model,",
            "Robot Adoption",
        ],
        link: "https://iccbei2025.hkust.edu.hk/ICCBEI_2025%20Proceedings.pdf",
        color: "hsl(30, 70%, 60%)", // 橙色
    },
    {
        id: 4,
        title: "Semantic 3D reconstruction-oriented image dataset for building component segmentation.",
        authors: ["Wong, M. O.", "Ying, H.", "Yin, M.","Yi, X.","Xiao, L.","Duan, W.","He, C.","Tang, L."],
        journal: "Automation in Construction",
        year: 2024,
        abstract: "In image-driven 3D building reconstruction, instance segmentation is fundamental to pixel-wise building component detection, which can be fused with 3D data like point clouds and meshes via camera projection for semantic reconstruction. While deep learning-based segmentation has obtained promising results, it relies heavily on large-scale datasets for training. Unfortunately, existing large-scale image datasets often include irrelevant objects that obstruct building components, making them unsuitable for 3D building reconstruction. This paper addresses this gap by introducing a large-scale building image dataset to facilitate building component segmentation for 3D reconstruction. The dataset comprises 3378 images captured from both interiors and exteriors of 36 university buildings, annotated with 49,380 object instances across 11 classes. Rigorous quality control measures were employed during data collection and annotation. Evaluation of five typical deep learning-based instance segmentation models demonstrates the dataset's suitability for training and its value as a benchmark dataset for building component segmentation.",
        keywords: [
            "Building image dataset",
            "Building component segmentation",
            "Instance segmentation",
            "Deep learning",
            "Building Information Modeling (BIM)",
            "3D reconstruction",
        ],
        link: " https://doi.org/10.1016/j.autcon.2024.105558",
        color: "hsl(270, 70%, 60%)", // 紫色
    },
    {
        id: 5,
        title: "Multiuser Virtual Reality-Enabled Collaborative Heavy Lift Planning in Construction.",
        authors: ["Wong, M. O.", "Zhang, Z.", "Pan, W."],
        journal: "ASCE Journal of Construction Engineering and Management",
        year: 2024,
        abstract: "Crane-lift planning is critical but challenging to ensure construction safety and efficiency for the installation of heavy components. It engages a group decision-making process that involves various stakeholders to exchange knowledge of crane capabilities, site characteristics, and operational feasibility. However, conventional planning methods based on drawings, animations, and standalone virtual prototypes are inefficient in enabling collaborative decision-making due to rigid visualization and inflexible interactions among different stakeholders. This paper aims to develop a collaborative heavy lift planning (Co-HeLP) system that engages crane suppliers, site managers, and crane operators in an immersive and shared environment for crane layout optimization and lifting simulation. Specifically, the system incorporates a multiuser networking unit to enable stakeholders to design crane-lift layouts concurrently and synchronize changes in real time for facilitating information-sharing and collaborative planning. In addition, a cross-platform virtual reality (VR) unit is developed to provide stakeholders with role-tailored interactions of crane allocation and first-person operation. Automatic feasibility checking is also formulated to assist stakeholders in appraising jib reach limits and loading capacities more efficiently. The system is demonstrated using a real-life modular building project that involves the installation of multiple bulky modules. To evaluate the system, two groups of industry practitioners from crane suppliers and main contractors conducted heavy lift planning using Co-HeLP, where their responses were collected using questionnaire-based surveys and interviews. Results show that the system is rated highly on automatability (0.77/1), collectiveness (0.81/1), and applicability (0.85/1), with the advantages of full-scale visualization and multirole interactions. This paper opens up new possibilities for stakeholders to jointly manage crane-lift constraints and build consensus on layout plans through a mutually interactive and role-independent shared environment. More broadly, the paper derives a generic multiuser VR mechanism to address fragmented coordination and inefficient knowledge transfer, thereby facilitating collective planning and management in construction.",
        keywords: [
            "Heavy lifting",
            "Crane-lift planning",
            "Virtual reality (VR)",
            "Multiuser collaboration",
            "Human–computer interaction",
            "Modular integrated construction",
        ],
        link: "https://doi.org/10.1061/JCEMD4.COENG-14102",
        color: "hsl(0, 70%, 60%)", // 红色
    },
    {
        id: 6,
        title: "Integrating extended reality and robotics in construction: A critical review.",
        authors: ["Pan, M.", "Wong, M. O.", "Lam, C. C.","Pan, W."],
        journal: "Advanced Engineering Informatics",
        year: 2024,
        abstract: "The rapid development of extended reality (XR), including virtual and augmented reality, offers promising solutions to mediate human-robot interactions and support robotic construction in various forms. However, there is still a lack of systematic analysis of how emerging XR technologies and robotics could be effectively integrated to achieve mutual benefits and improve overall construction performance. This paper aims to critically review the existing literature on the integration of XR and robotics in construction based on a framework integrating the concept, methodology, and value dimensions, and to identify promising areas for future research in order to unleash the power of XR and robotics in construction. The paper offers a comprehensive understanding of what, how and why XR and robots are integrated in construction. In particular, the review critically analyzes the technology characteristics of XR and robotics, the integration pattern and modalities among humans, XR, and robots, and the multifaceted purposes and benefits in construction. The review indicates that VR is primarily used for simulation, training and teleoperation of robots in construction applications, while AR is implemented to provide additional information to humans for better interaction with robots and environments. The involvement of robots is generally industrial robots or mobile robots, with few studies considering specific construction robots in real-life scenarios. The findings point future directions for research to leverage XR for construction robot development and enhance XR-empowered human-robot collaboration. The review contributes to a new typology for XR-robot integration in construction and provides useful implications for researchers, practitioners, and policymakers in integrating robotics and XR to accelerate construction digitalization.",
        keywords: [
            "Virtual reality",
            "Augmented reality",
            "Extended reality",
            "Construction robotics",
            "Human-robot interaction",
            "Human-robot collaboration",
        ],
        link: "https://doi.org/10.1016/j.aei.2024.102795",
        color: "hsl(60, 70%, 60%)", // 黄色
    },
    {
        id: 7,
        title: "A Framework of Integrating HBIM and GIS for Automated Fire Risk Assessment of Heritage Buildings.",
        authors: ["Qiao, Y.", "Lam, C. C.", "Wong, M. O.","Xu, Y. "],
        journal: "41st International Symposium on Automation and Robotics in Construction (ISARC 2024), Lille, France.",
        year: 2024,
        abstract: "Historic buildings face multi-faceted fire risks that threaten their conservation. A comprehensive fire risk assessment is essential to prevent fires and protect cultural heritage. Conventional practices rely on surveys and site visits, which are inefficient in capturing up-to-date information digitally and analyzing the risk levels quantitatively. This paper proposes a framework integrating Historic Building Information Models (HBIM) and Geographic Information Systems (GIS) to enable automated, data-driven fire risk assessment of historic buildings. The framework consists of two key phases: quantitative fire risk modeling and automated risk assessment. The risk modeling defines unified indicators in accordance with fire safety regulations to quantify the risks exposed to the heritage buildings internally and externally. Both inherent building characteristics (e.g. fire resistance rating) and external spatial characteristics (e.g. adjacent access and spatial separation) were assessed. Next, the automated assessment utilizes HBIM and GIS to extract building and surrounding area information, compute the quantitative risks, and develop an interactive visualization platform to facilitate stakeholders in decision-making. The feasibility of this framework is verified through a case study of Mandarins House in Macau. The results indicated the framework is capable of quantifying the risk related to fire-resistant materials (0.66), external access (0.75) and separation (0.76). The results demonstrate that the proposed framework could contribute a unified fire risk model quantification method and a BIM and GIS-combined mechanism for automated risk assessment to support the proactive conservation of valuable cultural heritage assets. ",
        keywords: [
            "Historic Building Information Modeling (HBIM)",
            "Geographic Information System (GIS)",
            "Fire Risk Assessment",
            "Heritage Building",
        ],
        link: "https://doi.org/10.22260/ISARC2024/0093",
        color: "hsl(150, 70%, 60%)", // 青色
    },
    {
        id: 8,
        title: "Integrating deep learning and real-time GNSS localization for GIS-based traffic sign management.",
        authors: ["Sun, Y.", "Zhao, H.", "Lam, C. C.","Wong, M. O.","Liang, H.","Kou, K. P."],
        journal: "2024 ASCE International Conference on Computing in Civil Engineering (I3CE 2024), Pittsburgh, United States. (In press)",
        year: 2024,
        abstract: "",
        keywords: [
        ],
        link: "",
        color: "hsl(300, 70%, 60%)", // 粉色
    },
    {
        id: 9,
        title: "The Future of Autonomous Vehicles: Technological and Ethical Considerations",
        authors: ["Ho, M. H.", "Lam, C. C.", "Wong, M. O.","Yin, X."],
        journal: "2024 International Conference on Construction Applications of Virtual Reality (CONVR2024), Sydney, Australia.",
        year: 2024,
        abstract: "",
        keywords: [
        ],
        link: "",
        color: "hsl(180, 70%, 60%)", // 青色
    },
    {
        id: 10,
        title: "Indoor navigation and information sharing for collaborative fire emergency response with BIM and multi-user networking.",
        authors: ["Wong, M. O.", "Lee. S."],
        journal: "Automation in Construction",
        year: 2023,
        abstract: "Collaboration in indoor fire emergencies requires participants to share various information regarding individuals, fires, and resources. To facilitate response actions, this study develops a system to provide the necessary information, calculate route guidance for escape and rescue, track victim locations, and share resources with participants promptly. The system includes a pathfinding module using geometries of building information models, a positioning module fusing inertial sensor data and wireless signals via a particle filter, an information exchange module that delivers emergency-related properties, and an information sharing module that distributes information through a multi-user environment. Moreover, a two-stage pathfinding algorithm and a hybrid positioning approach are proposed to improve computational efficiency and localization accuracy. Through comparative evaluation, the system is validated to reduce the computational time by 89.29% and lessen the positioning error to 1.36 m. The study is expected to provide explicit insights into developing digital twins for collaborative emergency response.",
        keywords: [
            "Building information modeling (BIM)",
            "Industry foundation classes (IFC)",
            "Shortest pathfinding algorithm",
            "Multi-sensor data fusion",
            "Particle filter",
            "Indoor localization",
            "Multi-user system",
            "Information sharing",
        ],
        link: "https://doi.org/10.1016/j.autcon.2023.104781",
        color: "hsl(240, 70%, 60%)", // 蓝色
    },
];