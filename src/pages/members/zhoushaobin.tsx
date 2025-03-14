import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div style={styles.container}>
      <Head>
        <title>Shaobin Zhou&apos;s Personal Homepage</title>
        <meta name="description" content="Shaobin Zhou&apos;s Personal Homepage" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main style={styles.main}>
        {/* 第一部分：照片和介绍 */}
        <section style={styles.intro}>
          <div style={styles.profileImage}>
            <Image
              src="/people/zhoushaobin/zhoushaobin.webp" // 替换为你的照片路径
              alt="个人照片"
              width={150}
              height={150}
              style={styles.profileImage}
            />
          </div>
          <div style={styles.profileInfo}>
            <h1 style={styles.title}>Shaobin Zhou</h1>
            <p style={styles.description}>
              I am Zhou Shaobin, currently pursuing master degree in Construction Project Management at the University of Macau. Prior to this, I obtained my Bachelor’s degree in Construction Management from Guangdong University of Technology. My current research focus lies in the integration of Augmented Reality (AR) with digital twin-based technologies for applications in construction site management.
            </p>
          </div>
        </section>

        {/* 第二部分：教育经历 */}
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
                  src="/people/zhoushaobin/gdgy.webp" // 替换为广东工业大学的校徽路径
                  alt="Guangdong University of Technology Logo"
                  width={50}
                  height={50}
                  style={styles.educationLogo}
                />
              </div>
              <div style={styles.educationInfo}>
                <h3 style={styles.educationTitle}>B.Sc. in Construction Management</h3>
                <p style={styles.educationDescription}>
                  <a
                    href="https://www.gdut.edu.cn" // 广东工业大学官网链接
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    Guangdong University of Technology
                  </a>, China
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 第三部分：经历 */}
        <section style={styles.experience}>
          <h2 style={styles.sectionTitle}>Experience​</h2>
          <div style={styles.experienceList}>
            {/* 经历 1 */}
            <div style={styles.experienceItem}>
              <div style={styles.experienceImage}>
                <Image
                  src="/people/zhoushaobin/1.webp" // 替换为你的经历照片路径
                  alt="经历 1"
                  width={400}
                  height={300}
                  style={styles.experienceImage}
                />
              </div>
              <div style={styles.experienceInfo}>
                <h3 style={styles.experienceTitle}>Graduation Thesis（OGTA） : Ecological risk assessment of Coral Island coastal zone based on satellite Remote Sensing land use monitoring technology(Supervisor: NG，Alex Hay-man)</h3>
                <p style={styles.experienceDescription}>
                  Committed to using ENVI5.3, ArcMap10.6 and other software, employed to pre-process the Landsat satellite remote sensing images of the coral island coastal zone and supervise classification in GIS spatial analysis, land use transfer matrix analysis and other methods, finally supposed to assess and the ecological risk of the coral island coastal zone, honoured as the Outstanding Graduation Thesis Innovation Award.
                </p>
              </div>
            </div>

            {/* 经历 2 */}
            <div style={styles.experienceItem}>
              <div style={styles.experienceImage}>
                <Image
                  src="/people/zhoushaobin/2.webp" // 替换为你的经历照片路径
                  alt="经历 2"
                  width={400}
                  height={300}
                  style={styles.experienceImage}
                />
              </div>
              <div style={styles.experienceInfo}>
                <h3 style={styles.experienceTitle}>College Students&apos; Innovative Entrepreneurial Training Plan Programme: Smart Site Based on BIM</h3>
                <p style={styles.experienceDescription}>
                  Committed to setting up buildings through the BIM, employed the Revit software to finish modelling tasks under the guidance of the teacher, and used Thsware software for package pricing and smart site management. Checked various data used in modelling, collected information related to building elements such as material specifications and component parameters, and honoured as the Province-level project.
                </p>
              </div>
            </div>

            {/* 经历 3 */}
            <div style={styles.experienceItem}>
              <div style={styles.experienceImage}>
                <Image
                  src="/people/zhoushaobin/3.webp" // 替换为你的经历照片路径
                  alt="经历 2"
                  width={400}
                  height={300}
                  style={styles.experienceImage}
                />
              </div>
              <div style={styles.experienceInfo}>
                <h3 style={styles.experienceTitle}>University of Macau Team Leader Leads to Victory at First Chinese Collegiate Pickleball Challenge</h3>
                <p style={styles.experienceDescription}>
                  As the team leader and captain, organized and represented the University of Macau at the First Chinese Collegiate Pickleball Challenge, securing the championship title for UM.
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
  experience: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  experienceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  experienceItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  experienceImage: {
    borderRadius: '8px',
  },
  experienceInfo: {
    textAlign: 'center',
  },
  experienceTitle: {
    margin: 0,
    fontSize: '1.2rem',
  },
  experienceDescription: {
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
    experienceItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      textAlign: 'left',
    },
    experienceInfo: {
      textAlign: 'left',
    },
  },
} as const; // 使用 `as const` 确保类型推断正确