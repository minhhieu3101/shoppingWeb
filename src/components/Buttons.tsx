import { MouseEventHandler } from "react";

interface Inputs {
  text: string;
  type: 'submit' | 'reset'| 'button' | undefined
  onClick?: MouseEventHandler
}

function Button({ text, type, onClick }: Inputs) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type={type} onClick={onClick}
    >
      {text}
    </button>
  );
}
export default Button;
