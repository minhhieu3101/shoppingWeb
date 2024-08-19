import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Buttons";

type Inputs = {
  email: string;
  password: string;
};
function Login() {
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    try {
      const respone = await axios.post("http://localhost:3333/login", {
        email: data.email,
        password: data.password,
      });
      if (!respone.data.token) {
        return toast.error("someting wwrong");
      }
      localStorage.setItem("accessToken", respone.data.token);
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
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
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
          <a
            className="inline-block align-baseline font-bold text-base text-blue-500 hover:text-blue-800"
            href="/register"
          >
            Sign up
          </a>
          <Button text="Sign in" type="submit"></Button>
          <a
            className="inline-block align-baseline font-bold mr-0 text-base text-blue-500 hover:text-blue-800"
            href="/forgot_password"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
