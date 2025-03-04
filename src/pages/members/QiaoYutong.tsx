import Head from 'next/head';
import Image from 'next/image';
import {
    profile,
    education,
    researchInterests,
    publications,
    conferencePresentations,
    teaching,
    contact
} from '@/data/qiaoyutong';

export default function Home() {
    return (
        <div className="container">
            <Head>
              <title>{profile.name}&apos;s Personal Homepage</title>
              <meta name="description" content={`${profile.name}&apos;s Personal Homepage`} />
              <link rel="icon" href="/logo.png" />
            </Head>
            <main className="main">
                {/* 第一部分：照片和介绍 */}
                <section className="intro">
                    <div className="profileImage">
                        <Image
                            src={profile.avatar}
                            alt="个人照片"
                            width={150}
                            height={150}
                        />
                    </div>
                    <div className="profileInfo">
                        <h1 className="title">{profile.name}</h1>
                        {profile.welcomeMessage.map((paragraph, index) => (
                            <p key={index} className="description">{paragraph}</p>
                        ))}
                    </div>
                </section>

                {/* 第二部分：学历背景 */}
                <section className="education">
                    <h2 className="sectionTitle">Education</h2>
                    <div className="educationList">
                        {education.map((edu, index) => (
                            <div key={index} className="educationItem">
                                <div className="educationLogo">
                                    <Image
                                        src={edu.logo}
                                        alt={`${edu.institution} Logo`}
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="educationInfo">
                                    <h3 className="educationTitle">{edu.title}</h3>
                                    <p className="educationDescription">
                                        <a
                                            href={edu.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link"
                                        >
                                            {edu.institution}
                                        </a>, {edu.location} ({edu.time})
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 第三部分：研究兴趣 */}
                <section className="researchInterests">
                    <h2 className="sectionTitle">Research Interests</h2>
                    <ul className="researchList">
                        {researchInterests.map((interest, index) => (
                            <li key={index}>{interest}</li>
                        ))}
                    </ul>
                </section>

                {/* 第四部分：出版物 */}
                <section className="publications">
                    <h2 className="sectionTitle">Publications</h2>
                    <div className="publicationList">
                        {publications.map((pub, index) => (
                            <div key={index} className="publicationItem">
                                <h3 className="publicationTitle">{pub.title}</h3>
                                <p className="publicationAuthors">{pub.authors}</p>
                                <p className="publicationDescription">
                                    {pub.description} DOI: <a href={pub.doi} className="link">{pub.doi}</a>.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 第五部分：会议演讲 */}
                <section className="conferencePresentations">
                    <h2 className="sectionTitle">Conference Presentations</h2>
                    <div className="conferenceList">
                        {conferencePresentations.map((presentation, index) => (
                            <div key={index} className="conferenceItem">
                                <h3 className="conferenceTitle">{presentation.title}</h3>
                                <p className="conferenceTime">{presentation.time}</p>
                                <p className="conferenceDescription">
                                    {presentation.event}. Link: <a href={presentation.link} className="link">View Details</a>.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 第六部分：教学 */}
                <section className="teaching">
                    <h2 className="sectionTitle">Teaching</h2>
                    <div className="teachingList">
                        {teaching.map((teach, index) => (
                            <div key={index} className="teachingItem">
                                <h3 className="teachingTitle">{teach.title}</h3>
                                <p className="teachingTime">{teach.time}</p>
                                <p className="teachingDescription">{teach.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 第七部分：联系方式 */}
                <section className="contact">
                    <h2 className="sectionTitle">Contact</h2>
                    <p className="contactInfo">
                        Email: <a href={`mailto:${contact.email}`} className="link">{contact.email}</a>
                    </p>
                    <p className="contactInfo">
                        LinkedIn: <a href={contact.linkedin} className="link">Yutong Qiao</a>
                    </p>
                    <p className="contactInfo">
                        ResearchGate: <a href={contact.researchGate} className="link">Yutong Qiao</a>
                    </p>
                    <p className="contactInfo">
                        ORCID: <a href={contact.orcid} className="link">{contact.orcid}</a>
                    </p>
                </section>
            </main>
            <style jsx>{`
                .container {
                    min-height: 100vh;
                    padding: 0 10%; /* 增加左右内边距 */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    max-width: 1200px; /* 设置最大宽度 */
                    margin: 0 auto; /* 居中显示 */
                }
                .main {
                    padding: 2rem 0; /* 上下内边距 */
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }
                .intro {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .profileImage {
                    border-radius: 50%;
                    overflow: hidden; /* 确保图片超出部分被裁剪 */
                }
                .profileInfo {
                    text-align: center;
                    margin-top: 1rem;
                }
                .title {
                    margin: 0;
                    font-size: 2rem;
                }
                .description {
                    margin: 0.5rem 0;
                    font-size: 1.2rem;
                    color: #666;
                }
                .education {
                    width: 100%;
                    margin-bottom: 2rem;
                }
                .educationList {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .educationItem {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .educationLogo {
                    border-radius: 50%;
                    overflow: hidden; /* 确保图片超出部分被裁剪 */
                }
                .educationInfo {
                    flex: 1;
                }
                .educationTitle {
                    margin: 0;
                    font-size: 1.2rem;
                }
                .educationDescription {
                    margin: 0.5rem;
                    font-size: 1rem;
                    color: #666;
                }
                .researchInterests {
                    width: 100%;
                    margin-bottom: 2rem;
                }
                .researchList {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                }
                .publications {
                    width: 100%;
                    margin-bottom: 2rem;
                }
                .publicationList {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .publicationItem {
                    padding: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .publicationTitle {
                    margin: 0;
                    font-size: 1.2rem;
                }
                .publicationAuthors {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                    color: #666;
                }
                .publicationDescription {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                    color: #666;
                }
                .conferencePresentations {
                    width: 100%;
                    margin-bottom: 2rem;
                }
                .conferenceList {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .conferenceItem {
                    padding: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .conferenceTitle {
                    margin: 0;
                    font-size: 1.2rem;
                }
                .conferenceTime {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                    color: #666;
                }
                .conferenceDescription {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                    color: #666;
                }
                .teaching {
                    width: 100%;
                    margin-bottom: 2rem;
                }
                .teachingList {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .teachingItem {
                    padding: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .teachingTitle {
                    margin: 0;
                    font-size: 1.2rem;
                }
                .teachingTime {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                    color: #666;
                }
                .teachingDescription {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                    color: #666;
                }
                .contact {
                    width: 100%;
                    margin-bottom: 2rem;
                }
                .contactInfo {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                    color: #666;
                }
                .link {
                    color: #0070f3;
                    text-decoration: none;
                    font-weight: bold;
                }
                .sectionTitle {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }

                @media (max-width: 600px) {
                    .container {
                        padding: 0 5%; /* 小屏幕下调整内边距 */
                    }
                    .main {
                        padding: 1rem 0; /* 小屏幕下调整内边距 */
                    }
                    .educationItem,
                    .publicationItem,
                    .conferenceItem,
                    .teachingItem {
                        padding: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
}