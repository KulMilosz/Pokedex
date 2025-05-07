import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink } from "react-router-dom";

const Form = ({ formOptions, formType, onSubmit, error, disableButton }) => {
  const validations = formOptions.map(({ name, type }) => {
    let validation = z
      .string()
      .nonempty({ message: "This field is required!" });
    if (type === "text") {
      validation = z
        .string()
        .min(3, { message: "First name must be at least 3 characters long." });
    }

    if (type === "email") {
      validation = z.string().email({ message: "Invalid email address." });
    }
    if (type === "password") {
      validation = z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." });
    }

    return [name, validation];
  });

  const formSchemaObject = Object.fromEntries(validations);

  let formSchema;
  if (formOptions.some((option) => option.name === "confirmPassword")) {
    formSchema = z
      .object({
        ...formSchemaObject,
        confirmPassword:
          formType === "Register"
            ? z
                .string()
                .min(6, { message: "Hasło musi mieć co najmniej 6 znaków" })
            : z.string().optional(),
      })
      .refine(
        (data) =>
          formType !== "Register" || data.password === data.confirmPassword,
        {
          message: "Hasła muszą być takie same",
          path: ["confirmPassword"],
        }
      );
  } else {
    formSchema = z.object(formSchemaObject);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className=" text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {formType}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form
          className="space-y-6"
          onSubmit={handleSubmit((data) => onSubmit(data))}
        >
          {formOptions.map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-base font-medium leading-6 text-gray-900 dark:text-white"
              >
                {label}
              </label>
              <div className="mt-2">
                <input
                  id={name}
                  {...register(name)}
                  name={name}
                  type={type}
                  placeholder={
                    type !== "password" ? label.toLowerCase() : "••••••••"
                  }
                  className="block w-full rounded-md bg-white px-3 py-2 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
                {(errors[name] || (name === "password" && error)) && (
                  <p className="text-sm text-red-500">
                    {errors[name]?.message || error}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div>
            <button
              type="submit"
              disabled={disableButton}
              className="flex w-full justify-center rounded-md bg-sky-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {disableButton ? "Rejestracja..." : formType}
            </button>
          </div>
          {formType === "Login" && (
            <div className=" flex w-full justify-center md:justify-end space-x-2  ">
              <span className="text-gray-600 dark:text-white">
                Not a member?
              </span>
              <NavLink className="text-sky-500 font-bold" to={"/register"}>
                Register
              </NavLink>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Form;
