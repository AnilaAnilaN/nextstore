import Breadcrumb from '@/components/Breadcrumb';

const BlogPage = () => {
  return (
    <>
      <Breadcrumb items={[{ label: 'Blog' }]} />
      <div className="container py-12">
        <h1 className="text-3xl font-bold">Blog Page</h1>
        <p>This is the blog page. Content will be added soon.</p>
      </div>
    </>
  );
};

export default BlogPage;
