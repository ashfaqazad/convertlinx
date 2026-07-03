// 'use client';

// import { useState, useRef, useCallback } from 'react';
// // import {
// //   User, Mail, Phone, MapPin, Linkedin, Globe,
// //   Plus, Trash2, Download, FileText, Sparkles,
// //   Check, Copy, ChevronDown, Briefcase, GraduationCap,
// //   Wrench, Eye, Edit3, Loader2, RotateCcw, ZoomIn
// // } from 'lucide-react';
// import {
//   User, Mail, Phone, MapPin, Linkedin, Globe,
//   Plus, Trash2, Download, FileText, Sparkles,
//   Check, Copy, ChevronDown, Briefcase, GraduationCap,
//   Wrench, Eye, Edit3, Loader2, RotateCcw, ZoomIn, Lock, Shield 
// } from 'lucide-react';
// import Script from 'next/script';
// import Link from 'next/link';
// import '@/styles/AIResumeBuilder.css';

// const TEMPLATES = [
//   { id: 'classic', name: 'Classic', color: '#059669', bg: '#F0FDF4', icon: '📄' },
//   { id: 'modern', name: 'Modern', color: '#059669', bg: '#ECFDF5', icon: '🎨' },
//   { id: 'minimal', name: 'Minimal', color: '#6B7280', bg: '#F9FAFB', icon: '✨' },
// ];

// const INITIAL_STATE = {
//   personal: {
//     fullName: '',
//     jobTitle: '',
//     email: '',
//     phone: '',
//     location: '',
//     linkedin: '',
//     website: '',
//     summary: '',
//   },
//   experience: [
//     { id: 1, company: '', position: '', startDate: '', endDate: '', current: false, bullets: [''] },
//   ],
//   education: [
//     { id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
//   ],
//   skills: [],
//   skillInput: '',
// };

// export default function AIResumeBuilder() {
//   const [formData, setFormData] = useState(INITIAL_STATE);
//   const [template, setTemplate] = useState('classic');
//   const [activeTab, setActiveTab] = useState('edit');
//   const [loading, setLoading] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [skillInput, setSkillInput] = useState('');
//   const [copied, setCopied] = useState(false);
//   const resumeRef = useRef(null);

//   // ── PERSONAL INFO HANDLERS ──
//   const updatePersonal = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       personal: { ...prev.personal, [field]: value }
//     }));
//   };

//   // ── EXPERIENCE HANDLERS ──
//   const addExperience = () => {
//     setFormData(prev => ({
//       ...prev,
//       experience: [...prev.experience, {
//         id: Date.now(),
//         company: '', position: '', startDate: '', endDate: '', current: false, bullets: ['']
//       }]
//     }));
//   };

//   const updateExperience = (id, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       experience: prev.experience.map(exp =>
//         exp.id === id ? { ...exp, [field]: value } : exp
//       )
//     }));
//   };

//   const updateBullet = (expId, bulletIndex, value) => {
//     setFormData(prev => ({
//       ...prev,
//       experience: prev.experience.map(exp =>
//         exp.id === expId
//           ? { ...exp, bullets: exp.bullets.map((b, i) => i === bulletIndex ? value : b) }
//           : exp
//       )
//     }));
//   };

//   const addBullet = (expId) => {
//     setFormData(prev => ({
//       ...prev,
//       experience: prev.experience.map(exp =>
//         exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
//       )
//     }));
//   };

//   const removeBullet = (expId, bulletIndex) => {
//     setFormData(prev => ({
//       ...prev,
//       experience: prev.experience.map(exp =>
//         exp.id === expId
//           ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIndex) }
//           : exp
//       )
//     }));
//   };

//   const removeExperience = (id) => {
//     setFormData(prev => ({
//       ...prev,
//       experience: prev.experience.filter(exp => exp.id !== id)
//     }));
//   };

//   // ── EDUCATION HANDLERS ──
//   const addEducation = () => {
//     setFormData(prev => ({
//       ...prev,
//       education: [...prev.education, {
//         id: Date.now(),
//         institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: ''
//       }]
//     }));
//   };

//   const updateEducation = (id, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       education: prev.education.map(edu =>
//         edu.id === id ? { ...edu, [field]: value } : edu
//       )
//     }));
//   };

//   const removeEducation = (id) => {
//     setFormData(prev => ({
//       ...prev,
//       education: prev.education.filter(edu => edu.id !== id)
//     }));
//   };

//   // ── SKILLS HANDLERS ──
//   const addSkill = () => {
//     const skill = skillInput.trim();
//     if (skill && !formData.skills.includes(skill)) {
//       setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
//       setSkillInput('');
//     }
//   };

//   const removeSkill = (skill) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.filter(s => s !== skill)
//     }));
//   };

//   // ── AI ENHANCE ──
//   const enhanceWithAI = async (type, data) => {
//     setAiLoading(true);
//     try {
//       let prompt = '';
//       if (type === 'summary') {
//         prompt = `You are a professional resume writer. Enhance this professional summary to be more impactful and ATS-friendly. Return ONLY the enhanced summary text, nothing else. Original: "${data || 'No summary provided. Write a professional summary for a ' + formData.personal.jobTitle}"`;
//       } else if (type === 'bullet') {
//         prompt = `You are a professional resume writer. Enhance this resume bullet point to be more impactful using action verbs and quantifiable results. Return ONLY the enhanced bullet point text, nothing else. Original: "${data}"`;
//       } else if (type === 'all') {
//         prompt = `You are a professional resume writer. Enhance ALL the following resume content. Return a valid JSON object with this exact structure, no other text:
// {
//   "summary": "enhanced summary",
//   "experience": [
//     {
//       "company": "same company name",
//       "position": "same position",
//       "bullets": ["enhanced bullet 1", "enhanced bullet 2"]
//     }
//   ],
//   "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"]
// }

