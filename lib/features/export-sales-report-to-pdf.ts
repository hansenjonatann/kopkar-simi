import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportSalesReportToPDF(data: any[]) {
  const doc = new jsPDF();
  doc.text("Sales Report", 14, 16);

  const tableData = data.map((item, idx) => [
    idx + 1,
    item.date,
    item.subtotal.toLocaleString("id"),
    item.discount.toLocaleString("id"),
    item.total.toLocaleString("id"),
  ]);

  // Hitung total keseluruhan
  const totalAll = data.reduce((acc, curr) => acc + curr.total, 0);

  // Tambahkan baris total ke akhir data
  tableData.push([
    "", // Kolom #
    "Total", // Kolom Date
    "", // Kolom Subtotal
    "", // Kolom Discount
    totalAll.toLocaleString("id"), // Kolom Total
  ]);

  autoTable(doc, {
    head: [["#", "Date", "Subtotal", "Discount", "Total"]],
    body: tableData,
    startY: 20,
    headStyles: { fillColor: [0, 0, 0] },
    footStyles: { fontStyle: "bold" },
  });

  const generateRandom = Math.floor(Math.random() * 10000000);

  doc.save(`sales_report_${generateRandom}.pdf`);
}
