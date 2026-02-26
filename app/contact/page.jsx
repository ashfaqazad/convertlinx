"use client";

import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setStatus("Sending your message...");

    try {
      // ✅ Recommended: send to an API route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (data?.success) {
        setStatus("Thanks! I got your message — I'll reply soon 😊");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("Oops, something went wrong. Try again?");
      }
    } catch (error) {
      setStatus("Couldn't send — maybe check your connection?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuccess =
    status.toLowerCase().includes("thanks") ||
    status.toLowerCase().includes("reply") ||
    status.toLowerCase().includes("got your message");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
            Hey, Let&apos;s Talk!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Got a question, suggestion, bug report, or just wanna say hi?
            <br />
            I&apos;m the guy behind PDF Linx — drop me a message. I read
            everything and reply when I can.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              Send me a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Message
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Hey, I love the tool... or I found a bug... or add this feature?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-gray-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {/* ✅ Privacy disclosure line */}
              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree that PDF Linx may use your
                name and email to respond to your request. Please review our{" "}
                <a
                  href="/privacy-policy"
                  className="text-indigo-600 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>

              {status && (
                <p
                  className={`text-center mt-3 font-medium text-sm ${
                    isSuccess ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status}
                </p>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-8 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-indigo-600" />
              Other Ways to Reach Me
            </h2>

            <div className="space-y-4 text-gray-700 text-base">
              <p>Best way: Just use the form — I check it regularly.</p>
              <p>Or email me directly at:</p>

              {/* ✅ Fix mailto */}
              <a
                href="mailto:support@pdflinx.com"
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition break-all"
              >
                support@pdflinx.com
              </a>

              <p className="mt-4">
                I&apos;m usually replying on evenings or weekends (building this
                solo in my free time).
              </p>

              <p className="italic text-gray-600 mt-4">
                Seriously — feedback, ideas, bug reports, even a simple
                &quot;thanks&quot; — all welcome. Makes my day.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-gray-500 text-base italic">
          Made with ❤️ by a fellow PDF hater who just wanted better tools
        </p>
      </div>
    </main>
  );
}
























// "use client";

// import { useState } from "react";
// import { Mail, MessageSquare } from "lucide-react";

// export default function Contact() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name || !email || !message) return;

//     setIsSubmitting(true);
//     setStatus("Sending your message...");

//     try {
//       const res = await fetch("https://pdflinx.com/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, message }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setStatus("Thanks! I got your message — I'll reply soon 😊");
//         setName("");
//         setEmail("");
//         setMessage("");
//       } else {
//         setStatus("Oops, something went wrong. Try again?");
//       }
//     } catch (error) {
//       setStatus("Couldn't send — maybe check your connection?");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Hero Section */}
//         <section className="text-center mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
//             Hey, Let's Talk!
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
//             Got a question, suggestion, bug report, or just wanna say hi?<br />
//             I'm the guy behind PDF Linx — drop me a message. I read everything and reply when I can.
//           </p>
//         </section>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Contact Form */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <MessageSquare className="w-6 h-6 text-indigo-600" />
//               Send me a message
//             </h2>

//              <form onSubmit={handleSubmit} className="space-y-4">
//                <div>
//                  <label className="block text-gray-700 font-medium mb-1 text-sm">Your Name</label>
//                  <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   placeholder="Your Name"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50"
//                 />
//               </div>

//                  <label className="block text-gray-700 font-medium mb-1 text-sm">Email</label>
//                <div>
//                  <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   placeholder="you@example.com"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50"
//                 />
//               </div> 

//                <div>
//                  <label className="block text-gray-700 font-medium mb-1 text-sm">Message</label>
//                  <textarea
//                    rows="5"
//                    value={message}
//                    onChange={(e) => setMessage(e.target.value)}
//                    required
//                    placeholder="Hey, I love the tool... or I found a bug... or add this feature?"
//                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-gray-50"
//                  />
//                </div>

//                <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md disabled:opacity-70"
//               >
//             {isSubmitting ? "Sending..." : "Send Message"}
//                </button>

//                {status && (
//                 <p className={`text-center mt-3 font-medium text-sm ${status.includes("Thanks") || status.includes("got") ? "text-green-600" : "text-red-600"}`}>
//                   {status}
//                 </p>
//               )}
//             </form>
//           </div>

//            {/* Contact Info */}
//            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-8 flex flex-col justify-center">
//              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//                <Mail className="w-6 h-6 text-indigo-600" />
//                Other Ways to Reach Me
//              </h2>

//              <div className="space-y-4 text-gray-700 text-base">
//                <p>Best way: Just use the form — I check it regularly.</p>
//                <p>Or email me directly at:</p>
//                <a
//                 href="mailto:ashfaqahmed@pdflinx.com"
//                 className="font-semibold text-indigo-600 hover:text-indigo-800 transition break-all"
//               >
//                 support@pdflinx.com
//               </a>
//               <p className="mt-4">
//                 I'm usually replying on evenings or weekends (building this solo in my free time).
//               </p>
//               <p className="italic text-gray-600 mt-4">
//                  Seriously — feedback, ideas, bug reports, even a simple "thanks" — all welcome. Makes my day.
//                </p>
//              </div>
//            </div>
//          </div>

//          <p className="text-center mt-12 text-gray-500 text-base italic">
//            Made with ❤️ by a fellow PDF hater who just wanted better tools
//          </p>
//        </div>
//      </main>
//   );
// }
 


















// // "use client";

// // import { useState } from "react";
// // import { MessageSquare } from "lucide-react";

// // export default function Contact() {
// //   const [message, setMessage] = useState("");
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [status, setStatus] = useState("");

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!message.trim()) {
// //       setStatus("Please write a message 🙂");
// //       return;
// //     }

// //     setIsSubmitting(true);
// //     setStatus("Sending your message...");

// //     try {
// //       const response = await fetch("https://formsubmit.co/ajax/ashfaqahmedazad@gmail.com", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Accept: "application/json",
// //         },
// //         body: JSON.stringify({
// //           message: message.trim(),
// //           // Optional: Add subject for better email organization
// //           _subject: "New Message from PDF Linx Contact Form",
// //           // FormSubmit will auto-add timestamp and IP if needed
// //         }),
// //       });

// //       if (response.ok) {
// //         setStatus("Message sent successfully! Thanks — I read every one 😊");
// //         setMessage("");
// //       } else {
// //         setStatus("Something went wrong. Please try again.");
// //       }
// //     } catch (error) {
// //       setStatus("Couldn't send — check your connection and try again.");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4">
// //       <div className="max-w-4xl mx-auto">
// //         {/* Hero Section */}
// //         <section className="text-center mb-12">
// //           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
// //             Get in Touch
// //           </h1>
// //           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
// //             Questions? Feedback? Bug reports? Feature requests?<br />
// //             I'm the solo maker behind PDF Linx — I personally read every message.
// //           </p>
// //         </section>

// //         <div className="grid md:grid-cols-2 gap-10 items-start">
// //           {/* Contact Form */}
// //           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// //               <MessageSquare className="w-7 h-7 text-indigo-600" />
// //               Send a Message (100% Anonymous)
// //             </h2>

// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <div>
// //                 <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
// //                   Your Message
// //                 </label>
// //                 <textarea
// //                   id="message"
// //                   rows="9"
// //                   value={message}
// //                   onChange={(e) => setMessage(e.target.value)}
// //                   required
// //                   placeholder="Examples:&#10;- Amazing tool! Can you add currency converter?&#10;- PDF merge fails with large files...&#10;- Please add dark mode! ❤️&#10;- Just wanted to say thank you for making this free"
// //                   className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-gray-50 text-base leading-relaxed"
// //                 />
// //                 <p className="text-sm text-gray-500 mt-3">
// //                   No name or email needed — your message reaches me privately and anonymously.
// //                 </p>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={isSubmitting}
// //                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-lg"
// //               >
// //                 {isSubmitting ? "Sending..." : "Send Message"}
// //               </button>

// //               {status && (
// //                 <p
// //                   className={`text-center mt-4 font-semibold text-base ${
// //                     status.includes("successfully") || status.includes("Thanks")
// //                       ? "text-green-600"
// //                       : "text-red-600"
// //                   }`}
// //                 >
// //                   {status}
// //                 </p>
// //               )}
// //             </form>
// //           </div>

// //           {/* Info Panel */}
// //           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-8 flex flex-col justify-center">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-6">
// //               Why No Email or Name?
// //             </h2>

// //             <div className="space-y-5 text-gray-700 text-base leading-relaxed">
// //               <p>
// //                 PDF Linx is made for <span className="font-semibold">everyone around the world</span> — no signups, no personal info, no barriers.
// //               </p>
// //               <p>
// //                 Your privacy matters. I get your message directly in my inbox, but you stay completely anonymous.
// //               </p>
// //               <p className="font-medium text-indigo-700">
// //                 Every message — praise, bugs, ideas, or just a "thanks" — truly helps and makes my day.
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <p className="text-center mt-16 text-gray-500 text-base italic">
// //           Built with ❤️ by one person who wants great PDF tools to be free and simple — for everyone, everywhere.
// //         </p>
// //       </div>
// //     </main>
// //   );
// // }



















// // "use client";

// // import { useState } from "react";
// // import { MessageSquare } from "lucide-react";

// // export default function Contact() {
// //   const [message, setMessage] = useState("");
// //   const [status, setStatus] = useState("");
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!message.trim()) {
// //       setStatus("Please write something — even a quick hi! 🙂");
// //       return;
// //     }

// //     setIsSubmitting(true);
// //     setStatus("Sending your message...");

// //     try {
// //       const res = await fetch("https://pdflinx.com/contact", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ 
// //           message: message.trim(),
// //         }),
// //       });

// //       const data = await res.json();

// //       if (data.success) {
// //         setStatus("Message sent! Thanks — I read every single one 😊");
// //         setMessage("");
// //       } else {
// //         setStatus("Something went wrong. Please try again?");
// //       }
// //     } catch (error) {
// //       setStatus("Couldn't send — check your connection?");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4">
// //       <div className="max-w-4xl mx-auto">
// //         {/* Hero */}
// //         <section className="text-center mb-12">
// //           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
// //             Get in Touch
// //           </h1>
// //           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
// //             Questions? Feedback? Bug reports? Feature ideas?<br />
// //             I'm the solo developer behind PDF Linx — I personally read and appreciate every message.
// //           </p>
// //         </section>

// //         <div className="grid md:grid-cols-2 gap-10 items-start">
// //           {/* Form */}
// //           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 order-2 md:order-1">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// //               <MessageSquare className="w-7 h-7 text-indigo-600" />
// //               Send a Message (Fully Anonymous)
// //             </h2>

// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <div>
// //                 <label className="block text-gray-700 font-medium mb-2">
// //                   Your Message
// //                 </label>
// //                 <textarea
// //                   rows="9"
// //                   value={message}
// //                   onChange={(e) => setMessage(e.target.value)}
// //                   required
// //                   placeholder="Examples:&#10;- Love the PDF converter! Can you add currency conversion?&#10;- Found a bug in PDF merge when files are large...&#10;- Please add dark mode ❤️&#10;- Just wanted to say thanks for making this free!"
// //                   className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-gray-50 text-base leading-relaxed"
// //                 />
// //                 <p className="text-sm text-gray-500 mt-3">
// //                   No name, email, or signup required. Your message comes straight to me — privately and anonymously.
// //                 </p>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={isSubmitting}
// //                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-70 text-lg"
// //               >
// //                 {isSubmitting ? "Sending..." : "Send Message"}
// //               </button>

// //               {status && (
// //                 <p className={`text-center mt-4 font-semibold text-base ${status.includes("Thanks") || status.includes("sent") ? "text-green-600" : "text-red-600"}`}>
// //                   {status}
// //                 </p>
// //               )}
// //             </form>
// //           </div>

// //           {/* Info Side */}
// //           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-8 flex flex-col justify-center order-1 md:order-2">
// //             <h2 className="text-2xl font-bold text-gray-800 mb-6">
// //               Why Keep It Anonymous?
// //             </h2>

// //             <div className="space-y-5 text-gray-700 text-base leading-relaxed">
// //               <p>
// //                 PDF Linx is built for <span className="font-semibold">everyone, everywhere</span> — no barriers, no personal info needed.
// //               </p>
// //               <p>
// //                 I value your privacy as much as I value your feedback. Whether it's praise, criticism, bugs, or ideas — everything helps make this tool better.
// //               </p>
// //               <p className="font-medium text-indigo-700">
// //                 Every message matters. Seriously — even a simple "thanks" brightens my day.
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <p className="text-center mt-16 text-gray-500 text-base italic">
// //           Built with ❤️ by one person who believes great tools should be free and simple — for the whole world.
// //         </p>
// //       </div>
// //     </main>
// //   );
// // }











































// // // // "use client";

// // // // import { useState } from "react";
// // // // import { Mail, MessageSquare } from "lucide-react";

// // // // export default function Contact() {
// // // //   const [name, setName] = useState("");
// // // //   const [email, setEmail] = useState("");
// // // //   const [message, setMessage] = useState("");
// // // //   const [status, setStatus] = useState("");
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!name || !email || !message) return;

// // // //     setIsSubmitting(true);
// // // //     setStatus("Sending your message...");

// // // //     try {
// // // //       const res = await fetch("https://pdflinx.com/contact", {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({ name, email, message }),
// // // //       });

// // // //       const data = await res.json();

// // // //       if (data.success) {
// // // //         setStatus("Thanks! I got your message — I'll reply soon 😊");
// // // //         setName("");
// // // //         setEmail("");
// // // //         setMessage("");
// // // //       } else {
// // // //         setStatus("Oops, something went wrong. Try again?");
// // // //       }
// // // //     } catch (error) {
// // // //       setStatus("Couldn't send — maybe check your connection?");
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-16 px-6">
// // // //       <div className="max-w-5xl mx-auto">
// // // //         {/* Hero Section */}
// // // //         <section className="text-center mb-16">
// // // //           <h1 className="text-4xl md:text-5xl font-black mb-6 text-indigo-900">
// // // //             Hey, Let's Talk!
// // // //           </h1>
// // // //           <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
// // // //             Got a question, suggestion, bug report, or just wanna say hi?<br />
// // // //             I'm the guy behind PDF Linx — drop me a message. I read everything and reply when I can.
// // // //           </p>
// // // //         </section>

// // // //         <div className="grid md:grid-cols-2 gap-10">
// // // //           {/* Contact Form */}
// // // //           <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 md:p-10">
// // // //             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// // // //               <MessageSquare className="w-8 h-8 text-indigo-600" />
// // // //               Send me a message
// // // //             </h2>

// // // //             <form onSubmit={handleSubmit} className="space-y-6">
// // // //               <div>
// // // //                 <label className="block text-gray-700 font-medium mb-2">Your Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={name}
// // // //                   onChange={(e) => setName(e.target.value)}
// // // //                   required
// // // //                   placeholder="Ashfaq"
// // // //                   className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white/70"
// // // //                 />
// // // //               </div>

// // // //               <div>
// // // //                 <label className="block text-gray-700 font-medium mb-2">Email</label>
// // // //                 <input
// // // //                   type="email"
// // // //                   value={email}
// // // //                   onChange={(e) => setEmail(e.target.value)}
// // // //                   required
// // // //                   placeholder="you@example.com"
// // // //                   className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white/70"
// // // //                 />
// // // //               </div>

// // // //               <div>
// // // //                 <label className="block text-gray-700 font-medium mb-2">Message</label>
// // // //                 <textarea
// // // //                   rows="6"
// // // //                   value={message}
// // // //                   onChange={(e) => setMessage(e.target.value)}
// // // //                   required
// // // //                   placeholder="Hey, I love the tool... or I found a bug... or add this feature?"
// // // //                   className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none bg-white/70"
// // // //                 />
// // // //               </div>

// // // //               <button
// // // //                 type="submit"
// // // //                 disabled={isSubmitting}
// // // //                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
// // // //               >
// // // //                 {isSubmitting ? "Sending..." : "Send Message"}
// // // //               </button>

// // // //               {status && (
// // // //                 <p className={`text-center mt-4 font-medium ${status.includes("Thanks") || status.includes("got") ? "text-green-600" : "text-red-600"}`}>
// // // //                   {status}
// // // //                 </p>
// // // //               )}
// // // //             </form>
// // // //           </div>

// // // //           {/* Contact Info */}
// // // //           <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 md:p-10 flex flex-col justify-center">
// // // //             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// // // //               <Mail className="w-8 h-8 text-indigo-600" />
// // // //               Other Ways to Reach Me
// // // //             </h2>

// // // //             <div className="space-y-5 text-gray-700">
// // // //               <p className="text-lg">
// // // //                 Best way: Just use the form — I check it regularly.
// // // //               </p>
// // // //               <p className="text-lg">
// // // //                 Or email me directly at:
// // // //               </p>
// // // //               <a
// // // //                 href="mailto:ashfaqahmed@pdflinx.com"
// // // //                 className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 transition break-all"
// // // //               >
// // // //                 ashfaqahmed@pdflinx.com
// // // //               </a>
// // // //               <p className="text-lg mt-6">
// // // //                 I'm usually replying on evenings or weekends (building this solo in my free time).
// // // //               </p>
// // // //               <p className="text-base italic text-gray-600 mt-6">
// // // //                 Seriously — feedback, ideas, bug reports, even a simple "thanks" — all welcome. Makes my day.
// // // //               </p>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* <p className="text-center mt-16 text-gray-500 text-sm">
// // // //           Made with ❤️ from Karachi, Pakistan
// // // //         </p> */}

// // // //         <p className="text-center mt-16 text-gray-500 text-base italic">
// // // //           Made with ❤️ by a fellow PDF hater who just wanted better tools
// // // //         </p>
// // // //       </div>
// // // //     </main>
// // // //   );
// // // // }













// // // // // "use client";

// // // // // import { useState } from "react";

// // // // // export default function Contact() {
// // // // //   const [name, setName] = useState("");
// // // // //   const [email, setEmail] = useState("");
// // // // //   const [message, setMessage] = useState("");
// // // // //   const [status, setStatus] = useState("");

// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     setStatus("Sending...");

// // // // //     try {
// // // // //       const res = await fetch("https://pdflinx.com/contact", {
// // // // //         method: "POST",
// // // // //         headers: {
// // // // //           "Content-Type": "application/json",
// // // // //         },
// // // // //         body: JSON.stringify({ name, email, message }),
// // // // //       });

// // // // //       const data = await res.json();

// // // // //       if (data.success) {
// // // // //         setStatus("Message Sent Successfully!");
// // // // //         setName("");
// // // // //         setEmail("");
// // // // //         setMessage("");
// // // // //       } else {
// // // // //         setStatus("Failed to send message. Try again.");
// // // // //       }
// // // // //     } catch (error) {
// // // // //       setStatus("Error connecting to server.");
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <main className="max-w-5xl mx-auto py-12 px-6">
// // // // //       {/* Page Header */}
// // // // //       <section className="text-center mb-12">

// // // // //         <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
// // // // //         <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
// // // // //           Have questions or feedback? We're here to help. Fill out the form below
// // // // //           or reach us directly via email.
// // // // //         </p>

// // // // //       </section>

// // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // // // //         {/* Contact Form */}
// // // // //         <div className="bg-white shadow-lg rounded-lg p-6">
// // // // //           <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>

// // // // //           <form onSubmit={handleSubmit} className="space-y-4">
// // // // //             <div>
// // // // //               <label className="block text-gray-700 font-medium mb-1">Name</label>
// // // // //               <input
// // // // //                 type="text"
// // // // //                 value={name}
// // // // //                 onChange={(e) => setName(e.target.value)}
// // // // //                 required
// // // // //                 placeholder="Your Name"
// // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // //               />
// // // // //             </div>

// // // // //             <div>
// // // // //               <label className="block text-gray-700 font-medium mb-1">Email</label>
// // // // //               <input
// // // // //                 type="email"
// // // // //                 value={email}
// // // // //                 onChange={(e) => setEmail(e.target.value)}
// // // // //                 required
// // // // //                 placeholder="you@example.com"
// // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // //               />
// // // // //             </div>

// // // // //             <div>
// // // // //               <label className="block text-gray-700 font-medium mb-1">Message</label>
// // // // //               <textarea
// // // // //                 rows="5"
// // // // //                 value={message}
// // // // //                 onChange={(e) => setMessage(e.target.value)}
// // // // //                 required
// // // // //                 placeholder="Write your message..."
// // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // //               ></textarea>
// // // // //             </div>

// // // // //             <button
// // // // //               type="submit"
// // // // //               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
// // // // //             >
// // // // //               Send Message
// // // // //             </button>
// // // // //           </form>

// // // // //           {status && (
// // // // //             <p className="mt-4 text-center text-green-600 font-medium">{status}</p>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Contact Info */}
// // // // //         <div className="flex flex-col justify-center bg-gray-50 rounded-lg p-6 shadow-md">
// // // // //           <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
// // // // //           <p className="text-gray-700 mb-4">
// // // // //             You can also reach out to us via the following contact details:
// // // // //           </p>
// // // // //           <ul className="space-y-3 text-gray-700">
// // // // //             <li>
// // // // //               <span className="font-medium">📧 Email:</span> ashfaqahmed@pdflinx.com
// // // // //             </li>
// // // // //             <li>
// // // // //               {/* <span className="font-medium">📍 Address:</span> Karachi, Pakistan */}
// // // // //             </li>
// // // // //             <li>
// // // // //               {/* <span className="font-medium">☎ Phone:</span> +92 3332758958 */}
// // // // //             </li>
// // // // //           </ul>
// // // // //         </div>
// // // // //       </div>
// // // // //     </main>
// // // // //   );
// // // // // }



























// // // // // "use client";

// // // // // export default function Contact() {
// // // // //   return (
// // // // //     <main className="max-w-5xl mx-auto py-12 px-6">
// // // // //       {/* Page Header */}
// // // // //       <section className="text-center mb-12">
// // // // //         <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
// // // // //         <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
// // // // //           Have questions or feedback? We're here to help. Fill out the form below
// // // // //           or reach us directly via email.
// // // // //         </p>
// // // // //       </section>

// // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // // // //         {/* Contact Form */}
// // // // //         <div className="bg-white shadow-lg rounded-lg p-6">
// // // // //           <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
// // // // //           <form className="space-y-4">
// // // // //             <div>
// // // // //               <label className="block text-gray-700 font-medium mb-1">Name</label>
// // // // //               <input
// // // // //                 type="text"
// // // // //                 placeholder="Your Name"
// // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // //               />
// // // // //             </div>
// // // // //             <div>
// // // // //               <label className="block text-gray-700 font-medium mb-1">Email</label>
// // // // //               <input
// // // // //                 type="email"
// // // // //                 placeholder="you@example.com"
// // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // //               />
// // // // //             </div>
// // // // //             <div>
// // // // //               <label className="block text-gray-700 font-medium mb-1">Message</label>
// // // // //               <textarea
// // // // //                 rows="5"
// // // // //                 placeholder="Write your message..."
// // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // //               ></textarea>
// // // // //             </div>
// // // // //             <button
// // // // //               type="submit"
// // // // //               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
// // // // //             >
// // // // //               Send Message
// // // // //             </button>
// // // // //           </form>
// // // // //         </div>

// // // // //         {/* Contact Info */}
// // // // //         <div className="flex flex-col justify-center bg-gray-50 rounded-lg p-6 shadow-md">
// // // // //           <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
// // // // //           <p className="text-gray-700 mb-4">
// // // // //             You can also reach out to us via the following contact details:
// // // // //           </p>
// // // // //           <ul className="space-y-3 text-gray-700">
// // // // //             <li>
// // // // //               <span className="font-medium">📧 Email:</span> @pdflinx.com
// // // // //             </li>
// // // // //             <li>
// // // // //               <span className="font-medium">📍 Address:</span> Karachi, Pakistan
// // // // //             </li>
// // // // //             <li>
// // // // //               <span className="font-medium">☎ Phone:</span> +92 3332758958
// // // // //             </li>
// // // // //           </ul>
// // // // //         </div>
// // // // //       </div>
// // // // //     </main>
// // // // //   );
// // // // // }
