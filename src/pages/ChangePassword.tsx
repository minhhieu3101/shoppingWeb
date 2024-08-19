import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Buttons";

type Inputs = {
  email: string;
  otp: string | number;
  password: string;
};
function ChangePassword() {
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate();
  const { email } = useLocation().state;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    data.email = email;
    console.log(data);
    try {
      await axios.patch("http://localhost:3333/change_password", data);
      alert("Change password success");
      navigate("/", { replace: true });
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
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="otp"
          >
            OTP
          </label>
          <input
            type="text"
            {...register("otp", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="otp"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******************"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button text="Send" type="submit"></Button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
