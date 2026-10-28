import { findProperty, getDataSourceId, createKeyedCache, CONTENT_CACHE_TTL } from './notion';
import {
    getPublishedPages,
    getPropertyText,
    getPageImage,
    getOrder,
} from './notion-collection';
import {
    DEFAULT_SITE_SETTINGS,
    type SiteSettings,
} from './site-settings';

const HOME_CACHE = createKeyedCache<SiteSettings>(CONTENT_CACHE_TTL);

async function fetchSiteSettings(): Promise<SiteSettings> {
    const dataSourceId = await getDataSourceId('home');
    if (!dataSourceId) return DEFAULT_SITE_SETTINGS;

    const pages = await getPublishedPages(dataSourceId);
    if (pages.length === 0) return DEFAULT_SITE_SETTINGS;

    const page = [...pages].sort((a, b) => getOrder(a) - getOrder(b))[0];

    const siteName = getPropertyText(
        findProperty(page, [
            'Site Name',
            'Name',
            'Title',
            '网站名称',
            '站名',
            '名称',
        ])
    );

    const bannerTitle = getPropertyText(
        findProperty(page, ['Banner Title', 'Hero Title', '横幅标题', '主标题'])
    );
    const bannerSubtitle = getPropertyText(
        findProperty(page, [
            'Banner Subtitle',
            'Hero Subtitle',
            'Tagline',
            '横幅副标题',
            '副标题',
            '标语',
        ])
    );

    return {
        siteName: siteName || DEFAULT_SITE_SETTINGS.siteName,
        logo:
            getPageImage(
                page,
                ['Logo', 'Site Logo', '标志', '标识'],
                320
            ) || DEFAULT_SITE_SETTINGS.logo,
        bannerImage:
            getPageImage(
                page,
                ['Banner Image', 'Banner', 'Hero Image', '横幅', '横幅图', '主图'],
                1600
            ) || DEFAULT_SITE_SETTINGS.bannerImage,
        bannerTitle: bannerTitle || siteName || DEFAULT_SITE_SETTINGS.bannerTitle,
        bannerSubtitle:
            bannerSubtitle || DEFAULT_SITE_SETTINGS.bannerSubtitle,
        aboutTitle:
            getPropertyText(
                findProperty(page, [
                    'About Title',
                    'Intro Title',
                    '关于标题',
                    '简介标题',
                ])
            ) || DEFAULT_SITE_SETTINGS.aboutTitle,
        aboutText:
            getPropertyText(
                findProperty(page, [
                    'About Text',
                    'About',
                    'Intro',
                    'Description',
                    '关于',
                    '简介',
                    '介绍',
                ])
            ) || DEFAULT_SITE_SETTINGS.aboutText,
    };
}

// 站点级设置：Home 表不存在时回退到当前默认值
export function getSiteSettings(): Promise<SiteSettings> {
    return HOME_CACHE('site', fetchSiteSettings);
}
