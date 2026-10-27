import {
    findProperty,
    getDataSourceId,
    createKeyedCache,
    CONTENT_CACHE_TTL,
} from './notion';
import {
    getPublishedPages,
    getPropertyText,
    getPropertyList,
    getPageImage,
    getPageSlug,
    getOrder,
} from './notion-collection';

export type ProjectCategory = 'Active projects' | 'Past projects';

export interface ProjectItem {
    id: string;
    name: string;
    members: string;
    period: string;
    startYear: string;
    endYear: string;
    funding: string;
    projectType: string;
    category: ProjectCategory;
    summary: string;
    link: string;
    photo: string;
    order: number;
}

const PROJECTS_CACHE = createKeyedCache<ProjectItem[]>(CONTENT_CACHE_TTL);

function resolveCategory(
    categoryText: string,
    endYear: string
): ProjectCategory {
    if (/past|completed|finished|closed|结题|已结|完成|结束|结项/i.test(categoryText)) {
        return 'Past projects';
    }
    if (/active|ongoing|current|在研|进行|立项/i.test(categoryText)) {
        return 'Active projects';
    }
    const end = Number(endYear);
    if (Number.isFinite(end) && end > 0 && end < new Date().getFullYear()) {
        return 'Past projects';
    }
    return 'Active projects';
}

async function fetchProjects(): Promise<ProjectItem[]> {
    const dataSourceId = await getDataSourceId('projects');
    if (!dataSourceId) return [];

    const pages = await getPublishedPages(dataSourceId);

    const items = pages
        .map((page) => {
            const name = getPropertyText(
                findProperty(page, [
                    'Name',
                    'Title',
                    'Project',
                    'Project Name',
                    '项目名称',
                    '名称',
                    '标题',
                ])
            );
            const startYear = getPropertyText(
                findProperty(page, [
                    'Start Year',
                    'Start',
                    'Year',
                    '开始年份',
                    '起始年份',
                    '开始时间',
                ])
            );
            const endYear = getPropertyText(
                findProperty(page, [
                    'End Year',
                    'End',
                    '结束年份',
                    '终止年份',
                    '结束时间',
                ])
            );
            const periodText = getPropertyText(
                findProperty(page, ['Period', 'Time', 'Duration', '时间', '周期'])
            );
            const period =
                periodText ||
                (startYear && endYear && startYear !== endYear
                    ? `${startYear} - ${endYear}`
                    : startYear || endYear);

            const membersList = getPropertyList(
                findProperty(page, [
                    'Members',
                    'Team',
                    'Participants',
                    '成员',
                    '参与人员',
                ])
            );
            const membersText = getPropertyText(
                findProperty(page, [
                    'Members',
                    'Team',
                    'Participants',
                    '成员',
                    '参与人员',
                ])
            );

            const categoryText = getPropertyText(
                findProperty(page, [
                    'Status',
                    'Category',
                    'Project Category',
                    'State',
                    '项目类别',
                    '状态',
                    '类别',
                ])
            );

            return {
                id: getPageSlug(page, name),
                name,
                members: membersList.length > 0 ? membersList.join(', ') : membersText,
                period,
                startYear,
                endYear,
                funding: getPropertyText(
                    findProperty(page, [
                        'Funding',
                        'Funding Institution',
                        'Funder',
                        'Grant',
                        'Sponsor',
                        '资助机构',
                        '资助',
                        '基金',
                        '经费来源',
                    ])
                ),
                projectType:
                    getPropertyText(
                        findProperty(page, [
                            'Project Type',
                            'Type',
                            '项目类型',
                            '类型',
                        ])
                    ) || 'Research',
                category: resolveCategory(categoryText, endYear),
                summary: getPropertyText(
                    findProperty(page, [
                        'Summary',
                        'Description',
                        'Intro',
                        '简介',
                        '描述',
                        '摘要',
                    ])
                ),
                link: getPropertyText(
                    findProperty(page, ['Link', 'URL', '链接', '项目链接'])
                ),
                photo: getPageImage(
                    page,
                    ['Photo', 'Image', 'Cover', '图片', '封面'],
                    1000
                ),
                order: getOrder(page),
            } as ProjectItem;
        })
        .filter((item) => item.name.trim() !== '');

    return items.sort((a, b) => {
        if (a.category !== b.category) {
            return a.category === 'Active projects' ? -1 : 1;
        }
        if (a.order !== b.order) return a.order - b.order;
        return String(b.startYear).localeCompare(String(a.startYear));
    });
}

export function getProjects(): Promise<ProjectItem[]> {
    return PROJECTS_CACHE('all', fetchProjects);
}
