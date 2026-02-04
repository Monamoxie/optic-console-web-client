import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputClassNames = [styles.checkbox, className || ""]
      .filter(Boolean)
      .join(" ");

    if (label) {
      return (
        <div className={styles.wrapper}>
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className={inputClassNames}
            {...props}
          />
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className={inputClassNames}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
