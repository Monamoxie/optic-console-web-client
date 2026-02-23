import React from "react";
import styles from "./Alert.module.css";

export type AlertVariant = "error" | "warning" | "success" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = "info", children, className }: AlertProps) {
  const variantClass = styles[variant];
  const combinedClassName = className
    ? `${styles.alert} ${variantClass} ${className}`
    : `${styles.alert} ${variantClass}`;

  return <div className={combinedClassName}>{children}</div>;
}
