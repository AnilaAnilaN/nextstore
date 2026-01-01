import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import BlogComments from '@/components/BlogComments';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    email?: string;
  };
  image: string;
  category: string;
  tags: string[];
  views: number;
  createdAt: string;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs/${slug}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

async function getRelatedBlogs(category: string, currentId: string): Promise<Blog[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs?category=${category}&limit=3`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (data.data || []).filter((blog: Blog) => blog._id !== currentId);
  } catch (error) {
    return [];
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog.category, blog._id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Blog', href: '/blog' },
          { label: blog.title },
        ]}
      />

      <article className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-primary text-white px-3 py-1 rounded text-sm uppercase tracking-wide">
                  {blog.category}
                </span>
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>By {blog.author.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>{blog.views} views</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative h-96 md:h-[500px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>

            {/* Excerpt */}
            <div className="mb-8 p-6 bg-gray-50 border-l-4 border-primary rounded">
              <p className="text-lg text-gray-700 italic">{blog.excerpt}</p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Share section - placeholder */}
            <div className="border-t border-b border-gray-200 py-6 mb-12">
              <p className="text-gray-600 text-center">
                Share this article with your friends
              </p>
            </div>

            {/* Comments Section */}
            <BlogComments blogId={blog._id} />
          </div>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-medium text-gray-900 mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {relatedBlogs.map((relatedBlog) => (
                  <article
                    key={relatedBlog._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <Link href={`/blog/${relatedBlog.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                        <Link href={`/blog/${relatedBlog.slug}`}>
                          {relatedBlog.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {relatedBlog.excerpt}
                      </p>
                      <Link
                        href={`/blog/${relatedBlog.slug}`}
                        className="text-primary hover:text-primary-hover font-medium text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}