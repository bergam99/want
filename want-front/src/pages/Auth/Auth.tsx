// TODO: remove deprecated
import Button from "../../atoms/Button/Button";
import "./Auth.css";
import {
  Link,
  useSearchParams,
  useNavigation,
  Form,
  useActionData,
} from "react-router-dom";
import { z } from "zod"; // verify entered value
import { useForm } from "react-hook-form"; // Form state management
import { zodResolver } from "@hookform/resolvers/zod"; // link zod and useForm
import ValidationError from "../../atoms/ValidationError/ValidationError";
import { useTranslation } from "react-i18next";

// For signup: full validation
const signupSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "ⓧ Email is required." })
    .email({ message: "ⓧ Not a valid email format." }),

  password: z
    .string()
    .nonempty({ message: "ⓧ Password is required." })
    .min(10, { message: "ⓧ Password must be at least 10 characters." })
    .max(20, { message: "ⓧ Password must be no more than 20 characters." })
    .refine((val) => /[A-Z]/.test(val), {
      message: "ⓧ Password must include at least one uppercase letter.",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "ⓧ Password must include at least one lowercase letter.",
    })
    .refine((val) => /\d/.test(val), {
      message: "ⓧ Password must include at least one number.",
    })
    .refine((val) => /[!@#$%^&*()\-_=+<>?]/.test(val), {
      message: "ⓧ Password must include at least one special character.",
    }),
});

// For login: minimal validation
const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "ⓧ Email is required." })
    .email({ message: "ⓧ Not a valid email format." }),
  password: z.string().nonempty({ message: "ⓧ Password is required." }),
});

type FormFieldType = z.infer<typeof loginSchema> | z.infer<typeof signupSchema>;

type ActionDataType = {
  message?: string;
  error?: string;
};

const Auth = () => {
  const { t } = useTranslation();
  const serverData = useActionData() as ActionDataType;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const isSubmitting = navigation.state === "submitting";

  const zodSchema = isLogin ? loginSchema : signupSchema;

  const {
    register, // link to inputs ( = name )
    formState: { errors, isValid },
    clearErrors,
  } = useForm<FormFieldType>({
    resolver: zodResolver(zodSchema), // validation
    mode: "onChange",
    criteriaMode: "all",
  });

  const handleSubmitClick = () => {
    clearErrors();
  };

  return (
    <div className="Auth">
      <Form method="post" className="Auth__form">
        <p className="Auth__formTitle"> {isLogin ? t("login") : t("signup")}</p>
        <p className="Auth__field">
          <input
            type="text"
            placeholder=" " // style purpose
            {...register("email")}
          />
          <label>Email</label>
          <ValidationError errors={errors.email} />
        </p>

        <p className="Auth__field">
          <input
            type="password"
            placeholder=" " // style purpose
            {...register("password")}
          />
          <label>Password</label>
          <ValidationError errors={errors.password} />
        </p>

        <Button
          variant="inverted"
          disabled={isSubmitting || !isValid}
          buttonTxt={isSubmitting ? t("submitting") : t("submit")}
          className="Auth__button"
        />

        {serverData?.message && (
          <p className="Auth__result">{t(serverData.message)}</p>
        )}
        {serverData?.error && (
          <p className="Auth__result Auth__error">{serverData.error}</p>
        )}

        {isLogin ? (
          <Link to="?mode=signup">
            <button
              onClick={() => handleSubmitClick()}
              className="Auth__switchWrapper"
            >
              {t("new-client")}
              <span className="Auth__switch">{t("signup")}</span>
            </button>
          </Link>
        ) : (
          <Link to="?mode=login">
            <button
              onClick={() => handleSubmitClick()}
              className="Auth__switchWrapper"
            >
              {t("already-client")}
              <span className="Auth__switch">{t("login")}</span>
            </button>
          </Link>
        )}
      </Form>
    </div>
  );
};

export default Auth;
