import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportSalesReportToPDF(data: any[]) {
  const doc = new jsPDF();
  let currentY = 16; // Posisi awal dokumen

  // 🔹 Judul Laporan
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Sales Report", 14, currentY);
  currentY += 10; // Geser ke bawah setelah judul

  data.forEach((sale, saleIndex) => {
    // 🔹 Tabel utama transaksi
    autoTable(doc, {
      head: [["#", "Customer", "Date", "Subtotal", "Discount", "Total"]],
      body: [
        [
          saleIndex + 1,
          sale.customer.name,
          sale.date,
          sale.subtotal.toLocaleString("id"),
          sale.discount.toLocaleString("id"),
          sale.total.toLocaleString("id"),
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      styles: { fontSize: 12, halign: "center" },
      startY: currentY,
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8; // Atur posisi setelah tabel transaksi

    // 🔹 Tabel detail SaleItems
    autoTable(doc, {
      head: [["#", "Product Name", "Qty", "Price", "Total"]],
      body: sale.SaleItems.map((item: any, itemIndex: number) => {
        const totalPrice = item.quantity * item.unitPrice; // Hitung total harga per item
        return [
          itemIndex + 1,
          item.product.name,
          item.quantity,
          item.unitPrice.toLocaleString("id"),
          totalPrice.toLocaleString("id"),
        ];
      }),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // Warna header
      styles: { fontSize: 11, halign: "center" },
      startY: currentY,
      margin: { left: 14, right: 14 },
    });

    // 🔹 Update posisi Y setelah tabel detail
    currentY = (doc as any).lastAutoTable.finalY + 10;
  });

  // 🔹 Hitung total keseluruhan
  const totalAll = data.reduce((acc, curr) => acc + curr.total, 0);

  // 🔹 Tambahkan total keseluruhan dengan posisi lebih rapi
  autoTable(doc, {
    body: [
      [
        {
          content: "Total Keseluruhan",
          colSpan: 4,
          styles: { fontStyle: "bold", halign: "right", fontSize: 12 },
        },
        {
          content: totalAll.toLocaleString("id"),
          styles: { fontStyle: "bold", fontSize: 12 },
        },
      ],
    ],
    theme: "plain",
    margin: { left: 14, right: 14 },
    startY: currentY,
  });

  // 🔹 Simpan PDF dengan nama unik
  const generateRandom = Math.floor(Math.random() * 10000000);
  doc.save(`sales_report_${generateRandom}.pdf`);
}
