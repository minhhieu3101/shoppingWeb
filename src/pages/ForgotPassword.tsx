import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Buttons";

type Inputs = {
  email: string;
};
function ForgotPassword() {
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    try {
      const respone = await axios.post(
        "http://localhost:3333/forgot_password",
        {
          email: data.email,
        }
      );
      alert(respone.statusText);
      navigate("/change_password", { replace: true, state: {email: data.email} });
    } catch (error) {
      alert("wrongggg");
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Enter your Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Give your email here"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button text="Send" type="submit"></Button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
