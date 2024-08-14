"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const NavigationTabs = [
  {
    name: "Time",
    href: "/time",
  },
  {
    name: "Weather",
    href: "/weather",
  },
  {
    name: "CRUD",
    href: "/crud",
  },
];

const Header = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const setTheme = useTheme();
  return (
    <>
      <nav className="min-w-full h-16">
        <NavigationMenu className="h-full">
          <NavigationMenuList className="justify-center items-center w-[calc(100vw-1rem)] py-2 gap-2">
            {NavigationTabs.map(({ name, href }, index) => (
              <NavigationMenuItem key={name}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center justify-center gap-2",
                    "py-2 px-3 rounded-lg",
                    "hover:bg-neutral-800 hover:text-white",
                    currentTab === index && "bg-primary text-primary-foreground",

                  )}
                  onClick={() => {
                    console.log(currentTab);

                    setCurrentTab(index);
                  }}
                >
                  {name}
                </Link>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <button
                className={cn(
                  "flex items-center justify-center gap-2",
                  navigationMenuTriggerStyle(),
                  "hover:bg-neutral-800 hover:text-white"
                )}
                onClick={() =>
                  setTheme.theme === "dark"
                    ? setTheme.setTheme("light")
                    : setTheme.setTheme("dark")
                }
              >
                {setTheme.theme === "dark" ? <Sun /> : <Moon />}Theme
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Separator />
      </nav>
    </>
  );
};

export default Header;
