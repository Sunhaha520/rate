// pages/index.tsx
import Head from "next/head";
import Image from "next/image";
import { profile, researchOverview, publications, awards } from "@/data/mark";

export default function Home() {
    return (
        <div className="container">
            <Head>
                <title>{profile.name}&apos;s Personal Homepage</title>
                <meta name="description" content={`${profile.name}'s Personal Homepage`} />
                <link rel="icon" href="/logo.png" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
            </Head>
            <main className="main">
                {/* 头部 */}
                <section className="header">
                    <div className="profileImage">
                        <Image
                            src={profile.avatar}
                            alt="个人照片"
                            width={150}
                            height={150}
                            className="rounded-full"
                        />
                    </div>
                    <div className="profileInfo">
                        <h1 className="name">{profile.name}</h1>
                        <h2 className="title">{profile.title}</h2>
                        <p className="affiliation">{profile.affiliation}</p>
                        <p className="email">{profile.email}</p>
                        <p className="description">{profile.description}</p>
                    </div>
                </section>

                {/* 研究概览 */}
                <section className="researchOverview">
                    <h2 className="sectionTitle">Research Overview</h2>
                    <p className="summary">{researchOverview.summary}</p>
                    <ul className="keyThemes">
                        {researchOverview.keyThemes.map((theme, index) => (
                            <li key={index}>{theme}</li>
                        ))}
                    </ul>
                </section>

                {/* 出版物 */}
                <section className="publications">
                    <h2 className="sectionTitle">Publications</h2>
                    <div className="publicationList">
                        {publications.map((pub, index) => {
                            // 将字段组合成一个数组，过滤掉空值
                            const infoFields = [
                                pub.institution,
                                pub.authors,
                                pub.year,
                                pub.status,
                            ].filter(Boolean); // 过滤掉空值
                            return (
                                <div key={index} className="publicationItem">
                                    <div className="imageContainer">
                                        <Image src={pub.image} alt={pub.title} width={300} height={200} className="rounded-lg" />
                                    </div>
                                    <div className="text">
                                        <h3 className="publicationTitle">{pub.title}</h3>
                                        <p className="info">
                                            {infoFields.join(' | ')} {/* 用 | 分隔 */}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 奖项荣誉 */}
                <section className="awards">
                    <h2 className="sectionTitle">Awards & Honors</h2>
                    <div className="awardList">
                        {awards.map((award, index) => {
                            // 将字段组合成一个数组，过滤掉空值
                            const infoFields = [
                                award.event || award.location,
                                award.year,
                            ].filter(Boolean); // 过滤掉空值
                            return (
                                <div key={index} className="awardItem">
                                    <div className="imageContainer">
                                        <Image src={award.image} alt={award.title} width={300} height={200} className="rounded-lg" />
                                    </div>
                                    <div className="text">
                                        <h3 className="awardTitle">{award.title}</h3>
                                        <p className="info">
                                            {infoFields.join(' | ')} {/* 用 | 分隔 */}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
            <style jsx>{`
                .container {
                    min-height: 100vh;
                    padding: 0 10%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .main {
                    padding: 2rem 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }
                .header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .profileImage {
                    margin-right: 2rem;
                }
                .profileInfo {
                    flex: 1;
                }
                .name {
                    font-size: 2rem;
                    font-weight: bold;
                }
                .title {
                    font-size: 1rem;
                    font-weight: bold;
                }
                .affiliation,
                .email,
                .description {
                    font-size: 1rem;
                    color: #666;
                }
                .description {
                    font-style: italic;
                }
                .researchOverview {
                    width: 100%;
                    margin-bottom: 2rem;
                }
                .summary {
                    font-size: 1rem;
                    color: #666;
                }
                .keyThemes {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                }
                .publications,
                .awards {
                    width: 100%;
                    margin-bottom: 2rem;
                }
                .publicationList,
                .awardList {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .publicationItem,
                .awardItem {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    padding: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .text {
                    flex: 1;
                }
                .publicationTitle,
                .awardTitle {
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                .info {
                    font-size: 1rem;
                    color: #666;
                }
                .imageContainer {
                    flex: 0 0 200px;
                    height: 150px;
                    overflow: hidden;
                    border-radius: 8px;
                }
                .rounded-lg {
                    border-radius: 8px;
                }
                .sectionTitle {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                }
                @media (max-width: 600px) {
                    .container {
                        padding: 0 5%;
                    }
                    .main {
                        padding: 1rem 0;
                    }
                    .header {
                        flex-direction: column;
                        align-items: center;
                    }
                    .profileImage {
                        margin-right: 0;
                        margin-bottom: 1rem;
                    }
                    .publicationItem,
                    .awardItem {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .imageContainer {
                        flex: 0 0 100%;
                        width: 100%;
                        height: 200px;
                        margin-bottom: 1rem;
                    }
                    .text {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}