// Original data:
// Summary: ${formData.personal.summary || 'No summary'}
// Experience: ${JSON.stringify(formData.experience)}
// Skills: ${JSON.stringify(formData.skills)}`;
//       }

//       const response = await fetch('https://text.pollinations.ai/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           messages: [{ role: 'user', content: prompt }],
//           model: 'openai',
//           temperature: 0.7
//         })
//       });

//       const text = await response.text();

//       if (type === 'all') {
//         let parsed;
//         try {
//           parsed = JSON.parse(text);
//         } catch {
//           const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
//           if (jsonMatch) parsed = JSON.parse(jsonMatch[1].trim());
//           else {
//             const objMatch = text.match(/\{[\s\S]*\}/);
//             if (objMatch) parsed = JSON.parse(objMatch[0]);
//             else throw new Error('Parse failed');
//           }
//         }
//         if (parsed.summary) updatePersonal('summary', parsed.summary);
//         if (parsed.experience) {
//           setFormData(prev => ({
//             ...prev,
//             experience: prev.experience.map((exp, i) => ({
//               ...exp,
//               bullets: parsed.experience[i]?.bullets || exp.bullets
//             }))
//           }));
//         }
//         if (parsed.skills) {
//           setFormData(prev => ({ ...prev, skills: parsed.skills }));
//         }
//       } else {
//         const enhanced = text.replace(/^["']|["']$/g, '').trim();
//         if (type === 'summary') {
//           updatePersonal('summary', enhanced);
//         }
//         return enhanced;
//       }
//     } catch (error) {
//       console.error('AI enhancement error:', error);
//       alert('AI enhancement failed. Please try again.');
//     }
//     setAiLoading(false);
//   };

//   // ── PDF DOWNLOAD ──
//   const downloadPDF = async () => {
//     if (!resumeRef.current) return;
//     setLoading(true);
//     try {
//       const html2pdf = (await import('html2pdf.js')).default;
//       const element = resumeRef.current;
//       const opt = {
//         margin: 0,
//         filename: `${formData.personal.fullName || 'resume'}.pdf`,
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2, useCORS: true },
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//       };
//       await html2pdf().set(opt).from(element).save();
//     } catch (error) {
//       console.error('PDF generation error:', error);
//       // Fallback: print
//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(`
//         <html>
//           <head>
//             <title>${formData.personal.fullName || 'Resume'}</title>
//             <style>
//               body { margin: 0; font-family: 'Segoe UI', system-ui, sans-serif; }
//               @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
//             </style>
//             <link rel="stylesheet" href="/styles/AIResumeBuilder.css" />
//           </head>
//           <body onload="window.print();window.close();">
//             ${resumeRef.current.outerHTML}
//           </body>
//         </html>
//       `);
//       printWindow.document.close();
//     }
//     setLoading(false);
//   };

//   // ── HTML EXPORT ──
//   const exportHTML = () => {
//     const htmlContent = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>${formData.personal.fullName || 'Resume'}</title>
//   <style>
//     * { margin: 0; padding: 0; box-sizing: border-box; }
//     body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 11px; line-height: 1.5; color: #1a1a2e; padding: 40px; }
//     @page { size: A4; margin: 0; }
//     @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
//     ${getTemplateStyles(template)}
//   </style>
// </head>
// <body>
//   ${resumeRef.current?.innerHTML || ''}
// </body>
// </html>`;

//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${formData.personal.fullName || 'resume'}.html`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // ── COPY TO CLIPBOARD ──
//   const copyResumeText = async () => {
//     const text = generatePlainTextResume();
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ── GENERATE PLAIN TEXT ──
//   const generatePlainTextResume = () => {
//     const { personal, experience, education, skills } = formData;
//     let text = `${personal.fullName}\n${personal.jobTitle}\n\n`;
//     text += `Email: ${personal.email}\n`;
//     if (personal.phone) text += `Phone: ${personal.phone}\n`;
//     if (personal.location) text += `Location: ${personal.location}\n`;
//     if (personal.linkedin) text += `LinkedIn: ${personal.linkedin}\n`;
//     if (personal.website) text += `Website: ${personal.website}\n`;
//     text += `\n${personal.summary}\n\n`;
//     text += `EXPERIENCE\n${'='.repeat(40)}\n`;
//     experience.forEach(exp => {
//       text += `${exp.position} at ${exp.company}\n`;
//       text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
//       exp.bullets.filter(b => b).forEach(b => { text += `• ${b}\n`; });
//       text += '\n';
//     });
//     text += `EDUCATION\n${'='.repeat(40)}\n`;
//     education.forEach(edu => {
//       text += `${edu.degree} in ${edu.field}\n${edu.institution}\n`;
//       text += `${edu.startDate} - ${edu.endDate}\n`;
//       if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
//       text += '\n';
//     });
//     text += `SKILLS\n${'='.repeat(40)}\n${skills.join(', ')}`;
//     return text;
//   };

//   // ── RESET ──
//   const resetForm = () => {
//     if (confirm('Are you sure you want to reset all data?')) {
//       setFormData(INITIAL_STATE);
//     }
//   };

//   // ── GET TEMPLATE INLINE STYLES ──
//   const getTemplateStyles = (tpl) => {
//     // Returns CSS string for export
//     return '';
//   };

//   // ── RENDER RESUME PREVIEW ──
//   const renderResumeContent = () => {
//     const { personal, experience, education, skills } = formData;

//     if (template === 'modern') {
//       return (
//         <div className="arb-tpl-modern">
//           <div className="arb-r-sidebar">
//             <div className="arb-r-name">{personal.fullName || 'Your Name'}</div>
//             <div className="arb-r-title">{personal.jobTitle || 'Job Title'}</div>
            
