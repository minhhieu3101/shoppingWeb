import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Buttons";

type Inputs = {
  otp: string | number;
};
function Verify() {
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate()
  const {email} = useLocation().state
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(email)
    console.log(data);
    try {
      const respone = await axios.post("http://localhost:3333/verify", {
        email: email,
        otp: data.otp,
      });
      alert(respone.statusText)
      navigate('/login', {replace: true})
    } catch (error) {
      alert("wrongggg");
      toast.error("Something went wrong");
      console.log("error :>> ", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Send your OTP</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="Otp"
          >
            Otp
          </label>
          <input
            type="Otp"
            {...register("otp", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Give your OTP here"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button text="Send" type="submit"></Button>
        </div>
      </form>
    </div>
  );
}

export default Verify;
