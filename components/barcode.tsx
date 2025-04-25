"use client";
import { useRef } from "react";
import JsBarcode from "jsbarcode";

export default function CustomBarcode({ value }: { value: string }) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  // Langsung memanggil JsBarcode saat komponen dirender
  if (barcodeRef.current) {
    JsBarcode(barcodeRef.current, value, {
      format: "CODE128", // Format barcode EAN-13
      width: 1,
      height: 30,
      displayValue: true, // Menampilkan nilai di bawah barcode
    });
  }

  return <svg ref={barcodeRef}></svg>;
}