//             <div className="arb-r-section-title">Contact</div>
//             {personal.email && (
//               <div className="arb-r-contact-item">
//                 <Mail size={14} /> <span>{personal.email}</span>
//               </div>
//             )}
//             {personal.phone && (
//               <div className="arb-r-contact-item">
//                 <Phone size={14} /> <span>{personal.phone}</span>
//               </div>
//             )}
//             {personal.location && (
//               <div className="arb-r-contact-item">
//                 <MapPin size={14} /> <span>{personal.location}</span>
//               </div>
//             )}
//             {personal.linkedin && (
//               <div className="arb-r-contact-item">
//                 <Linkedin size={14} /> <span style={{ wordBreak: 'break-all' }}>{personal.linkedin}</span>
//               </div>
//             )}
//             {personal.website && (
//               <div className="arb-r-contact-item">
//                 <Globe size={14} /> <span style={{ wordBreak: 'break-all' }}>{personal.website}</span>
//               </div>
//             )}

//             {skills.length > 0 && (
//               <>
//                 <div className="arb-r-section-title">Skills</div>
//                 <div>
//                   {skills.map((skill, i) => (
//                     <span key={i} className="arb-r-skill-item">{skill}</span>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
          
//           <div className="arb-r-main">
//             {personal.summary && (
//               <>
//                 <div className="arb-r-section-title">Profile</div>
//                 <p style={{ color: '#4B5563', fontSize: '11px', lineHeight: 1.6, marginBottom: '16px' }}>
//                   {personal.summary}
//                 </p>
//               </>
//             )}

//             {experience.some(e => e.company || e.position) && (
//               <>
//                 <div className="arb-r-section-title">Experience</div>
//                 {experience.filter(e => e.company || e.position).map((exp) => (
//                   <div key={exp.id} style={{ marginBottom: '16px' }}>
//                     <div className="arb-r-entry-header">
//                       <span className="arb-r-entry-title">{exp.position || 'Position'}</span>
//                       <span className="arb-r-entry-date">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
//                     </div>
//                     <div className="arb-r-entry-subtitle">{exp.company || 'Company'}</div>
//                     {exp.bullets.filter(b => b).map((bullet, i) => (
//                       <div key={i} className="arb-r-bullet">{bullet}</div>
//                     ))}
//                   </div>
//                 ))}
//               </>
//             )}

//             {education.some(e => e.institution || e.degree) && (
//               <>
//                 <div className="arb-r-section-title">Education</div>
//                 {education.filter(e => e.institution || e.degree).map((edu) => (
//                   <div key={edu.id} style={{ marginBottom: '12px' }}>
//                     <div className="arb-r-entry-header">
//                       <span className="arb-r-entry-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
//                       <span className="arb-r-entry-date">{edu.startDate} - {edu.endDate}</span>
//                     </div>
//                     <div className="arb-r-entry-subtitle">{edu.institution || 'Institution'}</div>
//                     {edu.gpa && <div style={{ fontSize: '11px', color: '#6B7280' }}>GPA: {edu.gpa}</div>}
//                   </div>
//                 ))}
//               </>
//             )}
//           </div>
//         </div>
//       );
//     }

//     // Classic & Minimal share most structure
//     const isMinimal = template === 'minimal';
//     return (
//       <>
//         <div className={isMinimal ? 'arb-r-name' : 'arb-r-name'} style={isMinimal ? { fontWeight: 300, letterSpacing: '0.02em', fontSize: '32px' } : {}}>
//           {personal.fullName || 'Your Name'}
//         </div>
//         <div className="arb-r-title" style={isMinimal ? { letterSpacing: '0.05em', textTransform: 'uppercase' } : {}}>
//           {personal.jobTitle || 'Job Title'}
//         </div>

//         <div className="arb-r-contact" style={isMinimal ? { marginBottom: '24px' } : {}}>
//           {personal.email && <span>{personal.email}</span>}
//           {personal.phone && <span>{personal.phone}</span>}
//           {personal.location && <span>{personal.location}</span>}
//           {personal.linkedin && <span>{personal.linkedin}</span>}
//           {personal.website && <span>{personal.website}</span>}
//         </div>

//         {personal.summary && (
//           <>
//             <div className="arb-r-section-title">Professional Summary</div>
//             <p style={{ color: '#4B5563', fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
//               {personal.summary}
//             </p>
//           </>
//         )}

//         {experience.some(e => e.company || e.position) && (
//           <>
//             <div className="arb-r-section-title">Work Experience</div>
//             {experience.filter(e => e.company || e.position).map((exp) => (
//               <div key={exp.id} style={{ marginBottom: '16px' }}>
//                 <div className="arb-r-entry-header">
//                   <span className="arb-r-entry-title">{exp.position || 'Position'}</span>
//                   <span className="arb-r-entry-date">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
//                 </div>
//                 <div className="arb-r-entry-subtitle">{exp.company || 'Company'}</div>
//                 {exp.bullets.filter(b => b).map((bullet, i) => (
//                   <div key={i} className="arb-r-bullet">{bullet}</div>
//                 ))}
//               </div>
//             ))}
//           </>
//         )}

//         {education.some(e => e.institution || e.degree) && (
//           <>
//             <div className="arb-r-section-title">Education</div>
//             {education.filter(e => e.institution || e.degree).map((edu) => (
//               <div key={edu.id} style={{ marginBottom: '12px' }}>
//                 <div className="arb-r-entry-header">
//                   <span className="arb-r-entry-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
//                   <span className="arb-r-entry-date">{edu.startDate} - {edu.endDate}</span>
//                 </div>
//                 <div className="arb-r-entry-subtitle">{edu.institution || 'Institution'}</div>
//                 {edu.gpa && <div style={{ fontSize: '11px', color: '#6B7280' }}>GPA: {edu.gpa}</div>}
//               </div>
//             ))}
//           </>
//         )}

