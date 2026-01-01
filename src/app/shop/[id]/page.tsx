import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import ProductModel from '@/models/Product';
import ProductActions from '@/components/ProductActions';
import { Product } from '@/types';
import ProductReviews from '@/components/ProductReviews';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectDB();

  // Validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-xl">Product not found</h2>
      </div>
    );
  }

  const productDoc = await ProductModel.findById(id).lean();

  if (!productDoc) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-xl">Product not found</h2>
      </div>
    );
  }

  const product: Product = {
    _id: productDoc._id.toString(),
    name: productDoc.name,
    description: productDoc.description,
    price: productDoc.price,
    image: productDoc.image && productDoc.image.trim() !== '' ? productDoc.image : '/images/hero_1.png',
    featured: productDoc.featured ?? false,
    category: productDoc.category || 'Uncategorized',
    stock: productDoc.stock ?? 0,
    createdAt: productDoc.createdAt?.toString() || '',
    updatedAt: productDoc.updatedAt?.toString() || '',
  };


  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: product.name }]} />

      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="lg:col-span-1 relative">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="rounded"
              />

              {/* Product action buttons - client component */}
              <div className="absolute top-4 right-4">
                <ProductActions product={product} />
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-medium text-gray-900 mb-4">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-gray-900 mb-4">${product.price}</p>

              <div className="flex items-center mb-6">
                <label htmlFor="quantity" className="mr-4">Quantity:</label>
                <input type="number" id="quantity" name="quantity" min={1} defaultValue={1} className="w-20 px-3 py-2 border border-gray-300 rounded" />
              </div>

              <button className="bg-primary text-white px-8 py-3 rounded hover:bg-[#5f57c2] transition-colors">Add to Cart</button>
            </div>
          </div>

          {/* Reviews Section */}
          <ProductReviews productId={product._id} />
        </div>
      </section>
    </>
  );
}
