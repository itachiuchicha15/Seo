/**
 * useChartData Hook
 * Encapsulates chart calculations for the performance dashboard
 * Pure logic extraction - no UI concerns
 */
import { useMemo } from 'react';
import { BlogPost } from '../../types';
import { CHART_CONFIG } from '../../constants';

interface ChartPoint {
    post: BlogPost;
    x: number;
    yImpressions: number;
    yRank: number;
}

interface ChartData {
    svgWidth: number;
    svgHeight: number;
    padding: typeof CHART_CONFIG.padding;
    points: ChartPoint[];
    maxImpressions: number;
    maxRank: number;
    impressionLinePoints: string;
    rankLinePoints: string;
    impressionAreaPoints: string;
    rankAreaPoints: string;
}

export const useChartData = (posts: BlogPost[]): ChartData | null => {
    return useMemo(() => {
        // Sort chronologically for chart
        const chronologicalPosts = [...posts].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        if (chronologicalPosts.length < 2) return null;

        const { svgWidth: SVG_WIDTH, svgHeight: SVG_HEIGHT, padding: PADDING } = CHART_CONFIG;

        const maxImpressions = Math.max(
            ...chronologicalPosts.map(p => p.metrics.impressions),
            1
        );

        const rankValues = chronologicalPosts
            .map(p => p.metrics.rank)
            .filter((r): r is number => typeof r === 'number');
        const maxRank = Math.max(...rankValues, 100);

        const points: ChartPoint[] = chronologicalPosts.map((post, i) => {
            const x = PADDING.left +
                (i / (chronologicalPosts.length - 1)) *
                (SVG_WIDTH - PADDING.left - PADDING.right);

            const yImpressions = PADDING.top +
                (SVG_HEIGHT - PADDING.top - PADDING.bottom) *
                (1 - post.metrics.impressions / maxImpressions);

            const yRank = typeof post.metrics.rank === 'number'
                ? PADDING.top + (SVG_HEIGHT - PADDING.top - PADDING.bottom) * (post.metrics.rank / maxRank)
                : SVG_HEIGHT - PADDING.bottom;

            return { post, x, yImpressions, yRank };
        });

        const impressionLinePoints = points.map(p => `${p.x},${p.yImpressions}`).join(' ');
        const rankLinePoints = points.map(p => `${p.x},${p.yRank}`).join(' ');

        const impressionAreaPoints = `M${points[0].x},${SVG_HEIGHT - PADDING.bottom} L${impressionLinePoints} L${points[points.length - 1].x},${SVG_HEIGHT - PADDING.bottom} Z`;
        const rankAreaPoints = `M${points[0].x},${SVG_HEIGHT - PADDING.bottom} L${rankLinePoints} L${points[points.length - 1].x},${SVG_HEIGHT - PADDING.bottom} Z`;

        return {
            svgWidth: SVG_WIDTH,
            svgHeight: SVG_HEIGHT,
            padding: PADDING,
            points,
            maxImpressions,
            maxRank,
            impressionLinePoints,
            rankLinePoints,
            impressionAreaPoints,
            rankAreaPoints,
        };
    }, [posts]);
};

export default useChartData;
