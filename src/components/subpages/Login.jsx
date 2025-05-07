import { useSnackbar } from "notistack";
import { useLoginContext } from "../../hooks/useLoginContext";
import Form from "../shared/Form";
import useFetch from "../../hooks/useFetch";
import { findUserByEmail } from "../../utils/findUser";

const Login = () => {
  const { login } = useLoginContext();
  const { enqueueSnackbar } = useSnackbar();

  const loginFormOptions = [
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
  ];

  const {
    data: users = [],
    isLoading,
    error,
  } = useFetch("http://localhost:3000/users");

  const handleLogin = (formData) => {
    if (error) {
      enqueueSnackbar("An error occurred. Please try again later.", {
        variant: "error",
      });
      return;
    }

    const user = findUserByEmail(users, formData.email);

    if (!user) {
      enqueueSnackbar("Email is not registered.", {
        variant: "error",
      });
      return;
    }

    if (user.password !== formData.password) {
      enqueueSnackbar("Incorrect password.", {
        variant: "error",
      });
      return;
    }

    login(user.firstName);
    enqueueSnackbar(`Successfully logged in! User: ${user.firstName}`, {
      variant: "success",
      autoHideDuration: 2000,
    });
  };

  return (
    <Form
      formOptions={loginFormOptions}
      formType="Login"
      onSubmit={handleLogin}
      disableButton={isLoading}
    />
  );
};

export default Login;
