import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div id="loginBox" className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-10 flex flex-col gap-5">
        <p id="title" className="text-2xl">Welcome back, shall we enter?</p>
        <form action="" method="POST">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            placeholder="example@email.com"
            id="email"
            name="email"
            className="w-full px-4 py-3 mb-3 rounded-lg border border-gray-300 focus:ring-indigo-500"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
            </label>
          <input
            type="text"
            placeholder="Password"
            id="password"
            name="password"
            className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:ring-indigo-500"
          />

      <div className="flex justify-center">
          <input
            type="button"
            value="Log In"
            className="px-6 py-2 rounded shadow-md bg-purple-700 text-white hover:bg-purple-800"
          />
        </div>
        </form>
        <div className="flex justify-center">
          <Link to="/signup" className="text-blue-500 hover:text-blue-600">Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
}
