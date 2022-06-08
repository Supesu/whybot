import React, { Fragment, FC, ReactElement } from "react";
import { TrashIcon, EditIcon } from "../icons";

interface ContainerProps {
  row?: boolean;
}
const Container: FC<ContainerProps> = ({
  children,
  row = false,
}): ReactElement => {
  const STYLES = `flex flex-${
    row ? "row" : "col"
  } p-4 rounded h-20 bg-[#17161c] w-full shadow-md`;

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

interface EditProps {
  onPress: () => void;
}
const Edit: FC<EditProps> = ({ onPress }: EditProps) => {
  return (
    <Fragment>
      <div
        onClick={onPress}
        className="flex cursor-pointer ml-auto h-12 w-12 bg-[#212029] rounded-md"
      >
        <EditIcon
          containerStyles={"m-auto"}
          iconStyles={"h-6 w-6"}
          color={"#3b3847"}
        />
      </div>
    </Fragment>
  );
};

interface DeleteProps {
  onPress: () => void;
}
const Delete: FC<DeleteProps> = ({ onPress }: DeleteProps) => {
  return (
    <Fragment>
      <div
        onClick={onPress}
        className="flex cursor-pointer ml-3 h-12 w-12 bg-[#212029] rounded-md"
      >
        <TrashIcon
          containerStyles={"m-auto"}
          iconStyles={"h-6 w-6"}
          color={"#3b3847"}
        />
      </div>
    </Fragment>
  );
};

interface CommandConfig {
  isAdmin?: boolean;
  adminTools?: {
    handleDelete: (id: string) => void;
    handleEdit: (id: string) => void;
  };
  description: string;
  title: string;
  id?: string;
}

export const Command: FC<CommandConfig> = ({
  description,
  isAdmin,
  title,
  id,
  adminTools,
}: CommandConfig): ReactElement => {
  if (isAdmin)
    return (
      <Container row>
        <div className="flex-col">
          <Title text={title} />
          <Description text={description} />
        </div>

        <Edit onPress={() => adminTools!.handleEdit(id!)} />
        <Delete onPress={() => adminTools!.handleDelete(id!)} />
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
