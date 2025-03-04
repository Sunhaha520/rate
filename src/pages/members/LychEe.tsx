import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div style={styles.container}>
      <Head>
        <title>LychEe&apos;s Personal Homepage</title>
        <meta name="description" content="LychEe&apos;s Personal Homepage" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main style={styles.main}>
        {/* 第一部分：照片和介绍 */}
        <section style={styles.intro}>
          <div style={styles.profileImage}>
            <Image
              src="/people/lengxinzi/lengxinzi.webp" // 替换为你的照片路径
              alt="个人照片"
              width={150}
              height={150}
              style={styles.profileImage}
            />
          </div>
          <div style={styles.profileInfo}>
            <h1 style={styles.title}>Xinzi LENG (LychEe)</h1>
            <p style={styles.description}>
              It&apos;s LychEe here, a cross-border practitioner who is keen on exploring technology and management. Currently, I am focusing on the integration of technological innovation and management practice, especially in the application of reinforcement learning technology in prefabricated construction management.
            </p>
          </div>
        </section>

        {/* 第二部分：学历背景 */}
        <section style={styles.education}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <div style={styles.educationList}>
            {/* 学历 1 */}
            <div style={styles.educationItem}>
              <div style={styles.educationLogo}>
                <Image
                  src="/people/lengxinzi/um.webp" // 替换为澳门大学的校徽路径
                  alt="University of Macau Logo"
                  width={50}
                  height={50}
                  style={styles.educationLogo}
                />
              </div>
              <div style={styles.educationInfo}>
                <h3 style={styles.educationTitle}>M.Sc. in Construction Project Management</h3>
                <p style={styles.educationDescription}>
                  <a
                    href="https://www.um.edu.mo" // 澳门大学官网链接
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    University of Macau
                  </a>, Macau, China
                </p>
              </div>
            </div>

            {/* 学历 2 */}
            <div style={styles.educationItem}>
              <div style={styles.educationLogo}>
                <Image
                  src="/people/lengxinzi/xa.webp" // 替换为西安建筑科技大学的校徽路径
                  alt="Xi&apos;an University of Architecture and Technology Logo"
                  width={50}
                  height={50}
                  style={styles.educationLogo}
                />
              </div>
              <div style={styles.educationInfo}>
                <h3 style={styles.educationTitle}>B.Sc. in Architecture</h3>
                <p style={styles.educationDescription}>
                  <a
                    href="https://www.xauat.edu.cn" // 西安建筑科技大学官网链接
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    Xi&apos;an University of Architecture and Technology
                  </a>, China
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 第三部分：项目 */}
        <section style={styles.projects}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          <div style={styles.projectList}>
            {/* 项目 1 */}
            <div style={styles.projectItem}>
              <h3 style={styles.projectTitle}>Supply chain management optimization for prefabricated construction using multi-agent reinforcement learning</h3>
              <p style={styles.projectTime}>Since 2024.11</p>
              <p style={styles.projectDescription}>
                Explores the use of multi-agent reinforcement learning techniques to optimize the management of prefabricated construction supply chains, aiming to improve process efficiency and reduce costs. It also highlights the potential of these advanced algorithms to improve decision-making and coordination among various supply chain stakeholders.
              </p>
            </div>

            {/* 项目 2 */}
            <div style={styles.projectItem}>
              <h3 style={styles.projectTitle}>Smart Supply Chain Management System - Integrated WMS Optimization Platform (WMS+)</h3>
              <p style={styles.projectTime}>Since 2025.01</p>
              <p style={styles.projectDescription}>
                Lead a comprehensive supply chain management system construction project integrating ERP, WMS, and OMS, and was fully responsible for the preparation of the product requirement document (PRD) and the development of key modules. The system functions, operating procedures, and technical specifications were elaborated in detail to ensure the clarity of the project goals. Developed an inventory automation management module to achieve seamless integration of order processing and warehousing operations, significantly improving logistics operation efficiency.
              </p>
            </div>

            {/* 项目 3 */}
            <div style={styles.projectItem}>
              <h3 style={styles.projectTitle}>A Machine Learning-based Prediction Model for Embodied Carbon Emissions (Digital Future Camping of Tongji University)</h3>
              <p style={styles.projectTime}>2024.07</p>
              <p style={styles.projectDescription}>
                Achieves a systematic upgrade of building embodied carbon measurement through a fully coded technology stack: first, a Dynamo-Revit data bridging script is developed based on Python to automatically extract 12-dimensional feature data such as building geometric parameters (height, perimeter), structural selection codes, and seismic resistance levels in the BIM model and construct a structured data set; then, a random forest regression model is built using the Scikit-learn framework to analyze the impact weights of different factors on carbon emissions, and key decision variables are visualized through feature importance sorting. The technical closed loop realizes the automation of BIM data flow to the management of the entire project cycle, promoting the transformation of embodied carbon management from experience-driven to data intelligence-driven.
              </p>
            </div>

            {/* 项目 4 */}
            <div style={styles.projectItem}>
              <h3 style={styles.projectTitle}>The Spatial Optimisation Strategy of High-speed Railway Passenger Stations Based on Green Interchange (School-level SSRT excellent project in XAUAT)</h3>
              <p style={styles.projectTime}>2021.07-2022.10</p>
              <p style={styles.projectDescription}>
                Conducted preliminary field research on 10 high-speed railway stations in China and interviewed with mentors. Participated in and wrote a paper named &quot;The Spatial Optimisation Strategy of High-speed Railway Passenger Stations Based on Green Interchange&quot;. Established the framework of the research project and investigated the layout strategies and organizations of waiting halls and ticket offices of high-speed railway stations. Analyzed the existing problems and proposed corresponding suggestions. Used SPSS software to conduct the questionnaire reliability analysis based on 871 questionnaires from the survey, and mined and analyzed the concentrated problems in the questionnaire.
              </p>
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
  projects: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  projectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  projectItem: {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  projectTitle: {
    margin: 0,
    fontSize: '1.2rem',
  },
  projectTime: {
    margin: '0.5rem 0',
    fontSize: '1rem',
    color: '#666',
  },
  projectDescription: {
    margin: '0.5rem 0',
    fontSize: '1rem',
    color: '#666',
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
    projectItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      textAlign: 'left',
    },
  },
} as const; // 使用 `as const` 确保类型推断正确