import React from "react";
import { relatedToolsData } from "../data/relatedTools";

const RelatedTools = ({ currentPage }) => {
  const tools = relatedToolsData?.[currentPage] || [];

  if (!tools.length) return null;

  return (
    <section className="max-w-4xl mx-auto mb-16 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          You Might Also Need
        </h3>

        <div className="space-y-4">
          {tools.map((tool, index) => (
            <a
              key={index}
              href={tool.url}
              className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-2xl mr-4">{tool.emoji}</span>
              <div>
                <h4 className="font-semibold">{tool.title}</h4>
                <p className="text-sm text-gray-600">{tool.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedTools;


















// import React from 'react';
// import { relatedToolsData } from '../data/relatedTools';

// const RelatedToolsSection = ({ currentPage }) => {
//   const tools = relatedToolsData[currentPage] || [];

//   if (tools.length === 0) return null;

//   return (
//     <section className="max-w-4xl mx-auto mb-16 px-4">
//       <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
//         <h3 className="text-2xl font-bold text-gray-900 mb-6">
//           You Might Also Need
//         </h3>

//         <div className="space-y-4">
//           {tools.map((tool, index) => (
//             <a
//               key={index}
//               href={tool.url}
//               className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
//             >
//               <span className="text-2xl mr-4 flex-shrink-0">
//                 {tool.emoji}
//               </span>

//               <div>
//                 <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
//                   {tool.title}
//                 </h4>
//                 <p className="text-sm text-gray-600">
//                   {tool.desc}
//                 </p>
//               </div>
//             </a>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default RelatedToolsSection;





















// // import React from 'react';
// // import { relatedToolsData } from '../data/relatedTools';

// // const RelatedToolsSection = ({ currentPage }) => {
// //   const tools = relatedToolsData[currentPage] || [];
  
// //   if (tools.length === 0) return null;

// //   return (
// //     <section className="max-w-4xl mx-auto mb-16 px-4">
// //       <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
// //         <h3 className="text-2xl font-bold text-gray-900 mb-6">
// //           You Might Also Need
// //         </h3>
        
// //         <div className="space-y-4">
// //           {tools.map((tool, index) => (
            
// //               key={index}
// //               href={tool.url}
// //               className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
// //             >
// //               <span className="text-2xl mr-4 flex-shrink-0">{tool.emoji}</span>
// //               <div>
// //                 <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
// //                   {tool.title}
// //                 </h4>
// //                 <p className="text-sm text-gray-600">{tool.desc}</p>
// //               </div>
// //             </a>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default RelatedToolsSection;