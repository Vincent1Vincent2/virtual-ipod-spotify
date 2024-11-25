import { useTheme } from "@/app/hooks/useTheme";
import { MenuItem } from "@/types/iPod/Screen";

export const createMenu = (isAuthenticated: boolean): MenuItem[] => {
  const { setTheme } = useTheme();

  return [
    {
      type: "navigation",
      label: "Settings",
      subMenu: [
        {
          type: "navigation",
          label: "Theme",
          subMenu: [
            {
              type: "action",
              label: "Classic",
              onClick: () => setTheme("classic"),
            },
            {
              type: "action",
              label: "Mini",
              onClick: () => setTheme("mini"),
            },
            {
              type: "action",
              label: "Nano",
              onClick: () => setTheme("nano"),
            },
          ],
        },
      ],
    },
    {
      type: "action",
      label: "About",
      onClick: () => console.log("About clicked"),
    },
  ];
};
