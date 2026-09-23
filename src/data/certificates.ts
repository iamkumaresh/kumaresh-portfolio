export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string; // The certificate visual preview (maps to 'file' in user query)
  credentialId?: string;
  verificationUrl?: string;
  certificateUrl?: string;
}

// Actual certificates retrieved from public/certificates/
export const certificatesData: Certificate[] = [
  {
    id: "01",
    title: "Codesprint 2.0",
    issuer: "JIS University",
    date: "2025",
    image: "/certificates/Codesprint 2.0.jpg"
  },
  {
    id: "02",
    title: "Data Structures & Algorithms",
    issuer: "Credential",
    date: "2025",
    image: "/certificates/DSA.jpg"
  },
  {
    id: "03",
    title: "NAH-X",
    issuer: "Credential",
    date: "2025",
    image: "/certificates/NAH-X.jpg"
  },
  {
    id: "04",
    title: "AI-ML Virtual Internship",
    issuer: "Google for Developers & EduSkills",
    date: "2026",
    image: "/certificates/AI-ML Virtual Internship.jpg",
    credentialId: "4bfcb30132652e659f77"
  },
  {
    id: "05",
    title: "Discrete Mathematics",
    issuer: "NPTEL (IIT Madras)",
    date: "2026",
    image: "/certificates/Discrete Mathematics.jpg",
    credentialId: "NPTEL26CS68S258703752"
  },
  {
    id: "06",
    title: "Gen AI Tools",
    issuer: "FutureSkills Prime (NASSCOM)",
    date: "2026",
    image: "/certificates/Gen AI nasscom.jpg",
    credentialId: "FSP/2026/8/10361401"
  },
  {
    id: "07",
    title: "Android App Development",
    issuer: "Ardent Computech",
    date: "2026",
    image: "/certificates/Android App Development BCT.jpg",
    credentialId: "ARDENT/204982",
    verificationUrl: "https://certificate.ardentsoftware.co.in"
  },
  {
    id: "08",
    title: "Generative AI with Prompt Engineering",
    issuer: "Ardent Computech",
    date: "2026",
    image: "/certificates/Generative AI With Prompt Engineering BCT.jpg",
    credentialId: "ARDENT/221357",
    verificationUrl: "https://ardentsoftware.in"
  },
  {
    id: "09",
    title: "AWS AI Practitioner",
    issuer: "FutureSkills Prime (NASSCOM)",
    date: "2026",
    image: "/certificates/AWS nasscom.jpg",
    credentialId: "FSP/2026/8/10361276"
  }
];
