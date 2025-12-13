import Link from 'next/link';

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="bg-gray-100 py-6">
      <div className="container">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-[#7971ea]">
            Home
          </Link>
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              {item.href ? (
                <Link href={item.href} className="text-gray-600 hover:text-[#7971ea]">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;