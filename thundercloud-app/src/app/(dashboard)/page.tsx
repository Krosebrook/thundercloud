'use client';

import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { data, isLoading, refetch } = trpc.websites.list.useQuery({
    page: 1,
    pageSize: 10,
  });

  const deleteMutation = trpc.websites.delete.useMutation({
    onSuccess: () => {
      toast.success('Website deleted');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const togglePublishMutation = trpc.websites.togglePublish.useMutation({
    onSuccess: (data) => {
      toast.success(data.is_published ? 'Published' : 'Unpublished');
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading websites...</p>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">No websites yet</h2>
        <p className="text-muted-foreground mb-6">
          Create your first AI-generated website in minutes
        </p>
        <Button asChild>
          <Link href="/dashboard/websites/new">Create Website</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Websites</h1>
          <p className="text-muted-foreground">
            {data.pagination.totalCount} total websites
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/websites/new">Create Website</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((website) => (
          <Card key={website.id}>
            <CardHeader>
              <CardTitle className="line-clamp-1">{website.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {website.description || 'No description'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    website.is_published ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className="text-muted-foreground">
                  {website.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Updated {formatRelativeTime(website.updated_date)}
              </div>
              {website.quality_score && (
                <div className="mt-2 text-sm">
                  Quality Score:{' '}
                  <span className="font-semibold">{website.quality_score}/100</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/websites/${website.id}`}>View</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => togglePublishMutation.mutate({ id: website.id })}
                disabled={togglePublishMutation.isLoading}
              >
                {website.is_published ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm('Delete this website?')) {
                    deleteMutation.mutate({ id: website.id });
                  }
                }}
                disabled={deleteMutation.isLoading}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
