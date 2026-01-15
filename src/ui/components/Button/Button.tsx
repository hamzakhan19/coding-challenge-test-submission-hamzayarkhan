import React, { FunctionComponent } from "react";
import { ButtonType, ButtonVariant } from "@/types";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  onClick,
  ...rest
}) => {
  const className = [
    styles.button,
    variant === "primary" ? styles.primary : "",
    variant === "secondary" ? styles.secondary : "",
  ].join(" ");

  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? (
        <span data-testid="loading-spinner">Loading...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