//         {skills.length > 0 && (
//           <>
//             <div className="arb-r-section-title">Skills</div>
//             <div className="arb-r-skills-list">
//               {skills.map((skill, i) => (
//                 <span key={i} className="arb-r-skill-item">{skill}</span>
//               ))}
//             </div>
//           </>
//         )}
//       </>
//     );
//   };

//   const faqs = [
//     { q: 'Is the AI Resume Builder free?', a: 'Yes — completely free with unlimited resumes, AI enhancements, and downloads. No signup or credit card required.' },
//     { q: 'How does the AI enhancement work?', a: 'Our AI analyzes your resume content and rewrites it to be more professional, ATS-friendly, and impactful using action verbs and quantifiable results. It uses the same technology as premium resume writing services.' },
//     { q: 'Can I download my resume as a PDF?', a: 'Yes — click "Download PDF" to get a perfectly formatted A4 PDF file. You can also export as HTML or copy as plain text.' },
//     { q: 'What resume templates are available?', a: 'We offer 3 professional templates: Classic (traditional format), Modern (two-column with sidebar), and Minimal (clean, minimalist design). All are ATS-compatible.' },
//     { q: 'Is my resume data stored on your servers?', a: 'No — all data stays in your browser. Nothing is uploaded to any server. Your resume information is completely private.' },
//     { q: 'What does ATS-friendly mean?', a: 'ATS (Applicant Tracking System) is software used by employers to filter resumes. Our templates use clean formatting, standard fonts, and proper heading structures that ATS can easily parse.' },
//     { q: 'Can I enhance individual bullet points with AI?', a: 'Yes — each bullet point has an AI button. Click it to enhance that specific point without changing the rest of your resume.' },
//     { q: 'How do I make my resume stand out?', a: 'Use the "Enhance All with AI" feature to improve your entire resume at once. Focus on quantifiable achievements (e.g., "Increased sales by 25%"), use action verbs, and tailor content to the job description.' },
//     { q: 'Can I use this for different job applications?', a: 'Absolutely — create multiple versions of your resume tailored to different positions. Reset the form or modify existing content for each application.' },
//     { q: 'What file formats can I export?', a: 'PDF (for submitting to employers), HTML (for web portfolios or email), and plain text (for pasting into online application forms).' },
//   ];

//   return (
//     <>
//       {/* ── SCHEMA: HowTo ── */}
//       <Script
//         id="howto-schema-resume"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             '@context': 'https://schema.org',
//             '@type': 'HowTo',
//             name: 'How to Create a Professional Resume for Free with AI',
//             description: 'Build a professional, ATS-friendly resume in minutes using our free AI Resume Builder — with AI-powered content enhancement, multiple templates, and PDF download.',
//             url: 'https://convertlinx.com/ai-resume-builder',
//             totalTime: 'PT5M',
//             estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
//             supply: [{ '@type': 'HowToSupply', name: 'Your work experience, education, and skills information' }],
//             tool: [{ '@type': 'HowToTool', name: 'ConvertLinx AI Resume Builder' }],
//             step: [
//               { '@type': 'HowToStep', name: 'Enter Your Information', text: 'Fill in your personal details, work experience, education, and skills in the form.' },
//               { '@type': 'HowToStep', name: 'Enhance with AI', text: 'Click "Enhance All with AI" to automatically improve your resume content for maximum impact.' },
//               { '@type': 'HowToStep', name: 'Choose a Template', text: 'Select from Classic, Modern, or Minimal resume templates — all ATS-friendly.' },
//               { '@type': 'HowToStep', name: 'Download Your Resume', text: 'Download as PDF, export as HTML, or copy as plain text — ready to submit.' },
//             ],
//           }),
//         }}
//       />

//       {/* ── SCHEMA: BreadcrumbList ── */}
//       <Script
//         id="breadcrumb-schema-resume"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             '@context': 'https://schema.org',
//             '@type': 'BreadcrumbList',
//             itemListElement: [
//               { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertlinx.com/' },
//               { '@type': 'ListItem', position: 2, name: 'AI Resume Builder', item: 'https://convertlinx.com/ai-resume-builder' },
//             ],
//           }),
//         }}
//       />

//       <main className="arb-page">

//         {/* ── HERO ── */}
//         <section className="arb-hero">
//           <div className="arb-blob-1" />
//           <div className="arb-blob-2" />
//           <div className="relative z-10 max-w-3xl mx-auto">
//             <div className="flex items-center justify-center gap-2 text-sm mb-5">
//               <a href="/" className="arb-breadcrumb-link">Home</a>
//               <span style={{ color: '#C4B5FD' }}>/</span>
//               <span style={{ color: '#059669' }}>AI Resume Builder</span>
//             </div>
//             <span className="arb-badge">Free AI Tool</span>
//             <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
//               AI Resume <span className="arb-grad-text">Builder</span>
//             </h1>
//             <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
//               Create a professional, ATS-friendly resume in minutes. Our AI enhances your content
//               with powerful action verbs and quantifiable achievements. Choose from 3 templates,
//               download as PDF — completely free, no signup required.
//             </p>
//             <div className="flex flex-wrap justify-center gap-3 mt-6">
//               <span className="arb-ai-badge">
//                 <Sparkles size={14} /> AI-Powered Enhancement
//               </span>
//               <span className="arb-ai-badge" style={{ background: 'rgba(5,150,105,0.08)', borderColor: 'rgba(5,150,105,0.2)', color: '#059669' }}>
//                 <Check size={14} /> ATS-Friendly Templates
//               </span>
//             </div>
//           </div>
//         </section>

