import { redirect } from "react-router-dom";
import { getAuthToken } from "../../pages/Auth/Auth_utils";

export async function loader() {
  const token = getAuthToken();
  if (!token) {
    return redirect("/auth?mode=login");
  }
  return null;
}
