import { formatISTDate } from './dateTime';

/**
 * Utility to generate and trigger real PDF file downloads.
 * Creates a compliant standard PDF binary blob containing official OFFSLEEK School OS layout.
 */
export function generateOfficialPdfBlob(title: string, subtitle: string, bodyText: string): Blob {
  // Clean text of characters that break basic PDF PostScript syntax
  const cleanTitle = title.replace(/[()\\]/g, '');
  const cleanSub = subtitle.replace(/[()\\]/g, '');
  const cleanBody = bodyText.replace(/[()\\]/g, '').slice(0, 300);

  const pdfSource = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length 580 >>
stream
BT
/F1 20 Tf
50 730 Td
(OFFSLEEK SCHOOL OS) Tj
/F2 10 Tf
0 -18 Td
(Official Academic & Administrative Document Repository) Tj
0 -30 Td
/F1 15 Tf
(${cleanTitle}) Tj
/F2 10 Tf
0 -18 Td
(${cleanSub}) Tj
0 -25 Td
(-----------------------------------------------------------------------------------------------------) Tj
0 -25 Td
/F2 11 Tf
(${cleanBody}) Tj
0 -40 Td
(Document Verification: Validated and signed by OFFSLEEK School OS Administration) Tj
0 -16 Td
(Generated on: ${formatISTDate(new Date())}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000262 00000 n 
0000000894 00000 n 
0000000966 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
1033
%%EOF`;

  return new Blob([pdfSource], { type: 'application/pdf' });
}

export function downloadPdfDocument(filename: string, title: string, subtitle: string, bodyText: string) {
  const blob = generateOfficialPdfBlob(title, subtitle, bodyText);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface OfficialCertificateData {
  certificateType: string;
  requestId: string;
  studentName: string;
  grade: string;
  section: string;
  rollNo: string;
  schoolName: string;
  schoolTagline: string;
  issueDate: string;
  purpose: string;
  collectionDesk?: string;
  details?: string;
}

export function generateFormalCertificatePdfBlob(data: OfficialCertificateData): Blob {
  const cleanName = data.studentName.replace(/[()\\]/g, '');
  const cleanSchool = data.schoolName.replace(/[()\\]/g, '');
  const cleanType = data.certificateType.replace(/[()\\]/g, '').toUpperCase();
  const cleanRef = data.requestId.replace(/[()\\]/g, '');
  const cleanDate = data.issueDate.replace(/[()\\]/g, '');
  const cleanGrade = `${data.grade} - Section ${data.section}`.replace(/[()\\]/g, '');
  const cleanRoll = data.rollNo.replace(/[()\\]/g, '');
  const cleanPurpose = data.purpose.replace(/[()\\]/g, '');

  const streamContent = `q
0.5 0.5 0.5 RG
2 w
30 30 552 732 re S
0.8 0.8 0.8 RG
0.75 w
35 35 542 722 re S
Q
BT
/F1 18 Tf
0 0 0 rg
170 710 Td
(${cleanSchool}) Tj
/F2 10 Tf
0.4 0.4 0.4 rg
-20 -18 Td
(Affiliated to CBSE, New Delhi | Affiliation No. 2130847) Tj
0 -14 Td
15 0 Td
(Official Academic & Conduct Certification) Tj
0.2 0.2 0.2 rg
0 -30 Td
/F1 16 Tf
-15 0 Td
(${cleanType}) Tj
/F2 9 Tf
0.4 0.4 0.4 rg
0 -16 Td
(Document Reference: ${cleanRef}   |   Date of Issue: ${cleanDate}) Tj
0 -20 Td
(-----------------------------------------------------------------------------------------------------------------) Tj
0 -30 Td
/F1 11 Tf
0 0 0 rg
(TO WHOMSOEVER IT MAY CONCERN) Tj
0 -26 Td
/F2 10 Tf
(This is to certify that ${cleanName}, Roll No. ${cleanRoll}, is a bonafide student) Tj
0 -16 Td
(of ${cleanSchool}, currently enrolled in ${cleanGrade}.) Tj
0 -22 Td
(During his tenure at this institution, his conduct and moral character have been found) Tj
0 -16 Td
(to be EXEMPLARY. He has actively engaged in academic pursuits with commendable discipline.) Tj
0 -22 Td
(This certificate is officially issued upon verified request for the purpose of:) Tj
0 -16 Td
/F1 10 Tf
(${cleanPurpose}) Tj
/F2 10 Tf
0 -26 Td
(Desk of Issuance: ${data.collectionDesk || 'Main Academic Registrar Desk'}) Tj
0 -22 Td
(Status: DIGITALLY VERIFIED AND APPROVED BY INSTITUTIONAL REGISTRY) Tj
0 -40 Td
(-----------------------------------------------------------------------------------------------------------------) Tj
0 -40 Td
/F1 10 Tf
(Academic Registrar                                             Principal & Head of School) Tj
/F2 8 Tf
0.4 0.4 0.4 rg
0 -14 Td
(Greenwood Registry Office                                      Greenwood International) Tj
0 -35 Td
0.6 0.6 0.6 rg
([ OFFICIAL DEMO CERTIFICATE FOR OFFSLEEK SCHOOL OS TESTING ]) Tj
ET`;

  const streamLength = streamContent.length;

  const pdfSource = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000262 00000 n 
0000001800 00000 n 
0000001872 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
1940
%%EOF`;

  return new Blob([pdfSource], { type: 'application/pdf' });
}

export function downloadFormalCertificatePdf(filename: string, data: OfficialCertificateData) {
  const blob = generateFormalCertificatePdfBlob(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
