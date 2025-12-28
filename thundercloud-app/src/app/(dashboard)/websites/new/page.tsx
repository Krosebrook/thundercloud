'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const categories = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'business', label: 'Business Site' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'saas', label: 'SaaS Product' },
] as const;

const colorSchemes = [
  'Professional Blue',
  'Modern Purple',
  'Elegant Gray',
  'Vibrant Orange',
  'Fresh Green',
  'Bold Red',
];

export default function NewWebsitePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'landing' | 'business' | 'ecommerce' | 'portfolio' | 'saas'>('landing');
  const [colorScheme, setColorScheme] = useState('Professional Blue');
  const [preview, setPreview] = useState<string | null>(null);
  const [validationScore, setValidationScore] = useState<number | null>(null);

  const generateMutation = trpc.generation.generate.useMutation({
    onSuccess: (data) => {
      toast.success(`Website generated! Score: ${data.validation.score}/100`);
      setPreview(data.website.html_content);
      setValidationScore(data.validation.score);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    generateMutation.mutate({
      title,
      description,
      category,
      colorScheme,
    });
  };

  const handleSave = () => {
    toast.success('Website saved to dashboard!');
    router.push('/dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Generate New Website</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Website Details</CardTitle>
              <CardDescription>
                Tell us about your website and we'll generate it for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Website Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., My Consulting Business"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your business, target audience, key services, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as typeof category)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorScheme">Color Scheme</Label>
                  <select
                    id="colorScheme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={colorScheme}
                    onChange={(e) => setColorScheme(e.target.value)}
                  >
                    {colorSchemes.map((scheme) => (
                      <option key={scheme} value={scheme}>
                        {scheme}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={generateMutation.isLoading}
                >
                  {generateMutation.isLoading
                    ? 'Generating... (30-60s)'
                    : 'Generate Website'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          {!preview && !generateMutation.isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Your generated website will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Fill in the form and click Generate
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {generateMutation.isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Generating...</CardTitle>
                <CardDescription>
                  AI is creating your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-muted-foreground">
                    This usually takes 30-60 seconds...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {preview && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Preview</CardTitle>
                      {validationScore !== null && (
                        <CardDescription>
                          Quality Score: {validationScore}/100
                        </CardDescription>
                      )}
                    </div>
                    <Button onClick={handleSave}>Save to Dashboard</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      srcDoc={preview}
                      className="w-full h-[600px]"
                      title="Website Preview"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
