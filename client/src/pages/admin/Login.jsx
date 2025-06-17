import React, { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackMessageType, setFeedbackMessageType] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        setEmailError("");
        setPasswordError("");
        setFeedbackMessage("");
        setFeedbackMessageType("");

        let isValid = true;

        if (!email) {
            setEmailError("Por favor, digite seu e-mail.");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("E-mail inválido.");
            isValid = false;
        }

        if (!password) {
            setPasswordError("Por favor, digite sua senha.");
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres.");
            isValid = false;
        }

        if (isValid) {
            fetch("http://localhost:5000/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.token) {
                        setFeedbackMessage("Login realizado com sucesso! Redirecionando...");
                        setFeedbackMessageType("success");

                        localStorage.setItem("token", data.token);

                        setTimeout(() => {
                            window.location.href = "/dashboard";
                        }, 1500);
                    } else {
                        setFeedbackMessage(data.message || "Credenciais inválidas.");
                        setFeedbackMessageType("error");
                    }
                })
                .catch((error) => {
                    console.error("Erro:", error);
                    setFeedbackMessage("Erro ao conectar com o servidor.");
                    setFeedbackMessageType("error");
                });
        } else {
            setFeedbackMessage("Por favor, corrija os erros no formulário.");
            setFeedbackMessageType("error");
        }
    };

    return (
        <div className="container-fluid d-flex flex-column-reverse flex-xl-row justify-content-end min-vh-100 p-0">
            <div className="align-items-center col-xl-6 d-flex flex-column justify-content-center p-5 text-forest-green">
                <div className="bg-white login p-5 rounded-4 w-100" style={{ maxWidth: "452px" }}>
                    <h2 className="fw-bold mb-3 pt-3 text-center">Login</h2>
                    <p className="mb-4 text-center">Faça seu login para acessar a área administrativa.</p>

                    <form className="d-flex flex-column gap-3 pb-3" onSubmit={handleSubmit}>
                        <div>
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                className={`form-control ${emailError ? "is-invalid" : ""}`}
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Digite seu e-mail"
                                type="email"
                                value={email}
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>

                        <div>
                            <label className="form-label" htmlFor="senha">Senha</label>
                            <input
                                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                                id="senha"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                type="password"
                                value={password}
                            />
                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                        </div>

                        <button className="btn btn-lime-green mt-2 pe-4 ps-4 text-white" type="submit">
                            Logar
                        </button>

                        {feedbackMessage && (
                            <p className={`text-center ${feedbackMessageType === "success" ? "text-success" : "text-danger"}`}>
                                {feedbackMessage}
                            </p>
                        )}
                    </form>
                </div>
            </div>

            <div className="align-items-center col-xl-6 d-flex justify-content-center overflow-hidden position-relative">
                <img
                    alt="Furniture"
                    className="h-100 img-fluid object-fit-cover w-100 login-image"
                    src="/images/login.png"
                />
                <div className="bg-dark opacity-50 position-absolute start-0 top-0 h-100 w-100"></div>
            </div>
        </div>
    );
}

export default Login;
