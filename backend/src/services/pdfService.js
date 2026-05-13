const PDFDocument = require('pdfkit');

function generateScanReportPdf(scan) {
  const doc = new PDFDocument({ margin: 40 });
  const buffers = [];

  return new Promise((resolve, reject) => {
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.fontSize(20).text('Valnexis Vulnerability Report', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Scan ID: ${scan._id}`);
    doc.text(`Target: ${scan.target}`);
    doc.text(`Status: ${scan.status}`);
    doc.text(`Risk Score: ${scan.riskScore}`);
    doc.text(`Generated At: ${new Date().toISOString()}`);
    doc.moveDown();

    if (!scan.vulnerabilities || scan.vulnerabilities.length === 0) {
      doc.text('No vulnerabilities found.');
    } else {
      scan.vulnerabilities.forEach((vuln, index) => {
        doc.fontSize(14).text(`${index + 1}. ${vuln.type} (${vuln.severity})`);
        doc.fontSize(11).text(`Description: ${vuln.description}`);
        if (vuln.proofOfConcept) doc.text(`PoC: ${vuln.proofOfConcept}`);
        doc.text(`Remediation: ${vuln.remediation}`);
        doc.moveDown(0.5);
      });
    }

    doc.end();
  });
}

module.exports = {
  generateScanReportPdf
};
