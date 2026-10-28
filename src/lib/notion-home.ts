import {
    findProperty,
    getDataSourceId,
    createKeyedCache,
    CONTENT_CACHE_TTL,
} from './notion';
import {
    getPublishedPages,
    getPageImage,
    getOrder,
} from './notion-collection';

export const DEFAULT_HOME_LOGO = '/img/logo.png';

const HOME_LOGO_CACHE = createKeyedCache<string>(CONTENT_CACHE_TTL);

async function fetchHomeLogo(): Promise<string> {
    const dataSourceId = await getDataSourceId('home');
    if (!dataSourceId) return DEFAULT_HOME_LOGO;

    const pages = await getPublishedPages(dataSourceId);
    if (pages.length === 0) return DEFAULT_HOME_LOGO;

    const page = [...pages].sort((a, b) => getOrder(a) - getOrder(b))[0];

    return (
        getPageImage(page, ['Logo', 'Site Logo', '标志', '标识'], 320) ||
        DEFAULT_HOME_LOGO
    );
}

// 首页 Logo：Home 表不存在或没有图片时回退到 /img/logo.png
export function getHomeLogo(): Promise<string> {
    return HOME_LOGO_CACHE('logo', fetchHomeLogo);
}
