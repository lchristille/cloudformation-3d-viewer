/** @jsxImportSource @emotion/react */
import { ReactElement } from "react";
import { css } from "@emotion/react";
import React from "react";

const toolbarButtonStyle = css`
  position: relative;
  max-height: 22px;
  max-width: 22px;
  padding: 3px;
  outline: none;

  &:hover {
    background-color: var(--vscode-toolbar-hoverBackground);
  }

  /* Show the tooltip on hover */
  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const tooltipStyle = css`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 125%; /* Position below the button */
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--vscode-toolbar-hoverBackground);
  color: var(--vscode-icon-foreground);
  padding: 4px 8px;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--vscode-widget-border);
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Subtle shadow */
  transition: opacity 0.2s ease;
  z-index: 999999;

  /* Small arrow below the tooltip */
  &::after {
    content: '';
    position: absolute;
    bottom: 100%; /* Arrow at the top of the tooltip */
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent #252526 transparent;  }
`

type OnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

interface ToolbarButtonProps {
  children: ReactElement<{ size?: number; color?: string, onClick?: OnClickHandler}>;
  onClick?: OnClickHandler;
  tooltipText?: string;
  size?: number;
  iconColor?: string;
}

export default function ToolbarButton({
  children,
  onClick,
  size = 16,
  iconColor = "var(--vscode-icon-foreground)",
  tooltipText
}: ToolbarButtonProps) {
  const child = React.Children.only(children);
  return (
    <button
      css={toolbarButtonStyle}
      className="inline-flex items-center justify-center p-2 rounded"
    >
      {React.isValidElement(child)
        ? React.cloneElement(child, { size, color: iconColor, onClick })
        : child}
      {tooltipText && <span css={tooltipStyle} className='tooltip'>{tooltipText}</span>}
    </button>
  );
}
