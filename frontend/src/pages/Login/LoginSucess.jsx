import { useEffect } from "react";
import { useNavigate } from "react-router";
import { login } from "../../auth/auth";

function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      setTimeout(() => {
        navigate("/home");
      }, 150);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Procesando inicio de sesión...</p>;
}

export default LoginSuccess;
