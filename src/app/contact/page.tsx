"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage(
          "We’ve received your message. We’ll get back to you soon."
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };
  return (
    <>
      <Breadcrumb items={[{ label: "Contact" }]} />

      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-medium text-gray-900 mb-8">
            Get In Touch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              {successMessage && (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                className="border border-gray-200 rounded p-8"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-900 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-900 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-900 mb-2">Message</label>
                  <textarea
                    name="message"
                    rows={7}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-6 rounded-sm tracking-[0.05em] uppercase transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded p-6">
                <span className="text-primary uppercase text-sm font-medium block mb-2">
                  New York
                </span>
                <p className="text-gray-600">
                  203 Fake St. Mountain View, San Francisco, California, USA
                </p>
              </div>

              <div className="border border-gray-200 rounded p-6">
                <span className="text-primary uppercase text-sm font-medium block mb-2">
                  London
                </span>
                <p className="text-gray-600">
                  203 Fake St. Mountain View, San Francisco, California, USA
                </p>
              </div>

              <div className="border border-gray-200 rounded p-6">
                <span className="text-primary uppercase text-sm font-medium block mb-2">
                  Canada
                </span>
                <p className="text-gray-600">
                  203 Fake St. Mountain View, San Francisco, California, USA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
