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
    {
        id: 11,
        title: "How does VR differ from renderings in human perception of office layout design? A quantitative evaluation of a full-scale immersive VR.",
        authors: ["Wong, M. O.", "Zheng, Z.","Liang, H.","Du, J.","Zhou, S.","Lee. S."],
        journal: "Journal of Environmental Psychology",
        year: 2023,
        abstract: "Virtual reality (VR) technology provides immersive and interactive user experiences in office layout design. However, the mechanism of how VR impacts human perception in layout selections and how such mechanism differs from the traditional rendering-based exhibition remain unclear. Hence, this research proposes an experience-based full-scale immersive VR-based approach and investigates its quantitative effectiveness when conducting user-centered office layout design and evaluation. Comparative experiments (N=57) with three office designs are conducted, where subjective surveys and objective Stroop tests are utilized to statistically analyze (1) the quantitative difference in user layout satisfaction between using VR and traditional approaches in terms of psychological perceptions and environmental design features, and (2) the consistency between the layout perceptions using VR and the underlying design principles. The results reveal that the influence of VR varies from different design indicators. The significant difference in the satisfaction variation does not exist in the psychological perceptions (i.e., privacy, communication, and concentration) but does exist in the environmental design features (i.e., workspace enclosure, storage, rearrangement), probably because VR can help the end-users visualize the distinct characteristics of office layouts and further rectify their cognition when experiencing daily-life scenarios. In addition, the effectiveness of the VR approach is verified, where the layout perceptions are mostly in line with the design principles. The findings of this research are expected to extend the existing knowledge of VR-based office design and evaluation by providing quantitative evidence and analytical insight into human behaviors in user-centered layout evaluation.",
        keywords: [
            "Virtual reality",
            "Office layout evaluation",
            "Comparative experiment",
            "Quantitative analysis",
            "Stroop color and word test",
            "Open-plan office",
        ],
        link: "https://doi.org/10.1016/j.jenvp.2023.102043",
        color: "hsl(110, 70%, 60%)", 
    },
    {
        id: 12,
        title: "Virtual reality enhanced multi-role collaboration in crane-lift training for modular construction.",
        authors: ["Zheng, Z.","Wong, M. O.", "Pan, W."],
        journal: "Automation in Construction",
        year: 2023,
        abstract: "Crane lifts for bulky module installation greatly affect site safety and efficiency. However, few previous studies addressed collaborative training for a lifting crew in modular construction. Therefore, this paper aims to develop a virtual reality (VR) system for enhancing multi-role collaboration in crane-lift training. The system is developed by integrating full-, semi-, and non-immersive VR devices with role-specific functions designed for crane operators, riggers, and signalers in modular building projects. The system is objectively assessed by six groups of researchers with memory tests and proved more effective in group-based crane-lift training than the lecture-based approach, resulting in a 33% improvement in the trainees' memory stability. The system is also evaluated by the researchers and six industry practitioners who affirm that their understanding of the crane-lift process is enhanced through multi-role collaboration using the system. The developed multi-user VR system should facilitate safe and efficient delivery of modular buildings.",
        keywords: [
            "Crane-lift training",
            "Multi-role collaboration",
            "Virtual reality",
            "Multi-user system",
            "Modular construction",
        ],
        link: "https://doi.org/10.1016/j.autcon.2023.104848",
        color: "hsl(160, 70%, 60%)", 
    },
    {
        id: 13,
        title: "A GIS-based framework of fire risk assessment and emergency route planning for heritage buildings.",
        authors: ["Qiao, Y.","Lam, C. C.", "Wong. M. O."],
        journal: "28th International Symposium on Advancement of Construction Management and Real Estate (CRIOCM 2023), Nanjing, China. ",
        year: 2023,
        abstract: "This paper presents a Geographic Information Systems (GIS) based framework of fire risk assessment and emergency route planning for heritage buildings in historic centers. The framework addresses the specific challenges faced by heritage buildings, such as fragility, insufficient risk awareness, and inadequate emergency response. In the framework, potential risk factors are first identified and categorized through a literature review, forming a fundamental instrument for assessing the vulnerability of heritage buildings. Next, GIS technology is adopted to visualize the risk levels on spatial maps. Open-source route data is further collected and merged into a virtual prototyping engine to develop an emergency route simulation application. Specifically, a city-level navigable network is constructed to calculate the possible emergency routes between heritage buildings and fire stations using Dijkstra’s algorithm. The proposed framework is carried out with a case study of two heritage buildings (i.e., the Ruins of St. Paul’s and Kuan Tai Temple) in Macao, which showcases that the framework can indicate quantitative fire risk levels and optimized routes to enhance fire safety and heritage conservation.",
        keywords: [

        ],
        link: "https://doi.org/10.1007/978-981-97-1949-5_120",
        color: "hsl(60, 70%, 60%)", 
    },
    {
        id: 14,
        title: "IFC-based information exchange for multi-agency response to indoor fire emergencies.",
        authors: ["Wong, M. O.", "Lee. S."],
        journal: "Automation in Construction",
        year: 2022,
        abstract: "During fire emergencies, inadequate and inefficient information provision may delay life-saving activities. To support emergency response, this study proposes an industry foundation class (IFC) based information exchange approach for multi-agency response to indoor fire emergencies. First, information required by occupants, facility managers and firefighters is identified and examined through a literature review and questionnaire surveys. The importance and familiarity of information are then assessed to clarify information sharing and collaboration in the practice. Next, this study extends properties of IFC4 Add2 by adding emergency information to support standardized information exchange. An add-in is created to enable automated parameter processing for information enrichment. The approach is validated through a case study, where relevant properties in an IFC data model are exchanged and supplied to emergency participants in real-time to facilitate response activities. The study's findings may shed light on role-centered emergency system prototyping, data-driven emergency simulations, and collaborative fire emergency response.",
        keywords: [
            "Industry foundation classes (IFC)",
            "Information exchange",
            "Fire emergency",
            "Multi-agency response",
            "Information provision",
            "Building information modeling (BIM)",
        ],
        link: "https://doi.org/10.1016/j.autcon.2022.104623",
        color: "hsl(220, 70%, 60%)", 
    },
    {
        id: 15,
        title: "A voice-driven IMU-enabled BIM-based multi-user system for indoor navigation in fire emergencies.",
        authors: ["Wong, M. O.","Zhou, H.","Ying, H.", "Lee. S."],
        journal: "Automation in Construction",
        year: 2022,
        abstract: "Real-time location information between participants is critical but scarcely available during fire emergencies, making response operations solitary and inefficient. To address the issue, this study proposes a system that provides dynamic pathfinding, position tracking, and location sharing to on-site emergency participants via instinctive human-system interactions. The system consists of four modules, namely building information modeling-based indoor route planning, voice-based command processing, inertial sensor-based continuous positioning, and a multi-user sharing environment. The feasibility of the system is assessed by an exploratory user test with a real-world case study. The results show that the system enables participants to track and share locations with others timely and plan a route dynamically for response operations. The results further suggest that the system can potentially provide fundamental techniques to establish new mechanisms for supporting decision-making and enable comparative evaluations on adopted technologies to develop human-centered emergency response systems.",
        keywords: [
            "Building information modeling (BIM)",
            "Industry foundation classes (IFC)",
            "Inertial measurement unit (IMU)",
            "Multi-user system",
            "Fire emergency response system",
            "Dynamic route planning",
            "Indoor positioning",
            "Location sharing",
        ],
        link: "https://doi.org/10.1016/j.autcon.2022.104137",
        color: "hsl(200, 70%, 60%)", 
    },
    {
        id: 16,
        title: "Crane Lift Coordination using Building Information Modeling and Multi-User Augmented Reality.",
        authors: ["Wong, M. O.","Zhang, Z.","Pan, W."],
        journal: "2022 International Conference on Construction Applications of Virtual Reality (CONVR2022), Seoul, Korea.",
        year: 2022,
        abstract: "",
        keywords: [
            
        ],
        link: "https://drive.google.com/file/d/19N4OdN-Ul386fzOLjwZUDa01ApvEgMQh/view",
        color: "hsl(150, 70%, 60%)", 
    },
    {
        id: 17,
        title: "Interactive Agent-based Simulation for Multi-crane Lift Planning in Modular Construction.",
        authors: ["Zhang, Z.","Wong, M. O.","Pan, W."],
        journal: "2022 International Conference on Construction Applications of Virtual Reality (CONVR2022), Seoul, Korea.",
        year: 2022,
        abstract: "",
        keywords: [

        ],
        link: "https://drive.google.com/file/d/19N4OdN-Ul386fzOLjwZUDa01ApvEgMQh/view",
        color: "hsl(200, 70%, 60%)", 
    },
    {
        id: 18,
        title: "A technical review on developing BIM-oriented indoor route planning.",
        authors: ["Wong, M. O.","Lee. S."],
        journal: "Computing in Civil Engineering 2019",
        year: 2019,
        abstract: "Route planning inside buildings is critical for route optimization during daily indoor navigation and emergency response. Accurate spatial information to develop indoor route plans has become essential as buildings get bigger and more complex. Previous studies have proposed and developed different approaches to improve indoor route planning by using the building information modeling (BIM) technology as BIM can provide detailed semantic and geometric information. However, a comprehensive review of previous publications is still unavailable. This study reviews the relevant papers published from 2008 to 2018 to demonstrate the existing efforts on different stages of its development process, namely BIM preparation, navigation model generation, path-finding implementation, and applications. In addition, this study further conducts technical discussions and identifies potential research directions for future development. It is expected that from this study researchers can holistically understand the prior development trends of BIM-oriented indoor route planning and identify potential places for future work.",
        keywords: [

        ],
        link: "http://ascelibrary.org/doi/10.1061/9780784482421.043",
        color: "hsl(10, 70%, 60%)", 
    },
    {
        id: 19,
        title: "An experience-based spatial design framework using VR technology: a case study of designing an office layout.",
        authors: ["Wong, M. O.","Du, J."," Liang, H.","Zhang, Z.","Zheng, Z.","Zhou, S.","Feng, Q.", "Lee. S."],
        journal: "2019 CSCE-CRC Annual Conference",
        year: 2019,
        abstract: "Office layout design has a significant impact on the communication, concentration, and collaboration of workers, which contribute towards the overall productivity. Two-dimensional (2D) drawings with relevant renderings are commonly used as a traditional approach by architects to demonstrate spatial design plans to clients. However, the limited information provided by the 2D drawings may cause clients to misunderstand the spatial relationships and further make a wrong assessment. To address this issue, Virtual Reality (VR) technology is identified as a potential solution in virtue of its capabilities for the immersive experience and interactive design. This research then proposes an experience-based spatial design framework using VR technology, which aims to enhance the 3D visualization and participatory evaluation during the conceptual design phase. In addition, the proposed framework is able to imitate the real-life activities in the VR environment, such as finding a seat, working with computers, and communicating with co-workers, to help clients evaluate different design plans interactively. In this research, a case study of designing spatial layouts of a research student center (RSC) is conducted to implement the proposed framework. Three different spatial design plans of the RSC are developed and presented to the students in the virtual environment. To evaluate the effectiveness of the proposed framework, this research carries out a comparative experiment to compare it with the traditional approach. It is believed that this framework can promote better user experience and higher clients' participation.",
        keywords: [
        ],
        link: "https://www.researchgate.net/profile/Haoyang-Liang/publication/355173064_An_experience-based_spatial_design_framework_using_VR_technology_a_case_study_of_designing_an_office_layout/links/616417e71eb5da761e7a10ea/An-experience-based-spatial-design-framework-using-VR-technology-a-case-study-of-designing-an-office-layout.pdf?origin=publication_detail&_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6InByb2ZpbGUiLCJwYWdlIjoicHVibGljYXRpb25Eb3dubG9hZCIsInByZXZpb3VzUGFnZSI6InB1YmxpY2F0aW9uIn19",
        color: "hsl(40, 70%, 60%)", 
    },
    {
        id: 20,
        title: "An experience-based interactive lighting design approach using BIM and VR: a case study.",
        authors: ["Wong, M. O.","Du, J.","Zhang, Z. Q.","Liu, Y. Q.","Chen, S. M.", "Lee. S."],
        journal: "2019 CSCE-CRC Annual Conference",
        year: 2019,
        abstract: "A lighting condition has a significant influence on humans' concentration, performance, and eye comfort. A well-designed lighting environment is critical for work efficiency and human health. Lighting design is commonly based on designer's previous experience and computational lighting simulation results. Although simulations can provide relatively accurate calculation results, several difficulties exist in terms of measuring actual users' experience and reflecting their feedback into the design. In this traditional approach, users are unable to experience or feel realistic lighting effects until the installation phase. This lack of user experience in the design phase leads to increasing risk of redesign and revision, which are extremely time-consuming and reduce the efficiency of lighting design. Therefore, it is necessary to minimize the gap between the lighting design and users' satisfaction. This research aims to enhance visualization of lighting design and thus improve the design efficiency by developing a real-time interactive lighting design approach using building information modeling (BIM) and virtual reality (VR) technologies. By integrating these technologies, the proposed approach is able to support user interactions, actual activities simulation, and personalized lighting design. In addition, the proposed approach can provide users with immersive and sensory experiences to evaluate their lighting design alternatives. The whole process of the approach includes 3D modeling in Revit, texture mapping in 3ds Max, simulation analysis in DIALux, and interactions development and VR realization in Unity. A case study was conducted to implement and validate the proposed approach. In this case study, users were able to experience realistic lighting effects and provide their feedback for improving the design in a sensory way while lighting simulation was automatically conducted simultaneously. The approach enables better user experience and provides a practical way to apply BIM and VR technologies to improve the efficiency of real-time interactive lighting design.",
        keywords: [
        ],
        link: "https://iopscience.iop.org/article/10.1088/1755-1315/238/1/012006/pdf",
        color: "hsl(70, 70%, 60%)", 
    },
    {
        id: 21,
        title: "A framework of a multi-user voice-driven BIM-based navigation system for fire emergency response.",
        authors: ["Zhou, H.","Wong, M. O.","Ying, H.", "Lee. S."],
        journal: "CEUR Workshop Proceedings",
        year: 2019,
        abstract: "Navigation support is of significant importance for fire evacuation and rescue due to the complexity of building indoor structures and the uncertainty of fire emergency. This paper presents a framework of a multiuser voice-driven building information model (BIM)-based navigation system for fire emergency response. Classes of the navigation system is first defined being consistent with the open BIM data standard (i.e. Industry Foundation Classes, IFC). A string-matching method is then developed to generate a navigation query from each voice navigation request based on the Levenshtein distance and Burkhard and Keller (BK)-tree of a fire navigation associated lexicon. With the semantic information of the location in the navigation query, the spatial geometric information of the location is extracted from the BIM model and visibility graph-based route plans for multiple users are generated. To deliver the route planning to building users in an intuitive and direct manner, patterns of different voice prompts will be designed to automatically broadcast the navigation route step by step. Finally, the proposed navigation system will be validated with virtual reality (VR) based experiment.",
        keywords: [
        ],
        link: "http://ceur-ws.org/Vol-2394/paper25.pdf",
        color: "hsl(135, 70%, 60%)", 
    },

];