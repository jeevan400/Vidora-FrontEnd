import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [formState, setFormState] = React.useState(0);

  const [open, setOpen] = React.useState(false);

  const router = useNavigate();
  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  // handleOnClose snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // handleAuth
  let handleAuth = async () => {
    try {
      if (formState === 0) {
        let result = await handleLogin(username, password);
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        console.log(result);
        setUsername("");
        setMessage(result);
        setOpen(true);
        setError("");
        setPassword("");
        setFormState(0);
      }
    } catch (err) {
      let message = err.response.data.message;
      setError(message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          backgroundColor: "red",
          display: "flex",
          justifyContent: "right",
          background: `url("https://picsum.photos/1600/900")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              maxWidth: 400,
              maxHeight: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Avatar
              sx={{ m: 1, bgcolor: "secondary.main", marginBottom: "15px" }}
            >
              <LockOutlinedIcon />
            </Avatar> */}

            <Avatar
              sx={{
                m: 1,
                bgcolor: "var(--light-primary)",
                color: "var(--primary-color)",
                width: 50,
                height: 50,
                mb: 2,
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <div>
              <Button
                sx={{ marginRight: "15px" }}
                variant={formState === 0 ? "contained" : "outlined"}
                onClick={() => setFormState(0)}
                style={{
                  backgroundColor:
                    formState === 0 ? "var(--primary-color)" : "",
                  color: formState === 0 ? "white" : "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                }}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => setFormState(1)}
                style={{
                  backgroundColor:
                    formState === 1 ? "var(--primary-color)" : "",
                  color: formState === 1 ? "white" : "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                }}
              >
                Sign Up
              </Button>
            </div>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              {formState === 1 ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullname"
                  label="Fullname"
                  name="fullname"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--primary-color)",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "var(--primary-color)",
                    },
                  }}
                />
              ) : (
                <></>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--primary-color)",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "var(--primary-color)",
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--primary-color)",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "var(--primary-color)",
                  },
                }}
              />

              <p
                style={{
                  color: "var(--error-color)",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {error}
              </p>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "var(--primary-color)",
                  "&:hover": {
                    backgroundColor: "var(--primary-hover)",
                  },
                  paddingBlock:"10px"
                }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        message={message}
        onClose={handleClose}
      />
    </ThemeProvider>
  );
}
