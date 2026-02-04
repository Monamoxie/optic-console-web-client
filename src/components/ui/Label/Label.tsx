import { LabelHTMLAttributes, forwardRef } from "react";
import styles from "./Label.module.css";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required = false, children, ...props }, ref) => {
    const classNames = [styles.label, className || ""].filter(Boolean).join(" ");

    return (
      <label ref={ref} className={classNames} {...props}>
        {children}
        {required && <span className={styles.required}>*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";
