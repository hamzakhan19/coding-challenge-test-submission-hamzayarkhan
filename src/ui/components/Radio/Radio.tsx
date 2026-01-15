import React, { FunctionComponent } from "react";

import $ from "./Radio.module.css";

interface RadioProps {
  id: string;
  name: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

const Radio: FunctionComponent<RadioProps> = ({
  children,
  id,
  name,
  checked,
  onChange,
}) => {
  return (
    <div
      className={$.radio}
      onClick={() => {
        const event = {
          target: {
            name,
            value: id,
            type: "radio",
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        onChange?.(event);
      }}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={id}
        checked={checked}
        readOnly
      />
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export default Radio;
