import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [userid, setUseride] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);

  const handleLogin = () => {
    try {
      axios
        .post("https://backend-1-qyp7.onrender.com/login", {
          userid: userid,
          password: password,
        })
        .then((response) => {
          if (response.data) {
            navigate("/loggedin/dashboard");
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
            console.log(response.data);
            setUseride("");
      setPassword("");
          }
        }).catch((err)=>{
          console.error("Login failed:", err);
          setFailedLogin(true);
          setUseride("");
      setPassword("");
      console.log(failedLogin);
        })
    }catch (error) {
      console.error("Login failed:", error);
      setFailedLogin(true);
          setUseride("");
      setPassword("");
      
    }
  };

  return (
    <>
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="form-group">
          <label htmlFor="userid" className="form-label">
            user Id
          </label>
          <input
            type="text"
            className="form-control"
            id="userid"
            value={userid}
            onChange={(e) => setUseride(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="description"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </div>
        <div className="text-danger">
          {failedLogin && (
            <p className={{ color: "red" }}>Login failed. Please try again.</p>
          )}
        </div>

        <button className="btn btn-primary mt-3" type="submit">
          Log in
        </button>
      </form>
    </>
  );
}

export default Login;
