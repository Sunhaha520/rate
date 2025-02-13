// @/data/person.ts
export interface MentorInfo {
    name: string;
    bio: string;
    photo: string;
}

export interface Research {
    id: number;
    name: string;
    author: string;
    intro: string;
    photo: string;
    detailsLink: string;
}

export const mentor: MentorInfo = {
    name: 'Dr. John Doe',
    bio: 'Hi,👋 I am a Research Assistant Professor in the Department of Civil Engineering at the University of Macau. Before joining UM, I obtained my PhD degree in Construction Engineering and Management at the University of Hong Kong and my Bachelor’s degree in Civil Engineering at Shanghai Jiao Tong University. I am particularly interested in new technologies for enhancing construction collaboration, digitalization, and automation, such as building information modelling, multi-user extended reality, and computer vision-based reconstruction. Our vision is to transform the civil engineering industry into a technology-driven, interdisciplinary field dedicated to enhancing worker safety, improving project productivity, and fostering sustainable development for society.',
    photo: '/img/mowong.jpg'
};

export const researches: Research[] = [
    {
        id: 1,
        name: 'Semantic 3D reconstruction-oriented image dataset for building component segmentation',
        author: 'Wong, M.O., Ying, H., Yin, M., Yi, X., Xiao, L., He, C., & Tang, L. ',
        intro: "In image-driven 3D building reconstruction, instance segmentation is fundamental to pixel-wise building component detection, which can be fused with 3D data like point clouds and meshes via camera projection for semantic reconstruction. While deep learning-based segmentation has obtained promising results, it relies heavily on large-scale datasets for training. Unfortunately, existing large-scale image datasets often include irrelevant objects that obstruct building components, making them unsuitable for 3D building reconstruction. This paper addresses this gap by introducing a large-scale building image dataset to facilitate building component segmentation for 3D reconstruction. The dataset comprises 3378 images captured from both interiors and exteriors of 36 university buildings, annotated with 49,380 object instances across 11 classes. Rigorous quality control measures were employed during data collection and annotation. Evaluation of five typical deep learning-based instance segmentation models demonstrates the dataset's suitability for training and its value as a benchmark dataset for building component segmentation.",
        photo: '/img/topimg.webp',
        detailsLink: 'https://example.com/research1'
    }
];
