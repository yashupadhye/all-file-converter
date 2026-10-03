export type Tool = { slug:string; name:string; description:string; category:string; icon:string; input:string; output:string; popular?:boolean; browser:boolean; keywords:string[]; soon?:boolean };
export const tools: Tool[] = [
{slug:'pdf-to-jpg',name:'PDF to JPG',description:'Convert PDF pages to high-quality JPG images in your browser.',category:'PDF',icon:'Image',input:'PDF',output:'JPG',popular:true,browser:true,keywords:['pdf to jpg','convert pdf to jpg','pdf image converter']},
{slug:'jpg-to-pdf',name:'JPG to PDF',description:'Turn JPG images into a clean PDF document without uploading your files.',category:'Image',icon:'FileImage',input:'JPG',output:'PDF',popular:true,browser:true,keywords:['jpg to pdf','image to pdf','convert jpg to pdf']},
{slug:'png-to-pdf',name:'PNG to PDF',description:'Convert PNG images to PDF documents directly in your browser.',category:'Image',icon:'FileImage',input:'PNG',output:'PDF',browser:true,keywords:['png to pdf','convert png to pdf']},
{slug:'webp-to-jpg',name:'WEBP to JPG',description:'Convert WEBP images to JPG format quickly and privately.',category:'Image',icon:'Image',input:'WEBP',output:'JPG',browser:true,keywords:['webp to jpg','convert webp to jpg']},
{slug:'jpg-to-png',name:'JPG to PNG',description:'Convert JPG images to PNG files with one click.',category:'Image',icon:'Image',input:'JPG',output:'PNG',browser:true,keywords:['jpg to png','convert jpg to png']},
{slug:'png-to-jpg',name:'PNG to JPG',description:'Convert PNG images to JPG files directly in your browser.',category:'Image',icon:'Image',input:'PNG',output:'JPG',browser:true,keywords:['png to jpg','convert png to jpg']},
{slug:'merge-pdf',name:'Merge PDF',description:'Combine multiple PDF files into one document locally in your browser.',category:'PDF',icon:'Files',input:'PDF',output:'PDF',popular:true,browser:true,keywords:['merge pdf','combine pdf','join pdf']},
{slug:'split-pdf',name:'Split PDF',description:'Extract selected pages from a PDF into a new PDF file.',category:'PDF',icon:'Scissors',input:'PDF',output:'PDF',browser:true,keywords:['split pdf','extract pdf pages']},
{slug:'compress-pdf',name:'Compress PDF',description:'Reduce PDF size using browser-side optimization.',category:'PDF',icon:'Minimize2',input:'PDF',output:'PDF',popular:true,browser:true,keywords:['compress pdf','reduce pdf size','pdf compressor']},
{slug:'rotate-pdf',name:'Rotate PDF',description:'Rotate all pages of a PDF and download the corrected document.',category:'PDF',icon:'RotateCw',input:'PDF',output:'PDF',browser:true,keywords:['rotate pdf','pdf rotate']},
{slug:'pdf-to-text',name:'PDF to Text',description:'Extract selectable text from a PDF and save it as a TXT file in your browser.',category:'PDF',icon:'FileText',input:'PDF',output:'TXT',browser:true,keywords:['pdf to text','extract text from pdf']},
{slug:'pdf-to-word',name:'PDF to Word',description:'Convert PDF documents to editable Word files.',category:'Document',icon:'FileText',input:'PDF',output:'DOCX',popular:true,browser:false,soon:true,keywords:['pdf to word','pdf to docx']},
{slug:'word-to-pdf',name:'Word to PDF',description:'Convert Word documents to PDF online.',category:'Document',icon:'FileText',input:'DOCX',output:'PDF',popular:true,browser:false,soon:true,keywords:['word to pdf','docx to pdf']},
{slug:'pdf-to-excel',name:'PDF to Excel',description:'Convert tables in PDF documents to Excel spreadsheets.',category:'Document',icon:'Table2',input:'PDF',output:'XLSX',browser:false,soon:true,keywords:['pdf to excel','pdf to xlsx']},
{slug:'excel-to-pdf',name:'Excel to PDF',description:'Convert Excel spreadsheets into polished PDF documents.',category:'Document',icon:'Table2',input:'XLSX',output:'PDF',browser:false,soon:true,keywords:['excel to pdf','xlsx to pdf']},
{slug:'ppt-to-pdf',name:'PowerPoint to PDF',description:'Convert PowerPoint presentations into PDF files.',category:'Document',icon:'Presentation',input:'PPTX',output:'PDF',browser:false,soon:true,keywords:['ppt to pdf','powerpoint to pdf']},
{slug:'pdf-to-png',name:'PDF to PNG',description:'Export PDF pages as PNG images.',category:'PDF',icon:'Image',input:'PDF',output:'PNG',browser:true,keywords:['pdf to png','convert pdf to png']},
{slug:'image-compressor',name:'Image Compressor',description:'Compress JPG, PNG and WEBP images in your browser.',category:'Image',icon:'Minimize2',input:'IMAGE',output:'IMAGE',popular:true,browser:true,keywords:['image compressor','compress image','reduce image size']},
];
export const liveTools=tools.filter(t=>!t.soon);
export const getTool=(slug:string)=>tools.find(t=>t.slug===slug);
export const categories=[...new Set(liveTools.map(t=>t.category))];
