import React, { PropsWithChildren, useState, useEffect } from "react";
import { 
  BookmarkCheck, 
  MonitorPlay, 
  Popcorn, 
  Telescope, 
  UserRound, 
  LogOut, 
  Moon, 
  Sun, 
  Monitor, 
  X,
  MenuIcon
} from "lucide-react";
import { useTheme } from '../theme-provider';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

interface SidebarProps extends PropsWithChildren {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  isSmallScreen?: boolean;
}

const item = [
  {
    title: "Discover",
    url: "#",
    icon: Telescope,
  },
];
const itemsMovie = [
  {
    title: "Now playing",
    url: "#",
    icon: Popcorn,
  },
  {
    title: "Popular",
    url: "#",
    icon: UserRound,
  },
  {
    title: "Top rated",
    url: "#",
    icon: BookmarkCheck,
  },
];
const itemsShow = [
  {
    title: "On the air",
    url: "#",
    icon: MonitorPlay,
  },
  {
    title: "Popular",
    url: "#",
    icon: UserRound,
  },
  {
    title: "Top rated",
    url: "#",
    icon: BookmarkCheck,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  children, 
  isOpen, 
  onClose,
  onOpen,
  isSmallScreen
}) => {
  const { theme } = useTheme();

  return (
    <>
      {isSmallScreen && (
        <button 
          onClick={onOpen} 
          className="fixed top-4 left-4 z-50 bg-gray-200 dark:bg-gray-700 p-2 rounded-md"
        >
          <MenuIcon />
        </button>
      )}
      <div 
        className={`h-full 
          ${isSmallScreen ? 'absolute top-20 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out' : 'relative block'}
          ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}
          ${isSmallScreen && isOpen ? 'translate-x-0' : (isSmallScreen ? '-translate-x-full' : '')}
        `} 
        style={{ gridArea: "sidebar" }}
      >
      {isSmallScreen && onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          aria-label="Close sidebar"
        >
          <X />
        </button>
        )}
        {children}
      </div>
    </>
  );
};

export const AppSidebar: React.FC = () => {
  const { data: session } = useSession();
  const { mode, setMode } = useTheme();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getNextMode = () => {
    switch (mode) {
      case "auto": return "light";
      case "light": return "dark";
      case "dark": return "auto";
      default: return "auto";
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case "auto": return Monitor;
      case "light": return Sun;
      case "dark": return Moon;
      default: return Monitor;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case "auto": return "Auto";
      case "light": return "Clair";
      case "dark": return "Sombre";
      default: return "Auto";
    }
  };

  const handleSignOut = () => {
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    signOut();
  };

  return (
    <Sidebar 
      isOpen={isSmallScreen && isSidebarOpen} 
      onClose={() => setIsSidebarOpen(false)}
      onOpen={() => setIsSidebarOpen(true)}
      isSmallScreen={isSmallScreen}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {item.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href="/menu">
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          <SidebarGroupLabel>Movies</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsMovie.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={`/menu/movie/${item.title.toLowerCase().replace(" ", "-")}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          <SidebarGroupLabel>TV Shows</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsShow.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={`/menu/show/${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {session && isSmallScreen && (
            <>
              <SidebarGroupLabel>Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {isSidebarOpen && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleSignOut}>
                          <LogOut />
                          <span>Déconnexion</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => setMode(getNextMode())}>
                          {React.createElement(getModeIcon())}
                          <span>Mode {getModeLabel()}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}; 