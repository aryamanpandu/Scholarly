import "./Login.css";

export default function Login() {
  return (
    <div id="loginBox">
      <p id="title">Welcome back, shall we enter?</p>
      <form action="">
        <input
          type="text"
          id="email"
          placeholder="example@email.com"
          name="email"
        />
        <input
          type="text"
          id="password"
          placeholder="Password"
          name="password"
        />
        <input type="button" value="Log In" id="loginBtn" className="button" />
      </form>
    </div>
  );
}
