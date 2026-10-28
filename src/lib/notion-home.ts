import {
    findProperty,
    getDataSourceId,
    createKeyedCache,
    CONTENT_CACHE_TTL,
} from './notion';
import {
    getPublishedPages,
    getPropertyText,
    getPageImage,
    getOrder,
} from './notion-collection';

export interface HomeInfo {
    logo: string;
    aboutTitle: string;
    aboutText: string;
}

export const DEFAULT_HOME_INFO: HomeInfo = {
    logo: '/img/logo.png',
    aboutTitle: 'Here is RATE@UM',
    aboutText:
        'RATE@UM (Research Group of Advanced Technologies in Engineering) is a research group in the Department of Civil and Environment Engineering, Faculty of Engineering at the University of Macau. We are dedicated to driving innovative research and development in civil engineering and other related interdisciplinary fields. Our vision is to develop and leverage collaborative intelligence technologies to integrate human beings, physical environments, and digital twins seamlessly towards a safer and more sustainable future.',
};

const HOME_INFO_CACHE = createKeyedCache<HomeInfo>(CONTENT_CACHE_TTL);

async function fetchHomeInfo(): Promise<HomeInfo> {
    const dataSourceId = await getDataSourceId('home');
    if (!dataSourceId) return DEFAULT_HOME_INFO;

    const pages = await getPublishedPages(dataSourceId);
    if (pages.length === 0) return DEFAULT_HOME_INFO;

    const page = [...pages].sort((a, b) => getOrder(a) - getOrder(b))[0];

    const aboutTitle = getPropertyText(
        findProperty(page, [
            'About Title',
            'Intro Title',
            '关于标题',
            '简介标题',
        ])
    );
    const aboutText = getPropertyText(
        findProperty(page, [
            'About Text',
            'About',
            'Intro',
            'Description',
            '关于',
            '简介',
            '介绍',
        ])
    );

    return {
        logo:
            getPageImage(page, ['Logo', 'Site Logo', '标志', '标识'], 320) ||
            DEFAULT_HOME_INFO.logo,
        aboutTitle: aboutTitle || DEFAULT_HOME_INFO.aboutTitle,
        aboutText: aboutText || DEFAULT_HOME_INFO.aboutText,
    };
}

// 首页 Logo + 自我介绍：Home 表不存在或字段为空时使用默认内容
export function getHomeInfo(): Promise<HomeInfo> {
    return HOME_INFO_CACHE('home', fetchHomeInfo);
}
