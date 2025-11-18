import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, style }) => {
  return (
    <div className={`shimmer bg-gray-200 rounded ${className}`} style={style} />
  );
};

export default Skeleton;