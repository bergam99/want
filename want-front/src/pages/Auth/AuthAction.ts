import axios from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";
  console.log({ searchParams, mode });

  if (mode !== "login" && mode !== "signup") {
    throw { error: "⚠ Unsupported mode." };
  }

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/auth/${mode}`,
      authData
    );

    if (mode === "login") {
      const token = response.data;

      if (!token || token.trim() === "") {
        return { error: "⚠ Failed to login" };
      }

      localStorage.setItem("token", token);

      return redirect("/");
    }

    if (mode === "signup") {
      return { message: "signup-success" };
    }
  } catch (err: any) {
    if (err.status === 409) {
      return { error: "⚠ This email is already used." };
    }
    if (err.status === 401) {
      return { error: "⚠ Email or password is incorrect." };
    }
    return { error: "⚠ Something went wrong." };
  }
}
