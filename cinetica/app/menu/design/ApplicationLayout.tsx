import React, { useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../theme-provider";

export const ApplicationLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div
      className={`flex flex-col w-full h-full ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div
        className="grid flex-1 w-full max-w-full h-full"
        style={{
          gridTemplateAreas: isSmallScreen
            ? `"header header"
               "content content"`
            : `"header header"
               "sidebar content"`,
          gridTemplateColumns: isSmallScreen ? "1fr 1fr" : "240px 1fr",
          gridTemplateRows: "80px 1fr",
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};