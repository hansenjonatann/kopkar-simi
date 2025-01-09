'use client'
import Barcode from "react-barcode";

export default function CustomBarcode({value} : {value: string}) {
return (
    <>
    <Barcode 
    value={value}
    format="CODE128"
    width={2}
    displayValue
    height={50}
    />
    </>
)
}