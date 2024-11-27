import { Half2Icon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
export default function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  if (loading) {
    return <Half2Icon />;
  }
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className={className || ""}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
