import React from "react";
import Button from "./Button";

// ---------- Common Props ----------
interface ButtonProps {
  size?: "sm" | "md";
  children: React.ReactNode;
  onClick?: () => void;
  Icon?: React.ReactNode; // 👈 optional dynamic icon
}

// ---------- Primary Button ----------
export const PrimaryButton: React.FC<ButtonProps> = ({
  size = "md",
  children,
  onClick,
}) => (
  <Button size={size} variant="primary" onClick={onClick}>
    {children}
  </Button>
);

// ---------- Primary Button with Left Icon ----------
export const PrimaryButtonWithLeftIcon: React.FC<ButtonProps> = ({
  size = "md",
  children,
  onClick,
  Icon,
}) => (
  <Button size={size} variant="primary" startIcon={Icon} onClick={onClick}>
    {children}
  </Button>
);

// ---------- Primary Button with Left Icon ----------
export const BtnBdg: React.FC<ButtonProps> = ({
  children,
  onClick,
}) => (
  <button style={{ borderRadius: '4px', background: "#01B4FF2E", padding: "3px 14px", fontSize: "0.8em", color: "#01B4FF" }} onClick={onClick}>
    {children}
  </button>
);

// ---------- Primary Button with Right Icon ----------
export const PrimaryButtonWithRightIcon: React.FC<ButtonProps> = ({
  size = "md",
  children,
  onClick,
  Icon,
}) => (
  <Button size={size} variant="primary" endIcon={Icon} onClick={onClick}>
    {children}
  </Button>
);

// ---------- Outline Button ----------
export const OutlineButton: React.FC<ButtonProps> = ({
  size = "md",
  children,
  onClick,
}) => (
  <Button size={size} variant="outline" onClick={onClick}>
    {children}
  </Button>
);

// ---------- Outline Button with Left Icon ----------
export const OutlineButtonWithLeftIcon: React.FC<ButtonProps> = ({
  size = "md",
  children,
  onClick,
  Icon,
}) => (
  <Button size={size} variant="outline" startIcon={Icon} onClick={onClick}>
    {children}
  </Button>
);

// ---------- Outline Button with Right Icon ----------
export const OutlineButtonWithRightIcon: React.FC<ButtonProps> = ({
  size = "md",
  children,
  onClick,
  Icon,
}) => (
  <Button size={size} variant="outline" endIcon={Icon} onClick={onClick}>
    {children}
  </Button>
);