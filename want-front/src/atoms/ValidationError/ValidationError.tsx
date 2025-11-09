import type { FieldError } from "react-hook-form";
import "./ValidationError.css";
type ValidationErrorType = {
  errors?:
    | {
        types?: string;
        message?: string;
      }
    | FieldError;
};
const ValidationError = ({ errors }: ValidationErrorType) => {
  if (!errors) return null;

  if (errors.types) {
    return (
      <>
        {Object.values(errors.types)
          .flat()
          .map((msg: any, i) => (
            <p key={i} className="ValidationError">
              {msg}
            </p>
          ))}
      </>
    );
  }

  return <p className="ValidationError">{errors.message}</p>;
};

export default ValidationError;
