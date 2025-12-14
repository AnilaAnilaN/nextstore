"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({
    men: 0,
    women: 0,
    children: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategoryCounts = async () => {
      try {
        const response = await fetch('/api/products/category-counts');
        if (!response.ok) {
          throw new Error('Failed to fetch category counts');
        }
        const data = await response.json();
        setCategoryCounts(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
    fetchCategoryCounts();
  }, []);
  return (
    <>
      <Breadcrumb items={[{ label: "Shop" }]} />

      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="border border-gray-200 rounded p-4 mb-6">
                <h3 className="text-sm uppercase font-medium text-gray-900 mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <Link href="#" className="text-gray-600 hover:text-primary">Men</Link>
                    <span className="text-gray-900">({categoryCounts.men})</span>
                  </li>
                  <li className="flex justify-between">
                    <Link href="#" className="text-gray-600 hover:text-primary">Women</Link>
                    <span className="text-gray-900">({categoryCounts.women})</span>
                  </li>
                  <li className="flex justify-between">
                    <Link href="#" className="text-gray-600 hover:text-primary">Children</Link>
                    <span className="text-gray-900">({categoryCounts.children})</span>
                  </li>
                </ul>
              </div>

              {/* Filter by Price */}
              <div className="border border-gray-200 rounded p-4 mb-6">
                <h3 className="text-sm uppercase font-medium text-gray-900 mb-4">
                  Filter by Price
                </h3>
                <input type="range" className="w-full mb-4" />
                <input
                  type="text"
                  value="$50 - $200"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  disabled
                />
              </div>

              {/* Size Filter */}
              <div className="border border-gray-200 rounded p-4 mb-6">
                <h3 className="text-sm uppercase font-medium text-gray-900 mb-4">
                  Size
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600">Small (2,319)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600">Medium (1,282)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600">Large (1,392)</span>
                  </label>
                </div>
              </div>

              {/* Color Filter */}
              <div className="border border-gray-200 rounded p-4">
                <h3 className="text-sm uppercase font-medium text-gray-900 mb-4">
                  Color
                </h3>
                <div className="space-y-2">
                  <Link
                    href="#"
                    className="flex items-center text-gray-600 hover:text-primary"
                  >
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-2" />
                    Red (2,429)
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center text-gray-600 hover:text-primary"
                  >
                    <span className="w-4 h-4 bg-green-500 rounded-full mr-2" />
                    Green (2,298)
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center text-gray-600 hover:text-primary"
                  >
                    <span className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
                    Blue (1,075)
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center text-gray-600 hover:text-primary"
                  >
                    <span className="w-4 h-4 bg-purple-500 rounded-full mr-2" />
                    Purple (1,075)
                  </Link>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4 md:mb-0">
                  Shop All
                </h2>
                <div className="flex space-x-2">
                  <select className="px-4 py-2 border border-gray-300 rounded text-sm">
                    <option>Latest</option>
                    <option>Men</option>
                    <option>Women</option>
                    <option>Children</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded text-sm">
                    <option>Reference</option>
                    <option>Relevance</option>
                    <option>Name, A to Z</option>
                    <option>Name, Z to A</option>
                    <option>Price, low to high</option>
                    <option>Price, high to low</option>
                  </select>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center">
                <ul className="flex space-x-2">
                  <li>
                    <Link
                      href="#"
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      &lt;
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="px-3 py-2 bg-primary text-white rounded"
                    >
                      1
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      2
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      3
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      4
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      5
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      &gt;
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <section className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium text-gray-900">Categories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["women", "children", "men"].map((category) => (
                <Link
                  key={category}
                  href="/shop"
                  className="relative group block overflow-hidden rounded"
                >
                  <div className="relative h-96">
                    <Image
                      src={`/images/${category}.jpg`}
                      alt={category}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <span className="text-sm uppercase tracking-wide">
                        Collections
                      </span>
                      <h3 className="text-4xl font-light capitalize">
                        {category}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}