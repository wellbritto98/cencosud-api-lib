import React, { useState } from "react";
import { Button, TextField, Link, Box, Typography, Grid, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use o hook useNavigate para redirecionar

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5137/LoginUser", {
        email: email,
        password: password,
      });

      const { jwt, refreshToken } = response.data;

      // Salvar o JWT e o refreshToken no localStorage ou nos cookies
      localStorage.setItem("jwt", jwt);
      localStorage.setItem("refreshToken", refreshToken);

      // Redireciona o usuário para a rota de projetos
      navigate("/projetos");
    } catch (error) {
      setErrorMessage("Credenciais inválidas. Por favor, tente novamente.");
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
      {/* Esquerda - Formulário de login */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "#fff",
          height: "100%",
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: 400, width: "100%" }}>
          <img
            src={`/assets/img/Cencosud logo azul.png`}
            alt="Cencosud logo"
            style={{ maxWidth: 200, marginBottom: 32 }}
          />
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Login
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link href="#" sx={{ display: "block", marginTop: 1, marginBottom: 2 }}>
            Forgot Password ?
          </Link>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ textTransform: "none" }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </Box>
      </Grid>

      {/* Direita - Imagem Espiral */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundImage: `url(/assets/img/espiral.png)`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light" ? "#fff" : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
        }}
      />
    </Grid>
  );
};

export default Login;
