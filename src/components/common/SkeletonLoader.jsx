import React from 'react';

// Course Card Skeleton
export const CourseCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-6">
      <div className="flex justify-between mb-2">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded w-full"></div>
    </div>
  </div>
);

// Popular Course Card Skeleton
export const PopularCourseCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-300"></div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 bg-gray-300 rounded-full"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-8 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Testimonial Card Skeleton
export const TestimonialCardSkeleton = () => (
  <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 animate-pulse">
    <div className="space-y-3 mb-8">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-4/6"></div>
    </div>
    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-8 ml-1"></div>
      </div>
    </div>
  </div>
);

// Course Detail Skeleton
export const CourseDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="h-96 bg-gray-300 animate-pulse"></div>
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-300 rounded-md flex-1 animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="text-center mb-6">
              <div className="h-8 bg-gray-300 rounded w-24 mx-auto mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-32 mx-auto"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded w-full mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Dashboard Card Skeleton
export const DashboardCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center animate-pulse">
    <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-4"></div>
    <div className="h-6 bg-gray-300 rounded w-16 mx-auto mb-1"></div>
    <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
  </div>
);

// Generic List Skeleton
export const ListSkeleton = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);