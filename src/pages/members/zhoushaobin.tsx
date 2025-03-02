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
              I am ZhouShaobin from the major of Construction Project Management. Before studying at UM, I attain my bachelor&apos;s degree at Guangdong University of Technology, with the major of construction management.  
              Particularly, my graduation thesis project, &quot;Ecological Risk Assessment of Coral Island Coastal Zones Based on Satellite Remote Sensing Land Use Monitoring Technology,&quot; was awarded the &quot;Outstanding Graduation Thesis Innovation Award.&quot; Also, I participated in the College Students&apos; Innovative Entrepreneurial Training Plan Programme and immersed myself in the Province-Level project &quot;Smart Construction Site based on BIM&quot;.
            </p>
          </div>
        </section>

        {/* 第二部分：经历 */}
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
                <h3 style={styles.experienceTitle}>Graduation Thesis : Ecological risk assessment of Coral Island coastal zone based on satellite remote sensing land use monitoring technology(Supervisor: Professor Alex Haymond)</h3>
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
  '@media (min-width: 768px)': {
    intro: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: '2rem',
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