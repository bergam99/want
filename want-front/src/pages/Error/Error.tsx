import { useRouteError } from "react-router";
import { Link } from "react-router-dom";
import Header from "../../atoms/Header/Header";
import { Fragment } from "react/jsx-runtime";
import "./Error.css";

const Error = () => {
  const error: any = useRouteError();
  console.log({ error });

  return (
    <Fragment>
      <Header />
      <div className="Error">
        {error.status !== 401 && (
          <Fragment>
            <p className="Error__status">Error {error.status}</p>
            <p className="Error__data">
              {error.data || error.statusText || "Something went wrong."}
            </p>
          </Fragment>
        )}

        {error.status === 401 && (
          <Fragment>
            <p className="Error__401Text">Please log in to continue.</p>
            <Link
              to="/auth?mode=login"
              className="Button__inverted Error__button1"
            >
              Login
            </Link>
          </Fragment>
        )}
        <Link to="/" className="Button__primary Error__button2">
          Go to Home Page
        </Link>
      </div>
    </Fragment>
  );
};
export default Error;
