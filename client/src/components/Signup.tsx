import { Link } from "react-router-dom";
import "./index.css";

export default function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center ">
        <div id="signupBox" className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-10 flex flex-col gap-5">
          <p id="title" className="text-xl">New here? Let’s make this official.</p>
          <form action="/signup" method="POST">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                First Name
            </label>
            <input
              type="text"
              placeholder="John"
              id="firstName"
              name="firstName"
              className="w-full px-4 py-3 mb-3 rounded-lg border border-gray-300 focus:ring-indigo-500"
            />
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              id="lastName"
              name="lastName"
              className="w-full px-4 py-3 mb-3 rounded-lg border border-gray-300 focus:ring-indigo-500"
            />
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
              placeholder="ex@mplePwd"
              id="password"
              name="password"
              className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:ring-indigo-500"
            />
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
            </label>
            <input
              type="text"
              placeholder="ex@mplePwd"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:ring-indigo-500"
            />
  
        <div className="flex justify-center">
            <input
              type="submit"
              value="Sign up"
              className="px-6 py-2 rounded shadow-md bg-purple-700 text-white hover:bg-purple-800"
            />
          </div>
          </form>
          <div className="flex justify-center">
            <Link to="/login" className="text-blue-500 hover:text-blue-600">Already have an account? Log in</Link>
          </div>
        </div>
      </div>
    );
}