import { Link } from "react-router-dom";

export default function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center ">
        <div id="loginBox" className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-10 flex flex-col gap-5">
          <p id="title" className="text-xl">New here? Let’s make this official.</p>
          <form action="">
            <input
              type="text"
              placeholder="John"
              name="firstName"
              className="w-full px-4 py-3 mb-3 rounded-lg border border-gray-300 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Doe"
              name="lastName"
              className="w-full px-4 py-3 mb-3 rounded-lg border border-gray-300 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="example@email.com"
              name="email"
              className="w-full px-4 py-3 mb-3 rounded-lg border border-gray-300 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Password"
              name="password"
              className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Confirm Password"
              name="confirmPassword"
              className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:ring-indigo-500"
            />
  
        <div className="flex justify-center">
            <input
              type="button"
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