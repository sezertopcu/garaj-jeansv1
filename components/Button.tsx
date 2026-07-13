"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "dark" | "light" | "outline";
  fullWidth?: boolean;
};

export default function Button({
  children,
  variant = "dark",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant} ${
        fullWidth ? "button-full" : ""
      } ${className}`}
      {...props}
    >
      {children}

      <style jsx>{`
        .button {
          min-height: 52px;
          padding: 0 24px;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.4px;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            opacity 0.2s ease;
        }

        .button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .button-dark {
          background: #111111;
          color: #ffffff;
        }

        .button-dark:hover:not(:disabled) {
          background: #292929;
        }

        .button-light {
          background: #ffffff;
          color: #111111;
        }

        .button-light:hover:not(:disabled) {
          background: #f0f0f0;
        }

        .button-outline {
          border-color: #111111;
          background: transparent;
          color: #111111;
        }

        .button-outline:hover:not(:disabled) {
          background: #111111;
          color: #ffffff;
        }

        .button-full {
          width: 100%;
        }
      `}</style>
    </button>
  );
}