import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  count?: number;
}

const shimmer = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700";

export const Skeleton: React.FC<SkeletonProps> = ({ className = "h-4", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${shimmer} rounded ${className}`}
        />
      ))}
    </>
  );
};

export const MenuItemSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className={`${shimmer} h-48 w-full`} />
    <div className="p-4 space-y-3">
      <div className={`${shimmer} h-6 w-3/4 rounded`} />
      <div className={`${shimmer} h-4 w-full rounded`} />
      <div className={`${shimmer} h-4 w-2/3 rounded`} />
      <div className="flex items-center justify-between">
        <div className={`${shimmer} h-8 w-20 rounded`} />
        <div className={`${shimmer} h-10 w-24 rounded-lg`} />
      </div>
    </div>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center space-x-4 mb-4">
      <div className={`${shimmer} w-12 h-12 rounded-full`} />
      <div className="flex-1 space-y-2">
        <div className={`${shimmer} h-4 w-3/4 rounded`} />
        <div className={`${shimmer} h-3 w-1/2 rounded`} />
      </div>
    </div>
    <div className="space-y-3">
      <div className={`${shimmer} h-4 w-full rounded`} />
      <div className={`${shimmer} h-4 w-5/6 rounded`} />
      <div className={`${shimmer} h-4 w-4/6 rounded`} />
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className={`${shimmer} h-6 w-32 rounded`} />
    </div>
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`${shimmer} w-10 h-10 rounded-full`} />
              <div className="space-y-2">
                <div className={`${shimmer} h-4 w-24 rounded`} />
                <div className={`${shimmer} h-3 w-16 rounded`} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`${shimmer} h-4 w-16 rounded`} />
              <div className={`${shimmer} h-4 w-20 rounded`} />
              <div className={`${shimmer} h-8 w-8 rounded`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className={`${shimmer} h-6 w-32 rounded mb-4`} />
    <div className={`${shimmer} h-64 w-full rounded`} />
  </div>
); 