//         {/* ── TOOL WORKSPACE ── */}
//         <section className="arb-section-main py-10 px-6">
//           <div className="max-w-6xl mx-auto arb-fade-up">

//             {/* Template Selector */}
//             <div className="arb-template-grid mb-8">
//               {TEMPLATES.map((tpl) => (
//                 <div
//                   key={tpl.id}
//                   className={`arb-template-card ${template === tpl.id ? 'active' : ''}`}
//                   onClick={() => setTemplate(tpl.id)}
//                 >
//                   <div className="arb-template-preview" style={{ background: tpl.bg }}>
//                     {tpl.icon}
//                   </div>
//                   <div className="arb-template-name">{tpl.name}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Tabs */}
//             <div className="arb-tabs">
//               <button className={`arb-tab ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>
//                 <Edit3 size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
//                 Edit
//               </button>
//               <button className={`arb-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>
//                 <Eye size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
//                 Preview
//               </button>
//             </div>

//             {/* Workspace Grid */}
//             <div className="arb-workspace-grid">
//               {/* LEFT: Edit Panel */}
//               <div className={activeTab === 'preview' ? 'hidden lg:block' : ''}>
//                 <div className="arb-tool-card" style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '8px' }}>

//                   {/* Personal Info Section */}
//                   <div className="arb-section-header">
//                     <div className="arb-section-icon" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>
//                       <User size={18} />
//                     </div>
//                     <span className="arb-section-title">Personal Information</span>
//                   </div>

//                   <div className="arb-input-grid">
//                     <div className="arb-input-group">
//                       <label className="arb-label">Full Name *</label>
//                       <input className="arb-input" value={formData.personal.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} placeholder="John Doe" />
//                     </div>
//                     <div className="arb-input-group">
//                       <label className="arb-label">Job Title *</label>
//                       <input className="arb-input" value={formData.personal.jobTitle} onChange={(e) => updatePersonal('jobTitle', e.target.value)} placeholder="Software Engineer" />
//                     </div>
//                   </div>
//                   <div className="arb-input-grid">
//                     <div className="arb-input-group">
//                       <label className="arb-label"><Mail size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} /> Email *</label>
//                       <input className="arb-input" type="email" value={formData.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} placeholder="john@example.com" />
//                     </div>
//                     <div className="arb-input-group">
//                       <label className="arb-label"><Phone size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} /> Phone</label>
//                       <input className="arb-input" value={formData.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
//                     </div>
//                   </div>
//                   <div className="arb-input-grid">
//                     <div className="arb-input-group">
//                       <label className="arb-label"><MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} /> Location</label>
//                       <input className="arb-input" value={formData.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} placeholder="New York, NY" />
//                     </div>
//                     <div className="arb-input-group">
//                       <label className="arb-label"><Linkedin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} /> LinkedIn</label>
//                       <input className="arb-input" value={formData.personal.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
//                     </div>
//                   </div>
//                   <div className="arb-input-group">
//                     <label className="arb-label"><Globe size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} /> Website / Portfolio</label>
//                     <input className="arb-input" value={formData.personal.website} onChange={(e) => updatePersonal('website', e.target.value)} placeholder="johndoe.com" />
//                   </div>

//                   {/* Summary */}
//                   <div className="arb-input-group">
//                     <div className="flex items-center justify-between mb-1">
//                       <label className="arb-label" style={{ marginBottom: 0 }}>Professional Summary</label>
//                       <button
//                         className="arb-copy-btn"
//                         onClick={() => enhanceWithAI('summary', formData.personal.summary)}
//                         disabled={aiLoading}
//                       >
//                         {aiLoading ? <Loader2 size={12} className="spin" /> : <Sparkles size={12} />}
//                         {aiLoading ? 'Enhancing...' : 'AI Enhance'}
//                       </button>
//                     </div>
//                     <textarea className="arb-input" rows={4} value={formData.personal.summary} onChange={(e) => updatePersonal('summary', e.target.value)} placeholder="A brief professional summary highlighting your key qualifications and career goals..." />
//                   </div>

//                   {/* Experience Section */}
//                   <div className="arb-section-header mt-6">
//                     <div className="arb-section-icon" style={{ background: 'rgba(2,132,199,0.1)', color: '#0284C7' }}>
//                       <Briefcase size={18} />
//                     </div>
//                     <span className="arb-section-title">Work Experience</span>
//                     <button className="arb-btn arb-btn-sm arb-btn-outline ml-auto" onClick={addExperience}>
//                       <Plus size={14} /> Add
//                     </button>
//                   </div>

