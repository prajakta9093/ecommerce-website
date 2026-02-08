import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gauriPhoto from "../assets/dp.png";

const About = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />

      {/* Offset for fixed navbar */}
      <div className="pt-24">

        <div className="max-w-6xl mx-auto px-4 py-16">

          {/* Founder Story */}
          <section className="mb-20">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#e6dfd4]">
              <div className="grid md:grid-cols-2">

                {/* Photo Side */}
                <div className="relative bg-[#efe8dd] p-12 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238b6a4f\' fill-opacity=\'0.3\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
                    }}
                  />

                  <div className="relative">
                    <div className="absolute -inset-4 bg-[#b89b7a]/30 rounded-full blur-2xl"></div>
                    <img
                      src={gauriPhoto}
                      alt="Founder"
                      className="relative w-64 h-64 rounded-full object-cover ring-8 ring-white shadow-xl"
                    />
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-[#8b6a4f] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl text-white">🧶</span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-12">
                  <div className="inline-block px-4 py-2 bg-[#efe8dd] rounded-full mb-6">
                    <span className="text-sm font-semibold text-[#8b6a4f]">
                      Meet Our Founder
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold text-[#5a4634] mb-6">
                    Welcome to Yarn Yapper
                  </h3>

                  <div className="space-y-4 text-[#6b5846] leading-relaxed">
                    <p>
                      At Yarn Yapper, every product is handcrafted with care,
                      precision, and a whole lot of heart.
                    </p>

                    <div className="bg-[#f7f4ef] rounded-2xl p-6 my-6 border border-[#e6dfd4]">
                      <p className="font-semibold text-[#5a4634] mb-4 flex items-center">
                        <span className="text-2xl mr-3">✨</span>
                        What makes us different?
                      </p>
                      <ul className="space-y-3">
                        {[
                          "Fully customizable — colors, sizes, patterns",
                          "100% handmade — no mass production",
                          "Every piece carries a part of our story",
                        ].map((text, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-[#8b6a4f] mr-3 mt-1">●</span>
                            <span>{text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p>
                      Whether you're here for something cozy, colorful,
                      or custom — thank you for supporting our handmade dream.
                    </p>

                    <div className="mt-6 pt-6 border-t border-[#e6dfd4]">
                      <p className="text-right italic text-[#5a4634]">
                        With love,
                        <br />
                        <span className="font-bold text-lg text-[#8b6a4f]">
                          Yarn Yapper Team 🧵
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#8b6a4f] mb-4">
                What We Offer
              </h2>
              <p className="text-[#6b5846] text-lg">
                Handcrafted with love, designed for you
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🧶", title: "Handcrafted Items", text: "Beautiful crochet pieces." },
                { icon: "✨", title: "Custom Orders", text: "We bring your ideas to life." },
                { icon: "💝", title: "Perfect Gifts", text: "Thoughtful handmade gifts." },
                { icon: "🌿", title: "Quality Materials", text: "Premium yarn that lasts." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#e6dfd4]"
                >
                  <div className="h-2 bg-[#b89b7a]"></div>
                  <div className="p-8">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-[#5a4634] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-[#6b5846]">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Our Values */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#8b6a4f] mb-4">
                Our Values
              </h2>
              <p className="text-[#6b5846] text-lg">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "❤️", title: "Passion", text: "Made with genuine love." },
                { icon: "🎨", title: "Creativity", text: "Unique designs & ideas." },
                { icon: "🤝", title: "Customer Care", text: "Your happiness matters." },
                { icon: "♻️", title: "Sustainability", text: "Mindful creation." },
              ].map((value, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-8 border border-[#e6dfd4]"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{value.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#8b6a4f] mb-2">
                        {value.title}
                      </h3>
                      <p className="text-[#6b5846]">
                        {value.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
