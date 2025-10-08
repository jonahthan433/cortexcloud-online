import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

// Basic loading spinner
export const LoadingSpinner = ({ size = 'default', className = '' }: { size?: 'sm' | 'default' | 'lg'; className?: string }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

// Page loading state
export const PageLoading = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
    <Card className="glass-effect border-primary/20 w-full max-w-md">
      <CardContent className="p-8 text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  </div>
);

// Dashboard loading skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Stats skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="glass-effect border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Content skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="space-y-4">
    {/* Header skeleton */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
    
    {/* Rows skeleton */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-8 w-full" />
        ))}
      </div>
    ))}
  </div>
);

// Form loading skeleton
export const FormSkeleton = ({ fields = 4 }: { fields?: number }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <Skeleton className="h-10 w-32" />
  </div>
);

// Card loading skeleton
export const CardSkeleton = () => (
  <Card className="glass-effect border-primary/20">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Button loading state
export const LoadingButton = ({ 
  loading, 
  children, 
  ...props 
}: { 
  loading: boolean; 
  children: React.ReactNode; 
  [key: string]: any;
}) => (
  <Button {...props} disabled={loading || props.disabled}>
    {loading && <LoadingSpinner size="sm" className="mr-2" />}
    {children}
  </Button>
);

// Inline loading state
export const InlineLoading = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center space-x-2">
      <LoadingSpinner size="sm" />
      <span className="text-muted-foreground">{message}</span>
    </div>
  </div>
);

// Overlay loading state
export const OverlayLoading = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <Card className="glass-effect border-primary/20">
      <CardContent className="p-6 text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  </div>
);
