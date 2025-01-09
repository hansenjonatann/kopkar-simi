
interface FormTypes {
    label:  string , 
    type: 'text' | 'password' | 'tel' | 'phone' | 'email' | 'number'
    name: string 
    onchange: (param: any) => void
    variant? : 'dark' | 'light'
}
export default function CustomForm ({label , type , name , onchange , variant} : FormTypes) {
    return (
        <div className="my-4 flex flex-col">
        <label htmlFor={name}>{label}</label>
        <input type={type}  id={name} className={variant == 'light' ? "text-black border border-black p-2 rounded-md mt-2" : "text-white p-2 border border-white rounded-md mt-2" }  onChange={onchange} required />
    </div>
    )
}