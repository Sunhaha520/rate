import { createContext, useContext, type ReactNode } from 'react';

export interface SiteSettings {
    siteName: string;
    logo: string;
    bannerImage: string;
    bannerTitle: string;
    bannerSubtitle: string;
    aboutTitle: string;
    aboutText: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
    siteName: 'RATE@UM',
    logo: '/img/logo.png',
    bannerImage: '/img/bannercover.webp',
    bannerTitle: 'RATE@UM',
    bannerSubtitle:
        'Research Group of Advanced Technologies in Engineering',
    aboutTitle: 'Here is RATE@UM',
    aboutText:
        'RATE@UM (Research Group of Advanced Technologies in Engineering) is a research group in the Department of Civil and Environment Engineering, Faculty of Engineering at the University of Macau. We are dedicated to driving innovative research and development in civil engineering and other related interdisciplinary fields. Our vision is to develop and leverage collaborative intelligence technologies to integrate human beings, physical environments, and digital twins seamlessly towards a safer and more sustainable future.',
};

const SiteSettingsContext = createContext<SiteSettings>(
    DEFAULT_SITE_SETTINGS
);

export function SiteSettingsProvider({
    settings,
    children,
}: {
    settings: SiteSettings;
    children: ReactNode;
}) {
    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings(): SiteSettings {
    return useContext(SiteSettingsContext);
}