//                   {formData.experience.map((exp, expIndex) => (
//                     <div key={exp.id} className="arb-entry-item">
//                       <button className="arb-btn arb-btn-icon arb-btn-secondary arb-remove-btn" onClick={() => removeExperience(exp.id)}>
//                         <Trash2 size={14} />
//                       </button>
//                       <div className="arb-input-grid">
//                         <div className="arb-input-group">
//                           <label className="arb-label">Company</label>
//                           <input className="arb-input" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Google" />
//                         </div>
//                         <div className="arb-input-group">
//                           <label className="arb-label">Position</label>
//                           <input className="arb-input" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} placeholder="Senior Engineer" />
//                         </div>
//                       </div>
//                       <div className="arb-input-grid">
//                         <div className="arb-input-group">
//                           <label className="arb-label">Start Date</label>
//                           <input className="arb-input" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2020" />
//                         </div>
//                         <div className="arb-input-group">
//                           <label className="arb-label">End Date</label>
//                           <input className="arb-input" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Dec 2023" disabled={exp.current} />
//                           <label className="flex items-center gap-2 mt-1 text-xs text-gray-500 cursor-pointer">
//                             <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} />
//                             Currently working here
//                           </label>
//                         </div>
//                       </div>
//                       <div className="arb-input-group">
//                         <label className="arb-label">Key Achievements</label>
//                         {exp.bullets.map((bullet, bulletIndex) => (
//                           <div key={bulletIndex} className="flex gap-2 mb-2">
//                             <input
//                               className="arb-input"
//                               value={bullet}
//                               onChange={(e) => updateBullet(exp.id, bulletIndex, e.target.value)}
//                               placeholder="Describe an achievement or responsibility..."
//                             />
//                             <button
//                               className="arb-btn arb-btn-icon arb-btn-secondary flex-shrink-0"
//                               onClick={() => enhanceWithAI('bullet', bullet)}
//                               disabled={aiLoading || !bullet}
//                               title="AI Enhance this point"
//                             >
//                               <Sparkles size={14} style={{ color: '#6366F1' }} />
//                             </button>
//                             {exp.bullets.length > 1 && (
//                               <button
//                                 className="arb-btn arb-btn-icon arb-btn-secondary flex-shrink-0"
//                                 onClick={() => removeBullet(exp.id, bulletIndex)}
//                               >
//                                 <Trash2 size={14} />
//                               </button>
//                             )}
//                           </div>
//                         ))}
//                         <button className="arb-btn arb-btn-sm arb-btn-outline" onClick={() => addBullet(exp.id)}>
//                           <Plus size={14} /> Add Point
//                         </button>
//                       </div>
//                     </div>
//                   ))}

//                   {/* Education Section */}
//                   <div className="arb-section-header mt-6">
//                     <div className="arb-section-icon" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366F1' }}>
//                       <GraduationCap size={18} />
//                     </div>
//                     <span className="arb-section-title">Education</span>
//                     <button className="arb-btn arb-btn-sm arb-btn-outline ml-auto" onClick={addEducation}>
//                       <Plus size={14} /> Add
//                     </button>
//                   </div>

//                   {formData.education.map((edu) => (
//                     <div key={edu.id} className="arb-entry-item">
//                       <button className="arb-btn arb-btn-icon arb-btn-secondary arb-remove-btn" onClick={() => removeEducation(edu.id)}>
//                         <Trash2 size={14} />
//                       </button>
//                       <div className="arb-input-grid">
//                         <div className="arb-input-group">
//                           <label className="arb-label">Institution</label>
//                           <input className="arb-input" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="MIT" />
//                         </div>
//                         <div className="arb-input-group">
//                           <label className="arb-label">Degree</label>
//                           <input className="arb-input" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Science" />
//                         </div>
//                       </div>
//                       <div className="arb-input-grid">
//                         <div className="arb-input-group">
//                           <label className="arb-label">Field of Study</label>
//                           <input className="arb-input" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
//                         </div>
//                         <div className="arb-input-group">
//                           <label className="arb-label">GPA (Optional)</label>
//                           <input className="arb-input" value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.8/4.0" />
//                         </div>
//                       </div>
//                       <div className="arb-input-grid">
//                         <div className="arb-input-group">
//                           <label className="arb-label">Start Date</label>
//                           <input className="arb-input" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} placeholder="Sep 2016" />
//                         </div>
//                         <div className="arb-input-group">
//                           <label className="arb-label">End Date</label>
//                           <input className="arb-input" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} placeholder="Jun 2020" />
//                         </div>
//                       </div>
//                     </div>
//                   ))}

//                   {/* Skills Section */}
//                   <div className="arb-section-header mt-6">
//                     <div className="arb-section-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
//                       <Wrench size={18} />
//                     </div>
//                     <span className="arb-section-title">Skills</span>
//                   </div>
//                   <div className="flex gap-2 mb-3">
//                     <input
//                       className="arb-input"
//                       value={skillInput}
//                       onChange={(e) => setSkillInput(e.target.value)}
//                       onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
//                       placeholder="Type a skill and press Enter..."
//                     />
//                     <button className="arb-btn arb-btn-primary arb-btn-sm flex-shrink-0" onClick={addSkill}>
//                       <Plus size={14} />
//                     </button>
//                   </div>
//                   <div className="arb-skills-container">
//                     {formData.skills.map((skill) => (
//                       <span key={skill} className="arb-skill-tag">
//                         {skill}
//                         <button onClick={() => removeSkill(skill)}><Trash2 size={12} /></button>
//                       </span>
//                     ))}
//                   </div>

//                   {/* AI Enhance All Button */}
//                   <div className="mt-8 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(5,150,105,0.05))', border: '1px dashed rgba(99,102,241,0.3)' }}>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>
//                           <Sparkles size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px', color: '#6366F1' }} />
//                           AI Power Enhancement
//                         </div>
//                         <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
//                           Enhance summary, bullet points, and optimize skills — all at once
//                         </div>
//                       </div>
//                       <button
//                         className="arb-btn arb-btn-primary"
//                         onClick={() => enhanceWithAI('all')}
//                         disabled={aiLoading}
//                       >
//                         {aiLoading ? <><Loader2 size={14} className="spin" /> Processing...</> : <>Enhance All <Sparkles size={14} /></>}
//                       </button>
//                     </div>
//                   </div>

//                 </div>
//               </div>

