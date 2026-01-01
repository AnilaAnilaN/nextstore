import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { Calendar, User, Eye } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    name: string;
  };
  image: string;
  category: string;
  views: number;
  createdAt: string;
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs?published=true&limit=12`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

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
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium text-gray-900 mb-4">
              Latest from Our Blog
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the latest trends, tips, and stories from the world of fashion
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No blog posts available yet.</p>
              <p className="text-gray-500 mt-2">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Link href={`/blog/${blog.slug}`}>
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white px-3 py-1 rounded text-sm uppercase tracking-wide">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{blog.views} views</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-medium text-gray-900 mb-3 line-clamp-2 hover:text-primary transition-colors">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>By {blog.author.name}</span>
                      </div>

                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-primary hover:text-primary-hover font-medium text-sm uppercase tracking-wide"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination placeholder - implement if needed */}
          {blogs.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Showing {blogs.length} posts
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}