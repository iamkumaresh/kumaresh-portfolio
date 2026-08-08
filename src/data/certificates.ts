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
  }
];
