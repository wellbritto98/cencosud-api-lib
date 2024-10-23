import React, { useContext, useEffect, useState } from "react";
import { Button, TextField, Link, Box, Typography, Grid, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import { api, setupAPIClient } from "../shared/api";
import { LoginUserDto, UserApi } from "../shared/apiSwaggerGen/api";
import { AxiosResponse } from "axios";
import { LoginResponseData } from "../shared/otherInterfaces";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState<string>(""); // Ensure typing as string
  const [password, setPassword] = useState<string>(""); // Ensure typing as string
  const [errorMessage, setErrorMessage] = useState<string>(""); // Ensure typing as string
  const [loading, setLoading] = useState<boolean>(false); // Ensure typing as boolean
  const { isAuthenticated, login } = useContext(AuthContext); // Importa a função login do contexto
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/projetos'); // Redireciona para projetos se autenticado
    }
  }, [isAuthenticated, navigate]);

  // Set up axios instance with token management
  const axiosInstance = api;
  const userApi = new UserApi(undefined, '', axiosInstance); // Create a new UserApi instance

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    // Create the loginUserDto object for the API request
    const loginUserDto: LoginUserDto = {
      email: email,
      password: password,
    };

    try {
      // Use the swagger-generated API method to log in
      const response = await userApi.apiUserLoginUserPost(loginUserDto);
      //deserialize response.data in LoginResponseData

      // Convertendo explicitamente para `unknown` e depois para o tipo correto
      const typedResponse = response.data as unknown as LoginResponseData;

      const jsonTypedResponse = JSON.stringify(typedResponse);

      const typedResponseObject = JSON.parse(jsonTypedResponse);

      if (response.status === 200) {
        const jwt = typedResponseObject.data.token;
        const refreshToken = typedResponseObject.data.refreshToken.token;

        // Salva tokens no localStorage
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Atualiza o contexto de autenticação
        if (localStorage.getItem("jwt") && localStorage.getItem("refreshToken")) {
          login();

          // Espera o AuthContext atualizar antes de redirecionar
          window.location.href = "/projetos";
        } else {
          while (!localStorage.getItem("jwt") && !localStorage.getItem("refreshToken")) {
            console.log("Aguardando autenticação...");
          }
          login();
          window.location.href = "/projetos";
        }
      }

    } catch (error) {
      setErrorMessage("Credenciais inválidas. Por favor, tente novamente.");
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
      {/* Left side - Login form */}
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
            Forgot Password?
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

      {/* Right side - Spiral image */}
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
