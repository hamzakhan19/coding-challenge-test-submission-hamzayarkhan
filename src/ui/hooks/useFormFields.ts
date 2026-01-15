import { useState } from "react";

type FormValues = Record<string, string>;

export function useFormFields<T extends FormValues>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const reset = () => {
    setValues(initialValues);
  };

  return {
    values,
    handleChange,
    reset,
    setValues,
  };
}
