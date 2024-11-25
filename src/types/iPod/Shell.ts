export interface ShellTheme {
  shellColor: string;
  borderColor: string;
  borderOpacity: number;
}

export interface ShellProps {
  children?: React.ReactNode;
  theme?: "classic" | "modern";
  className?: string;
}
