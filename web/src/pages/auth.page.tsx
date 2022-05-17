import { Fragment, useCallback, useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import type { ReactElement, FC } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

interface VerticalTextProps {
  toPrint: string;
  Container: FC;
}
const VerticalText: FC<VerticalTextProps> = ({
  toPrint,
  Container,
}: VerticalTextProps): ReactElement => {
  const Character: FC<{ c: string }> = ({ c }: { c: string }): ReactElement => {
    return <p className="font-bold font-sans text-6xl text-[#8A899F]">{c}</p>;
  };

  return (
    <Container>
      {toPrint.split("").map((c) => (
        <Character c={c} />
      ))}
    </Container>
  );
};

interface AuthProps {
  setApiKey: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Auth: FC<AuthProps> = ({ setApiKey }: AuthProps): ReactElement => {
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [validInput, setValidInput] = useState<boolean>(true);

  const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const onClickUrl =
    (url: string): (() => void) =>
    () =>
      openInNewTab(url);

  const authenticate = (email: string, password: string) => {
    const __prod__ = true;
    const url = __prod__ ? "whybotapi.supesu.dev" : "localhost:4040";
    const protocol = __prod__ ? "https" : "http";

    axios
      .post(`${protocol}://${url}/api/v1/auth`, {
        email,
        password,
      })
      .then((response) => {
        if (response.data.data.api_key) {
          setApiKey(response.data.data.api_key);
          setShouldRedirect(true);
        } else {
          setValidInput(false);
        }
      })
      .catch(() => {
        setValidInput(false);
      });
  };

  useEffect(() => {
    if (!validInput) {
      setTimeout(() => setValidInput(true), 2000);
    }
  }, [validInput]);

  const GENERIC_INPUT_STYLES = useCallback(
    () =>
      `bg-[#17161C] appearance-none border-2 ${
        validInput ? "border-[#2A2B34]" : "border-red-300"
      } placeholder-custom rounded-lg w-full py-2 px-4 text-[#D0D0D1] ${
        validInput ? "focus:border-[#2A2B34]" : "focus:border-red-300"
      }`,
    [validInput]
  );

  if (shouldRedirect) {
    return <Navigate replace to="/app/home" />;
  }

  const _Container: FC = ({ children }): ReactElement => {
    return (
      <Fragment>
        <div className="flex m-auto flex-col">{children}</div>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div className="bg-[#17161C] h-full overflow-clip w-full flex">
        <div className="flex flex-col w-full lg:w-1/2">
          <Link
            to="/"
            className="ml-8 mt-4 roboto uppercase font-bold text-lg hover:text-[#51339c] text-background"
          >
            Whybot
          </Link>
          <div className="m-auto flex">
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values) => {
                authenticate(values.email, values.password);
              }}
            >
              <Form className="flex flex-col" autoComplete="off">
                <p className="roboto font-bold text-2xl mx-auto text-background">
                  Sign In
                </p>

                <div
                  className={`bg-[#17161C] appearance-none border-[#2A2B34] placeholder-custom rounded-lg w-full py-2 px-4 text-[#D0D0D1] border-2 mt-12 cursor-not-allowed`}
                >
                  <p className="text-center">Continue with Discord</p>
                </div>
                <p className="mx-auto mt-4 uppercase text-white font-bold roboto">
                  or
                </p>
                <Field
                  className={`${GENERIC_INPUT_STYLES()} mt-4`}
                  name="email"
                  autoComplete="off"
                  type="email"
                  placeholder="Email"
                />
                <Field
                  className={`${GENERIC_INPUT_STYLES()} mt-4`}
                  name="password"
                  placeholder="Password"
                  autoComplete="off"
                  type="password"
                />

                <button className="w-[20rem] text-white bg-[#8A899F] rounded-md h-12 text-sm font-medium mt-7 text-center">
                  SIGN IN
                </button>
              </Form>
            </Formik>
          </div>
        </div>
        <div
          className={`hidden lg:flex w-1/2 bg-[#1D1B22] cursor-pointer`}
          onClick={onClickUrl("https://supesu.dev/")}
        >
          <VerticalText toPrint="スペース" Container={_Container} />
        </div>
      </div>
    </Fragment>
  );
};

export default Auth;