//               {/* RIGHT: Preview Panel */}
//               <div className={activeTab === 'edit' ? 'hidden lg:block' : ''}>
//                 <div className="arb-tool-card" style={{ padding: '16px' }}>
//                   <div className="flex items-center justify-between mb-4">
//                     <span className="text-sm font-semibold" style={{ color: '#374151' }}>
//                       <ZoomIn size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
//                       Live Preview
//                     </span>
//                     <span className="text-xs" style={{ color: '#9CA3AF' }}>Template: {TEMPLATES.find(t => t.id === template)?.name}</span>
//                   </div>
//                   <div className="arb-preview-wrapper">
//                     <div ref={resumeRef} className={`arb-resume-page arb-tpl-${template}`}>
//                       {renderResumeContent()}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="mt-4 space-y-3">
//                   <button onClick={downloadPDF} disabled={loading} className="arb-btn arb-btn-primary w-full justify-center">
//                     {loading ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
//                     {loading ? 'Generating PDF...' : 'Download PDF'}
//                   </button>
//                   <div className="grid grid-cols-2 gap-3">
//                     <button onClick={exportHTML} className="arb-btn arb-btn-secondary w-full justify-center">
//                       <FileText size={14} /> Export HTML
//                     </button>
//                     <button onClick={copyResumeText} className="arb-btn arb-btn-secondary w-full justify-center">
//                       {copied ? <Check size={14} /> : <Copy size={14} />}
//                       {copied ? 'Copied!' : 'Copy Text'}
//                     </button>
//                   </div>
//                   <button onClick={resetForm} className="arb-btn arb-btn-outline arb-btn-sm w-full justify-center">
//                     <RotateCcw size={14} /> Reset All Data
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Trust row */}
//             <div className="flex flex-wrap justify-center gap-5 mt-8">
//               {['No signup required', 'Unlimited resumes', 'AI-powered', '100% free', 'ATS-friendly', 'PDF download'].map((t, i) => (
//                 <span key={i} className="arb-trust-item">
//                   <span className="arb-trust-dot" />
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── HOW IT WORKS ── */}
//         <hr className="arb-divider" />
//         <section className="arb-section-alt py-16 px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
//               How to Build Your Resume in 4 Steps
//             </h2>
//             <div className="grid md:grid-cols-4 gap-6">
//               {[
//                 { num: '1', title: 'Enter Your Info', desc: 'Fill in your personal details, work experience, education, and skills.' },
//                 { num: '2', title: 'AI Enhancement', desc: 'Let our AI improve your content with powerful action verbs and achievements.' },
//                 { num: '3', title: 'Choose Template', desc: 'Select from Classic, Modern, or Minimal — all ATS-friendly designs.' },
//                 { num: '4', title: 'Download & Apply', desc: 'Download as PDF, HTML, or copy text — ready to submit to employers.' },
//               ].map((s, i) => (
//                 <div key={i} className="arb-step-card">
//                   <div className="arb-step-num">{s.num}</div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BENEFITS ── */}
//         <hr className="arb-divider" />
//         <section className="arb-section-main py-16 px-6">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Why Use ConvertLinx AI Resume Builder?
//             </h2>
//             <div className="grid md:grid-cols-3 gap-5">
//               {[
//                 {
//                   icon: <Sparkles size={24} />,
//                   color: '#6366F1',
//                   bg: 'rgba(99,102,241,0.08)',
//                   title: 'AI-Powered Content',
//                   desc: 'Our AI rewrites your resume bullets with action verbs and quantifiable results — the same technique professional resume writers use.',
//                 },
//                 {
//                   icon: <Shield size={24} />,
//                   color: '#059669',
//                   bg: 'rgba(5,150,105,0.08)',
//                   title: 'ATS-Friendly Templates',
//                   desc: 'All templates use clean formatting that Applicant Tracking Systems can parse correctly — no graphics, tables, or complex layouts.',
//                 },
//                 {
//                   icon: <Lock size={24} />,
//                   color: '#0284C7',
//                   bg: 'rgba(2,132,199,0.08)',
//                   title: '100% Private',
//                   desc: 'Your resume data never leaves your browser. No servers, no storage, no data collection. Complete privacy guaranteed.',
//                 },
//               ].map((b, i) => (
//                 <div key={i} className="arb-benefit-card">
//                   <div className="arb-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
//                   <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── SEO CONTENT ── */}
//         <hr className="arb-divider" />
//         <section className="arb-section-alt py-16 px-6">
//           <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

//             <div>
//               <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
//                 What Is an AI Resume Builder?
//               </h2>
//               <p className="leading-7 text-sm">
//                 An AI resume builder is a tool that helps you create professional resumes using artificial intelligence
//                 to enhance and optimize your content. Unlike traditional resume templates where you fill in blanks,
//                 our AI analyzes your input and rewrites it to be more impactful — adding action verbs, quantifying
//                 achievements, and structuring content to pass Applicant Tracking Systems (ATS).
//               </p>
//               <p className="leading-7 text-sm mt-3">
//                 The result is a resume that reads like it was written by a professional resume writer, but in a
//                 fraction of the time and at zero cost. Whether you're a fresh graduate, mid-career professional,
//                 or executive — our AI adapts its enhancement to your experience level.
//               </p>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
//                 Why Your Resume Needs AI Enhancement
//               </h3>
//               <p className="leading-7 text-sm">
//                 Studies show that recruiters spend an average of 7.4 seconds scanning a resume. Your content needs
//                 to instantly communicate value. Our AI transforms weak descriptions like "responsible for managing
//                 a team" into powerful statements like "Led a cross-functional team of 12, improving project delivery
//                 speed by 35% through agile methodology implementation."
//               </p>
//               <p className="leading-7 text-sm mt-3">
//                 The AI also ensures your resume uses industry-standard keywords that ATS software looks for,
//                 significantly increasing your chances of getting past automated screening to reach a human recruiter.
//               </p>
//             </div>

