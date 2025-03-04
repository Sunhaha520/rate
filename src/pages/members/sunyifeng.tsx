import React from 'react'; // 确保导入 React
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div style={styles.container}>
      <Head>
        <title>Yifeng SUN&apos;s Personal Homepage</title>
        <meta name="description" content="Yifeng SUN&apos;s Personal Homepage" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main style={styles.main}>
        {/* 第一部分：照片和介绍 */}
        <section style={styles.intro}>
          <div style={styles.profileImage}>
            <Image
              src="/people/sunyifeng/sunyifeng.webp" // 替换为你的照片路径
              alt="个人照片"
              width={150}
              height={150}
              style={styles.profileImage}
            />
          </div>
          <div style={styles.profileInfo}>
            <h1 style={styles.title}>Yifeng SUN</h1>
            <p style={styles.description}>
              I am a master student in the Department of Civil and Environmental Engineering at the Faculty of Science and Technology, University of Macau. I am deeply interested in innovative technologies in digitization and automation, such as generative design, deep learning, synthetic data generation, and 3D reconstruction.
            </p>
          </div>
        </section>

        {/* 第二部分：研究方向 */}
        <section style={styles.researchDirections}>
          <h2 style={styles.sectionTitle}>Research Directions</h2>
          <ul style={styles.researchDirectionsList}>
            <li>Generative design of architectural floor plans</li>
            <li>Object detection and transfer learning with deep learning</li>
            <li>Generation of synthetic datasets using virtual environments</li>
            <li>Geographic Information Systems (GIS) in engineering management</li>
          </ul>
        </section>

        {/* 第三部分：教育背景 */}
        <section style={styles.education}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <div style={styles.educationList}>
            {/* 学历 1 */}
            <div style={styles.educationItem}>
              <div style={styles.educationLogo}>
                <Image
                  src="/people/sunyifeng/um.webp" // 替换为澳门大学的校徽路径
                  alt="University of Macau Logo"
                  width={50}
                  height={50}
                  style={styles.educationLogo}
                />
              </div>
              <div style={styles.educationInfo}>
                <h3 style={styles.educationTitle}>M.Sc. in Civil Engineering</h3>
                <p style={styles.educationDescription}>
                  <a
                    href="https://www.um.edu.mo" // 澳门大学官网链接
                    target="_blank"
                    rel="noopener noreferrer" // 修复 rel 属性
                    style={styles.link}
                  >
                    University of Macau
                  </a>, Macau, China, 2023 - Present
                </p>
              </div>
            </div>

            {/* 学历 2 */}
            <div style={styles.educationItem}>
              <div style={styles.educationLogo}>
                <Image
                  src="/people/sunyifeng/qd.webp" // 替换为青岛理工大学的校徽路径
                  alt="Qingdao University of Technology Logo"
                  width={50}
                  height={50}
                  style={styles.educationLogo}
                />
              </div>
              <div style={styles.educationInfo}>
                <h3 style={styles.educationTitle}>B.Sc. in Civil Engineering</h3>
                <p style={styles.educationDescription}>
                  <a
                    href="https://www.qut.edu.cn" // 青岛理工大学官网链接
                    target="_blank"
                    rel="noopener noreferrer" // 修复 rel 属性
                    style={styles.link}
                  >
                    Qingdao University of Technology
                  </a>, Qingdao, China, 2017 - 2021
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 第四部分：最新研究 */}
        <section style={styles.research}>
          <h2 style={styles.sectionTitle}>Selected Latest Research</h2>
          <div style={styles.researchCardList}>
            {/* 研究 1 */}
            <div style={styles.researchItem}>
              <div style={styles.researchImage}>
                <Image
                  src="/people/sunyifeng/syf1.webp" // 替换为研究图片路径
                  alt="Research Image"
                  width={400}
                  height={200}
                  style={styles.researchImage}
                />
              </div>
              <div style={styles.researchInfo}>
                <h3 style={styles.researchTitle}>Integrating deep learning and real-time GNSS localization for GIS-based traffic sign management.</h3>
                <p style={styles.researchAuthor}>Sun, Y., Zhao, H., Lam, C. C., Wong, M. O., Liang, H., & Kou, K. P.</p>
                <p style={styles.researchDescription}>
                  This study proposes an efficient and highly automated method for traffic sign management by leveraging deep learning, global navigation satellite systems, and geographic information systems. A mobile application is developed to collect sign images and geolocations simultaneously. A YOLOv8 model, through pretraining and transfer learning, is utilized to detect the types of traffic signs, and the results are combined with the geolocations to create a digital map for visualizing the traffic sign distribution. The feasibility of the method is validated using real-world road scenarios, where the results indicate the average precision of sign detection is 85% and the positioning error is 9.46 meters. The proposed method drives an instrumental solution for efficient traffic sign asset management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// 样式直接嵌入在页面中
const styles = {
  container: {
    minHeight: '100vh',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  main: {
    padding: '2rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '800px',
    width: '100%',
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  profileImage: {
    borderRadius: '50%',
  },
  profileInfo: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
  },
  description: {
    margin: '0.5rem 0',
    fontSize: '1.2rem',
    color: '#666',
  },
  researchDirections: {
    width: '100%',
    marginBottom: '2rem',
  },
  researchDirectionsList: {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
  },
  education: {
    width: '100%',
    marginBottom: '2rem',
  },
  educationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  educationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  educationLogo: {
    borderRadius: '50%',
  },
  educationInfo: {
    flex: 1,
  },
  educationTitle: {
    margin: 0,
    fontSize: '1.2rem',
  },
  educationDescription: {
    margin: '0.5rem 0',
    fontSize: '1rem',
    color: '#666',
  },
  research: {
    width: '100%',
  },
  researchCardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  researchItem: {
    display: 'flex',
    flexDirection: 'column', // 默认手机端上图下文字
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    border: '1px solid #ddd', // 边框
    borderRadius: '8px', // 圆角
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 阴影
  },
  researchImage: {
    borderRadius: '8px',
  },
  researchInfo: {
    flex: 1,
    textAlign: 'center', // 手机端文字居中
  },
  researchTitle: {
    margin: 0,
    fontSize: '1.2rem',
  },
  researchAuthor: {
    margin: '0.5rem 0',
    fontSize: '1rem',
    color: '#666',
  },
  researchDescription: {
    margin: '0.5rem 0',
    fontSize: '1rem',
    color: '#666',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  link: {
    color: '#0070f3', // 链接颜色
    textDecoration: 'none', // 去掉下划线
    fontWeight: 'bold', // 加粗
  },
  '@media (min-width: 768px)': {
    intro: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: '2rem',
    },
    educationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'left',
    },
    researchItem: {
      flexDirection: 'row', // 电脑端左图右文字
      alignItems: 'flex-start',
      textAlign: 'left',
    },
    researchInfo: {
      textAlign: 'left', // 电脑端文字左对齐
    },
  },
} as const; // 使用 `as const` 确保类型推断正确