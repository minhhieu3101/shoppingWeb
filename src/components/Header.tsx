import { useNavigate } from "react-router-dom";
import Button from "./Buttons";
import { MouseEventHandler } from "react";

function Header() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate()
  if (!token) {
    const handleOnClickSignIn: MouseEventHandler = () => {
        navigate('/login', {replace: true})
    }
    const handleOnClickSignUp: MouseEventHandler = () => {
        navigate('/register', {replace: true})
    }
    return (
      <header className="bg-orange-50 border-b-2 border-neutral-200">
        <div className=" flex justify-between mx-16 items-center">
          <div>
            <h1 className="text-3xl font-mono text-orange-500">
              Shopping Mall
            </h1>
          </div>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Search"
            className="shadow appearance-none text-center border rounded w-1/3 py-2 px-3 text-gray-700 my-2 leading-tight focus:outline-orange-300 focus:shadow-outline"
          />
          <div className="flex justify-around items-baseline min-w-56 max-h-10">
            <Button text="Sign In" type="button" onClick={handleOnClickSignIn}></Button>
            <Button text="Sign Up" type="button" onClick={handleOnClickSignUp}></Button>
          </div>
        </div>
      </header>
    );
  } else {
    return (
      <header className="bg-orange-50 border-b-2 border-neutral-200">
        <div className=" flex justify-between mx-16 items-center">
          <div>
            <h1 className="text-3xl font-mono text-orange-500">
              Shopping Mall
            </h1>
          </div>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Search"
            className="shadow appearance-none text-center border rounded w-1/3 py-2 px-3 text-gray-700 my-2 leading-tight focus:outline-orange-300 focus:shadow-outline"
          />
          <div>
            <h1 className="text-2xl font-mono text-orange-500">
              User
            </h1>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
