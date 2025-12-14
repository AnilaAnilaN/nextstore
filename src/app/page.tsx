import Image from "next/image";
import Link from "next/link";
import { Truck, RefreshCw, HelpCircle } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: 1,
    name: "Tank Top",
    description: "Finding perfect t-shirt",
    price: 50,
    image: "/images/cloth_1.jpg",
    category: "clothing",
  },
  {
    id: 2,
    name: "Corater",
    description: "Finding perfect products",
    price: 50,
    image: "/images/shoe_1.jpg",
    category: "shoes",
  },
  {
    id: 3,
    name: "Polo Shirt",
    description: "Finding perfect products",
    price: 50,
    image: "/images/cloth_2.jpg",
    category: "clothing",
  },
  {
    id: 4,
    name: "T-Shirt Mockup",
    description: "Finding perfect products",
    price: 50,
    image: "/images/cloth_3.jpg",
    category: "clothing",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Finding Your Perfect Shoes
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus at iaculis quam. Integer accumsan tincidunt fringilla.
              </p>
              <Link
                href="/shop"
                className="bg-primary text-white py-3 px-6 rounded-sm tracking-[0.05em] uppercase transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] hover:-translate-y-0.5 inline-block"
              >
                Shop Now
              </Link>
            </div>
            <div className="relative h-[400px] lg:h-[600px] rounded overflow-hidden">
              <Image
                src="/images/hero_1.png"
                alt="Hero"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-20 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 px-4">
              <Truck className="w-12 h-12 text-primary shrink-0" />
              <div>
                <h2 className="text-lg uppercase font-medium text-gray-900 mb-2">
                  Free Shipping
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus at iaculis quam.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 px-4">
              <RefreshCw className="w-12 h-12 text-primary shrink-0" />
              <div>
                <h2 className="text-lg uppercase font-medium text-gray-900 mb-2">
                  Free Returns
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus at iaculis quam.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 px-4">
              <HelpCircle className="w-12 h-12 text-primary shrink-0" />
              <div>
                <h2 className="text-lg uppercase font-medium text-gray-900 mb-2">
                  Customer Support
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus at iaculis quam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
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
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-gray-900">
              Featured Products
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Big Sale Section */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-gray-900">Big Sale!</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-96 rounded overflow-hidden">
              <Image
                src="/images/blog_1.jpg"
                alt="Sale"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-medium text-gray-900 mb-4">
                <Link href="/shop">50% less in all items</Link>
              </h2>
              <p className="text-gray-500 mb-4">
                By{" "}
                <Link href="#" className="text-primary">
                  Carl Smith
                </Link>{" "}
                • September 3, 2018
              </p>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quisquam iste dolor accusantium facere corporis ipsum animi
                deleniti fugiat. Ex, veniam?
              </p>
              <Link
                href="/shop"
                className="bg-primary text-white py-3 px-6 rounded-sm tracking-[0.05em] uppercase transition-all duration-300 inline-block hover:bg-primary-hover hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] hover:-translate-y-0.5"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