//             <div className="arb-seo-box">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
//                 Common Resume Mistakes This Tool Fixes
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Weak, generic descriptions without measurable results',
//                   'Missing action verbs at the start of bullet points',
//                   'Inconsistent formatting that confuses ATS parsers',
//                   'Too long or too short resume for experience level',
//                   'Irrelevant information diluting key qualifications',
//                   'Poor keyword optimization for target job descriptions',
//                   'Grammar and phrasing that sounds unprofessional',
//                   'Skills listed without context or proficiency level',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="arb-feature-dot" />
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This Tool?</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Fresh graduates creating their first professional resume',
//                   'Professionals switching careers who need to reposition experience',
//                   'Senior executives needing concise, impactful summaries',
//                   'Job seekers applying to companies that use ATS screening',
//                   'Anyone who struggles with "selling themselves" on paper',
//                   'Professionals targeting multiple roles with tailored resumes',
//                   'Non-native English speakers needing language optimization',
//                   'Career coaches helping clients improve their resumes',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="font-bold mt-0.5" style={{ color: '#059669' }}>→</span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="arb-seo-box">
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {[
//                   'Free, unlimited resume creation — no paywall',
//                   'AI-powered content enhancement with one click',
//                   'Individual bullet point enhancement option',
//                   '3 professional, ATS-friendly templates',
//                   'Real-time live preview as you type',
//                   'PDF download with perfect A4 formatting',
//                   'HTML export for web portfolios',
//                   'Plain text copy for online applications',
//                   'Multiple experience and education entries',
//                   'Skills management with easy add/remove',
//                   'Nothing stored — complete data privacy',
//                   'Works on mobile, tablet, and desktop',
//                 ].map((f, i) => (
//                   <div key={i} className="flex items-center gap-2.5 text-sm">
//                     <span className="arb-feature-dot" />
//                     <span>{f}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
//                 Understanding ATS-Friendly Resumes
//               </h3>
//               <p className="leading-7 text-sm">
//                 Applicant Tracking Systems (ATS) are used by over 98% of Fortune 500 companies to filter resumes
//                 before a human ever sees them. These systems parse your resume looking for specific keywords,
//                 formatting patterns, and section headers. If your resume uses complex graphics, tables, headers/footers,
//                 or non-standard fonts, the ATS may fail to parse it correctly — meaning your resume gets rejected
//                 automatically, regardless of your qualifications.
//               </p>
//               <p className="leading-7 text-sm mt-3">
//                 Our templates are specifically designed to be ATS-compatible: clean single-column layouts (Classic
//                 and Minimal) or properly structured two-column layouts (Modern), standard fonts, clear section
//                 headers, and no graphics or complex elements that could confuse parsing algorithms.
//               </p>
//             </div>

//             <div>
//               <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
//                 Tips for Getting the Most from AI Enhancement
//               </h3>
//               <div className="grid sm:grid-cols-1 gap-3">
//                 {[
//                   'Include specific numbers wherever possible — "managed $2M budget" is stronger than "managed budget"',
//                   'Mention tools, technologies, or methodologies by name — ATS systems scan for these keywords',
//                   'Focus on achievements, not just responsibilities — what did you accomplish, not just what were you assigned?',
//                   'Use the individual bullet enhancement to fine-tune specific points without regenerating everything',
//                   'Run "Enhance All" first, then manually adjust any points that don\'t accurately reflect your experience',
//                   'Tailor your summary to the specific role you\'re applying for — mention the job title and key requirements',
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-2 text-sm">
//                     <span className="arb-feature-dot" style={{ marginTop: '7px' }} />
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </section>

//         {/* ── FAQ ── */}
//         <hr className="arb-divider" />
//         <section className="arb-section-main py-16 px-6">
//           <Script
//             id="faq-schema-resume"
//             type="application/ld+json"
//             strategy="afterInteractive"
//             dangerouslySetInnerHTML={{
//               __html: JSON.stringify({
//                 '@context': 'https://schema.org',
//                 '@type': 'FAQPage',
//                 mainEntity: faqs.map((faq) => ({
//                   '@type': 'Question',
//                   name: faq.q,
//                   acceptedAnswer: { '@type': 'Answer', text: faq.a },
//                 })),
//               }),
//             }}
//           />
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {faqs.map((faq, i) => (
//                 <details key={i} className="arb-faq-item">
//                   <summary className="flex items-center justify-between gap-4">
//                     <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
//                     <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#059669' }} />
//                   </summary>
//                   <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── RELATED TOOLS ── */}
//         <hr className="arb-divider" />
//         <section className="arb-section-alt py-14 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
//               You may also find these free tools helpful
//             </h2>
//             <div className="flex flex-wrap justify-center gap-3">
//               {[
//                 { name: 'Cover Letter Generator', href: '/cover-letter-generator' },
//                 { name: 'Meta Tag Generator', href: '/metatag-generator' },
//                 { name: 'PDF to Word', href: '/pdf-to-word' },
//                 { name: 'Image Compressor', href: '/image-compressor' },
//                 { name: 'QR Code Generator', href: '/qr-code-generator' },
//               ].map((tool, i) => (
//                 <Link
//                   key={i}
//                   href={tool.href}
//                   className="px-4 py-2 rounded-full text-sm font-medium border"
//                   style={{ color: '#059669', borderColor: '#A7F3D0', background: '#fff' }}
//                 >
//                   {tool.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="arb-cta-section">
//           <div className="max-w-xl mx-auto">
//             <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
//               Ready to build your professional resume?
//             </h2>
//             <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
//               Takes 5 minutes. No signup. AI-enhanced. 100% free.
//             </p>
//             <button
//               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//               className="arb-cta-btn"
//             >
//               <Sparkles size={20} />
//               Build My Resume Now
//             </button>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }