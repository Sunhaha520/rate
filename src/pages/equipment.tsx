import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { devices } from '@/data/devices';
import { getEquipment, EquipmentItem } from '@/lib/notion-equipment';
import {
    Bot,
    Glasses,
    Camera,
    Cpu,
    Wrench,
    ArrowUpRight,
    type LucideIcon,
} from 'lucide-react';

interface EquipmentPageProps {
    equipment: EquipmentItem[];
}

// 固定分类顺序；Notion 里新增的其他分类排在后面
const KNOWN_CATEGORIES = [
    'Construction robots',
    'Extended reality devices',
    'Reality capture and sensing devices',
    'High-performance computers',
];

function categoryIcon(category: string): LucideIcon {
    const value = category.toLowerCase();
    if (/robot|drone|无人机|机器人/.test(value)) return Bot;
    if (/reality|xr|vr|ar|glasses|头显|眼镜/.test(value)) return Glasses;
    if (/capture|sens|camera|lidar|相机|传感|扫描/.test(value)) return Camera;
    if (/computer|workstation|pc|电脑|工作站/.test(value)) return Cpu;
    return Wrench;
}

function statusBadgeClass(status: string): string {
    const value = status.toLowerCase();
    if (/available|idle|ok|normal|可用|正常|空闲/.test(value)) {
        return 'border-teal-600/25 bg-teal-50 text-teal-700 dark:border-teal-400/25 dark:bg-teal-500/10 dark:text-teal-300';
    }
    if (/maintenance|repair|broken|故障|维修/.test(value)) {
        return 'border-rose-500/25 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-300';
    }
    if (/use|busy|loan|占用|借出|使用中/.test(value)) {
        return 'border-amber-500/25 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-300';
    }
    return 'border-slate-200 bg-white/90 text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300';
}

const EquipmentPage: React.FC<EquipmentPageProps> = ({ equipment }) => {
    // 按分类分组
    const groups: Record<string, EquipmentItem[]> = {};
    equipment.forEach((item) => {
        (groups[item.category] ||= []).push(item);
    });

    const categories = [
        ...KNOWN_CATEGORIES.filter((category) => groups[category]?.length),
        ...Object.keys(groups)
            .filter((category) => !KNOWN_CATEGORIES.includes(category))
            .sort(),
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title="Equipment"
                path="/equipment"
                description="Laboratory equipment at RATE@UM: construction robots, UAVs, XR headsets, LiDAR, 360 cameras and high-performance workstations."
            />

            <Header />

            <main className="container mx-auto px-4 sm:px-6 py-8">
                <section>
                    {/* 标题卡片 */}
                    <div className="rounded-xl shadow-md overflow-hidden p-6 mb-8 bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                        <h1 className="text-3xl font-bold mb-3 text-center tracking-tight">
                            Our Equipment
                        </h1>
                        <div className="mx-auto mb-4 h-px w-12 bg-teal-600/70 dark:bg-teal-400/60" />
                        <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                            Explore the advanced equipment in our laboratory.
                        </p>
                    </div>

                    {categories.length === 0 && (
                        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
                            No equipment yet. Add records in the Notion
                            <span className="mx-1 font-medium">Equipment</span>
                            table, or edit src/data/devices.ts.
                        </p>
                    )}

                    {categories.map((category) => {
                        const Icon = categoryIcon(category);
                        const items = groups[category] ?? [];

                        return (
                            <div key={category} className="mt-10 first:mt-0">
                                <div className="mb-5 flex items-center gap-3">
                                    <Icon
                                        size={20}
                                        strokeWidth={2}
                                        className="shrink-0 text-teal-600 dark:text-teal-400"
                                    />
                                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                                        {category}
                                    </h2>
                                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700/70" />
                                    <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">
                                        {items.length}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {items.map((item) => {
                                        const quantity = Number(item.quantity);
                                        const showQuantity =
                                            Number.isFinite(quantity) && quantity > 1;
                                        const subtitle = [item.brand, item.model]
                                            .filter(Boolean)
                                            .join(' · ');

                                        return (
                                            <article
                                                key={item.id}
                                                className="card-enter group flex flex-col overflow-hidden rounded-xl shadow-md bg-white text-gray-900 transition-all duration-500 ease-out hover:scale-105 dark:bg-gray-800 dark:text-white"
                                            >
                                                {item.image && (
                                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                                        />

                                                        {item.status && (
                                                            <span
                                                                className={`absolute left-3 top-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium backdrop-blur ${statusBadgeClass(
                                                                    item.status
                                                                )}`}
                                                            >
                                                                {item.status}
                                                            </span>
                                                        )}
                                                        {showQuantity && (
                                                            <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-0.5 text-[0.7rem] font-medium tabular-nums text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
                                                                × {item.quantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex flex-1 flex-col p-5">
                                                    {/* 没有图片时把状态/数量放进正文，不占一块空白图区 */}
                                                    {!item.image &&
                                                        (item.status || showQuantity) && (
                                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                                {item.status && (
                                                                    <span
                                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium ${statusBadgeClass(
                                                                            item.status
                                                                        )}`}
                                                                    >
                                                                        {item.status}
                                                                    </span>
                                                                )}
                                                                {showQuantity && (
                                                                    <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 text-[0.7rem] font-medium tabular-nums text-slate-600 dark:text-slate-300">
                                                                        × {item.quantity}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    <h3 className="text-base font-semibold leading-snug">
                                                        {item.name}
                                                    </h3>
                                                    {subtitle && (
                                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                            {subtitle}
                                                        </p>
                                                    )}

                                                    {item.features.length > 0 && (
                                                        <ul className="mt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                                                            {item.features
                                                                .slice(0, 5)
                                                                .map((feature) => (
                                                                    <li
                                                                        key={feature}
                                                                        className="flex gap-2"
                                                                    >
                                                                        <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-teal-600 dark:bg-teal-400" />
                                                                        <span>{feature}</span>
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    )}
                                                    {item.features.length > 5 && (
                                                        <span className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                                                            +{item.features.length - 5} more
                                                        </span>
                                                    )}

                                                    {(item.location || item.link) && (
                                                        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs">
                                                            <span className="text-slate-500 dark:text-slate-400">
                                                                {item.location}
                                                            </span>
                                                            {item.link && (
                                                                <a
                                                                    href={item.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex shrink-0 items-center gap-1 font-medium text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
                                                                >
                                                                    Details
                                                                    <ArrowUpRight size={13} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default EquipmentPage;

// 本地兜底数据（Notion 设备表为空或尚未创建时使用）
const localEquipment: EquipmentItem[] = devices.map((device, index) => ({
    id: device.id,
    name: device.name,
    category: device.category,
    image: device.image,
    features: device.features,
    order: index,
}));

export async function getStaticProps() {
    let equipment: EquipmentItem[] = [];

    try {
        equipment = await getEquipment();
    } catch (err) {
        console.error('读取 Notion 设备表失败，已回退到本地数据:', err);
    }

    if (equipment.length === 0) {
        equipment = localEquipment;
    }

    return {
        props: {
            equipment,
        },
        revalidate: 60,
    };
}
