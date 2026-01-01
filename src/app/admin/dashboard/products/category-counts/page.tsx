import connectDB from '@/lib/db';
import Product from '@/models/Product';

// Admin page: display counts per category
export default async function CategoryCountsPage() {
  await connectDB();

  const menCount = await Product.countDocuments({ category: 'clothing' });
  const womenCount = await Product.countDocuments({ category: 'accessories' });
  const childrenCount = await Product.countDocuments({ category: 'shoes' });

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Category Counts</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded">
          <div className="text-sm text-gray-500">Men</div>
          <div className="text-2xl font-bold">{menCount}</div>
        </div>
        <div className="p-4 bg-white border rounded">
          <div className="text-sm text-gray-500">Women</div>
          <div className="text-2xl font-bold">{womenCount}</div>
        </div>
        <div className="p-4 bg-white border rounded">
          <div className="text-sm text-gray-500">Children</div>
          <div className="text-2xl font-bold">{childrenCount}</div>
        </div>
      </div>
    </div>
  );
}