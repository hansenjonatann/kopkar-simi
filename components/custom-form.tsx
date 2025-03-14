import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FormTypes {
  label: string;
  type: "text" | "password" | "tel" | "phone" | "email" | "number";
  name: string;
  onchange: (param: any) => void;
}
export default function CustomForm({ label, type, name, onchange }: FormTypes) {
  return (
    <div className="my-3 flex flex-col">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        className={"bg-secondary mt-4 text-black font-semibold text-lg"}
        onChange={onchange}
        required
      />
    </div>
  );
}
