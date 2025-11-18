
export const getThemeColor = (key: string, fallback: string) => {
    try {
        return (window as any).tailwind.config.theme.extend.colors[key] || fallback;
    } catch (e) {
        return fallback;
    }
};

export const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
