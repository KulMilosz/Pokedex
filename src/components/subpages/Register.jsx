import { useSnackbar } from "notistack";
import Form from "../shared/Form";
import useFetch from "../../hooks/useFetch";
import useMutate from "../../hooks/useMutate";
import { findUserByEmail } from "../../utils/findUser";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    data: users = [],
    isLoading: isFetchingUsers,
    error: fetchError,
  } = useFetch("http://localhost:3000/users");

  const { mutateAsync: registerUser, isPending: isRegistering } = useMutate(
    "http://localhost:3000/users",
    "POST",
    [["users"]]
  );

  const registerFormOptions = [
    { label: "Imię", name: "firstName", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Hasło", name: "password", type: "password" },
    { label: "Powtórz hasło", name: "confirmPassword", type: "password" },
  ];

  const handleRegister = async (formData) => {
    if (fetchError) {
      enqueueSnackbar(`An error occurred: ${fetchError.message}`, {
        variant: "error",
        autoHideDuration: 2000,
      });
      return;
    }

    const existingUser = findUserByEmail(users, formData.email);

    if (existingUser) {
      enqueueSnackbar("Email is already registered.", {
        variant: "error",
        autoHideDuration: 2000,
      });
      return;
    }

    try {
      await registerUser({
        firstName: formData.firstName,
        email: formData.email,
        password: formData.password,
      });

      enqueueSnackbar(`Successfully registered: ${formData.firstName}`, {
        variant: "success",
        autoHideDuration: 2000,
      });
      navigate("/login");
    } catch (error) {
      enqueueSnackbar(`An error occurred: ${error.message}`, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  return (
    <Form
      formOptions={registerFormOptions}
      formType="Register"
      onSubmit={handleRegister}
      disableButton={isFetchingUsers || isRegistering}
    />
  );
};

export default Register;
