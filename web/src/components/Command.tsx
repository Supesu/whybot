import React, { Fragment, FC, ReactElement } from "react";

const Container: FC = ({ children }): ReactElement => {
  const STYLES =
    "flex flex-col p-4 rounded cursor-pointer h-20 bg-[#17161c] w-full shadow-md";

  return (
    <Fragment>
      <div className={STYLES}>{children}</div>
    </Fragment>
  );
};

interface DescriptionProps {
  text: string;
}
const Description: FC<DescriptionProps> = ({ text }: DescriptionProps) => {
  const STYLES = "text-sm text-background text-[#9291a3] mt-1";

  return <p className={STYLES}>{text || "No description set"}</p>;
};

interface TitleProps {
  text: string;
}
const Title: FC<TitleProps> = ({ text }: TitleProps) => {
  const STYLES = "text-background text-md";

  return <p className={STYLES}>{text}</p>;
};

interface CommandConfig {
  isAdmin?: boolean;
  description: string;
  title: string;
}

export const Command: FC<CommandConfig> = ({
  description,
  isAdmin,
  title,
}: CommandConfig): ReactElement => {
  if (isAdmin)
    return (
      <Container>
        <Title text={title} />
        <Description text={description} />
      </Container>
    );

  return (
    <Container>
      <Title text={title} />
      <Description text={description} />
    </Container>
  );
};

export default Command;
