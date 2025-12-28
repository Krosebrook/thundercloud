'use client';

import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState } from 'react';

export default function WebsiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const websiteId = params?.id as string;
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const { data: website, isLoading } = trpc.websites.getById.useQuery(
    { id: websiteId },
    { enabled: !!websiteId }
  );

  const deleteMutation = trpc.websites.delete.useMutation({
    onSuccess: () => {
      toast.success('Website deleted');
      router.push('/dashboard');
    },
  });

  const togglePublishMutation = trpc.websites.togglePublish.useMutation({
    onSuccess: (data) => {
      toast.success(data.is_published ? 'Published!' : 'Unpublished');
      window.location.reload();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading website...</p>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Website not found</h2>
        <Button onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const viewportWidths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{website.title}</h1>
          <p className="text-muted-foreground">{website.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const blob = new Blob([website.html_content], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${website.slug}.html`;
              a.click();
              toast.success('Downloaded!');
            }}
          >
            Download HTML
          </Button>
          <Button
            onClick={() => togglePublishMutation.mutate({ id: website.id })}
            disabled={togglePublishMutation.isLoading}
          >
            {website.is_published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {website.quality_score || 0}/100
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {website.seo_score || 0}/100
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg capitalize">
              {website.category || 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-3 w-3 rounded-full ${
                  website.is_published ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              <span className="text-lg">
                {website.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                View your website in different screen sizes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                Mobile
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tablet')}
              >
                Tablet
              </Button>
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
              >
                Desktop
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div
              style={{
                width: viewportWidths[viewMode],
                maxWidth: '100%',
              }}
              className="border rounded-lg overflow-hidden transition-all duration-300"
            >
              <iframe
                srcDoc={website.html_content}
                className="w-full h-[800px]"
                title="Website Preview"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Are you sure? This cannot be undone.')) {
                deleteMutation.mutate({ id: website.id });
              }
            }}
            disabled={deleteMutation.isLoading}
          >
            Delete Website
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
