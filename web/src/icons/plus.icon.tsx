import { Fragment } from "react";
import type { ReactElement, FC } from "react";

interface PlusIconProps {
  h: string;
  w: string;
  c: string;
}

export const PlusIcon: FC<PlusIconProps> = ({
  h,
  w,
  c,
}: PlusIconProps): ReactElement => {
  return (
    <Fragment>
      <svg
        style={{
          height: h,
          width: w,
          color: c,
          fill: "currentColor",
        }}
        className="flex m-auto"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
      >
        <g>
          <g>
            <polygon
              fill="currentColor"
              points="289.391,222.609 289.391,0 222.609,0 222.609,222.609 0,222.609 0,289.391 222.609,289.391 222.609,512 
			289.391,512 289.391,289.391 512,289.391 512,222.609 		"
            />
          </g>
        </g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
      </svg>
    </Fragment>
  );
};

export default PlusIcon;
