import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { Truck, RefreshCw, HelpCircle } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Elizabeth Graham",
    role: "CEO/Co-Founder",
    image: "/images/person_1.jpg",
  },
  {
    id: 2,
    name: "Jennifer Greive",
    role: "Co-Founder",
    image: "/images/person_2.jpg",
  },
  {
    id: 3,
    name: "Patrick Marx",
    role: "Marketing",
    image: "/images/person_3.jpg",
  },
  {
    id: 4,
    name: "Mike Coolbert",
    role: "Sales Manager",
    image: "/images/person_4.jpg",
  },
];

export default async function AboutPage() {
  let content = {
    title: "How We Started",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius repellat, dicta at laboriosam, nemo exercitationem itaque eveniet architecto cumque, deleniti commodi molestias repellendus quos sequi hic fugiat asperiores illum. Atque, in, fuga excepturi corrupti error corporis aliquam unde nostrum quas.\n\nAccusantium dolor ratione maiores est deleniti nihil? Dignissimos est, sunt nulla illum autem in, quibusdam cumque recusandae, laudantium minima repellendus.",
  };

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/content/about`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success && data.data) {
      content = data.data.content;
    }
  } catch (error) {
    console.error("Error fetching about content:", error);
  }

  return (
    <>
      <Breadcrumb items={[{ label: "About" }]} />

      {/* How We Started Section */}
      <section className="py-10 md:py-20 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded overflow-hidden">
              <Image
                src="/images/blog_1.jpg"
                alt="How We Started"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded"
              />
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1" />
              </button>
            </div>
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-medium text-gray-900 relative inline-block pb-2">
                  {content.title}
                  <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-primary" />
                </h2>
              </div>
              <div className="text-gray-600 whitespace-pre-wrap">
                {content.description}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 md:py-20 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-gray-900">The Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center">
                <div className="mb-4">
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 mb-4">{member.role}</p>
                </div>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
                  aut minima nihil sit distinctio recusandae doloribus ut fugit
                  officia voluptate soluta.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      ...

      {/* Features Section */}
      <section className="py-10 md:py-20">
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
                  Phasellus at iaculis quam. Integer accumsan tincidunt
                  fringilla.
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
                  Phasellus at iaculis quam. Integer accumsan tincidunt
                  fringilla.
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
                  Phasellus at iaculis quam. Integer accumsan tincidunt
                  fringilla.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
