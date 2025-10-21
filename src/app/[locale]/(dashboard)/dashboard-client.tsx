"use client";

import React, { ReactNode, useState, useEffect, useRef } from "react";
import {
  BarChart3,
  User,
  Shield,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Crown,
  Globe,
  ChevronDown,
  Check,
  RefreshCw,
  Trash,
  Star,
  MessageSquare,
  ImageIcon,
  Music4,
  Film,
  Sparkles,
  History,
  Heart,
  Baby,
  Users,
  Palette,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { localeNames } from "@/i18n/locale";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "@/i18n/navigation";
import { ChatSessionRecord } from "@/types/chat";
import { SiAppstore } from "react-icons/si";
import { BsGooglePlay } from "react-icons/bs";
import { SUPPORTED_COUNTRIES } from "@/types/language";
import { toast } from "sonner";
import InsufficientCreditsModal from "@/components/billing/insufficient-credits-modal";
import Feedback from "@/components/feedback";
import {
  useCurrentUrl,
  useSearchParam,
  useAllSearchParams,
} from "@/hooks/use-current-url";
import { getCurrentFullUrl, getSearchParam } from "@/lib/url";
import { stylesConfig } from "@/lib/styles-config";

interface SidebarCategory {
  category: string;
  items: SidebarItem[];
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode | string;
  href: string;
  sidebar?: boolean;
  extra?: any;
}

interface DashboardClientProps {
  children: ReactNode;
}

const DashboardClient = ({ children }: DashboardClientProps) => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    user: userInfo,
    setUser,
    setShowFeedback,
    setShowSignModal,
  } = useAppContext();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [userCredits, setUserCredits] = useState<any>(null);
  const [isRefreshingCredits, setIsRefreshingCredits] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const [recentSessions, setRecentSessions] = useState<ChatSessionRecord[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] =
    useState<ChatSessionRecord | null>(null);
  const [isDeletingSession, setIsDeletingSession] = useState(false);
  const [deletingSessionIds, setDeletingSessionIds] = useState<Set<string>>(
    new Set(),
  );
  const [addingSessionIds, setAddingSessionIds] = useState<Set<string>>(
    new Set(),
  );
  const [isInsufficientCreditsModalOpen, setIsInsufficientCreditsModalOpen] =
    useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const mainItems: SidebarCategory[] = [
    {
      category: "Art Studio",
      items: [
        {
          id: "photo-creation",
          label: "Photo Creation",
          href: "/dashboard/photo-creation",
          icon: <ImageIcon className="w-5 h-5" />,
        },
        {
          id: "music-creation",
          label: "Music Creation",
          href: "/dashboard/music-creation",
          icon: <Music4 className="w-5 h-5" />,
        },
        {
          id: "video-creation",
          label: "Video Creation",
          href: "/dashboard/video-creation",
          icon: <Film className="w-5 h-5" />,
        },
      ],
    },
    {
      category: "Styles",
      items: stylesConfig.map((category) => ({
        id: category.id,
        label: category.name,
        href: `/dashboard/styles/${category.slug}`,
        icon: <category.icon className="w-5 h-5" />,
      })),
    },
  ];

  const settingsItems: SidebarCategory[] = [
    {
      category: "Settings",
      items: [
        {
          id: "history",
          label: "History",
          href: "/dashboard/history",
          icon: <History className="w-5 h-5" />,
          sidebar: true,
        },
        {
          id: "profile",
          label: "Profile",
          href: "/dashboard/profile",
          icon: <User className="w-5 h-5" />,
          sidebar: false,
        },
        {
          id: "billing",
          label: "Billing",
          href: "/dashboard/billing",
          icon: <CreditCard className="w-5 h-5" />,
          sidebar: true,
        },
        {
          id: "security",
          label: "Security",
          href: "/dashboard/security",
          icon: <Shield className="w-5 h-5" />,
          sidebar: false,
        },
        {
          id: "feedback",
          label: "Feedback",
          href: "#",
          icon: <MessageSquare className="w-5 h-5" />,
          sidebar: true,
        },
      ],
    },
  ];

  const sidebarItems = [...mainItems, ...settingsItems];

  // Set active section based on current pathname
  useEffect(() => {
    const allItems = sidebarItems.flatMap((cat) => cat.items);
    const currentItem = allItems.find((item) => {
      return pathname.includes(item.href);
    });
    if (currentItem) {
      setActiveSection(currentItem.id);
    }
  }, [pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isUserMenuOpen || isLanguageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen, isLanguageMenuOpen]);

  const handleSwitchLanguage = (value: string) => {
    if (value !== locale) {
      let newPathName = pathname.replace(`/${locale}`, `/${value}`);
      if (!newPathName.startsWith(`/${value}`)) {
        newPathName = `/${value}${newPathName}`;
      }
      router.push(newPathName);
    }
    setIsLanguageMenuOpen(false);
  };

  const handleSignOut = () => {
    setIsSignOutDialogOpen(true);
    setIsUserMenuOpen(false);
  };

  const confirmSignOut = () => {
    signOut({ callbackUrl: `/${locale}` });
  };

  // Fetch user credits
  const fetchUserCredits = async () => {
    try {
      setIsRefreshingCredits(true);
      const response = await fetch("/api/get-user-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.data);
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
    } finally {
      setIsRefreshingCredits(false);
    }
  };

  // Delete session
  const handleDeleteSession = (sessionUuid: string) => {
    const session = recentSessions.find((s) => s.uuid === sessionUuid);
    if (session) {
      setSessionToDelete(session);
      setIsDeleteDialogOpen(true);
    }
  };

  // Add session with animation
  const handleAddSession = (session: ChatSessionRecord) => {
    // Add session to adding state for animation
    setAddingSessionIds((prev) => new Set(prev).add(session.uuid));

    // Add session to the beginning of the list, avoiding duplicates
    setRecentSessions((prev) => {
      const existingIndex = prev.findIndex((s) => s.uuid === session.uuid);
      if (existingIndex >= 0) {
        // If session already exists, move it to the beginning
        const newSessions = [...prev];
        const [existingSession] = newSessions.splice(existingIndex, 1);
        return [existingSession, ...newSessions];
      } else {
        // Add new session to the beginning
        return [session, ...prev];
      }
    });

    // Remove from adding state after animation completes
    setTimeout(() => {
      setAddingSessionIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(session.uuid);
        return newSet;
      });
    }, 300); // Match the CSS transition duration
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      setIsDeletingSession(true);
      // Add session to deleting state for animation
      setDeletingSessionIds((prev) => new Set(prev).add(sessionToDelete.uuid));

      const response = await fetch(
        `/api/chat/session/${sessionToDelete.uuid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        // Wait for animation to complete before removing from state
        setTimeout(() => {
          setRecentSessions((prev) =>
            prev.filter((session) => session.uuid !== sessionToDelete.uuid),
          );
          setDeletingSessionIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(sessionToDelete.uuid);
            return newSet;
          });
        }, 300); // Match the CSS transition duration

        // If the deleted session is currently active, redirect to dashboard
        if (activeSection === sessionToDelete.uuid) {
          setActiveSection("dashboard");
          router.push("/dashboard");
        }

        toast.success("Session deleted successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete session");
        // Remove from deleting state if failed
        setDeletingSessionIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(sessionToDelete.uuid);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
      // Remove from deleting state if failed
      setDeletingSessionIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(sessionToDelete.uuid);
        return newSet;
      });
    } finally {
      setIsDeletingSession(false);
      setIsDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  // Fetch credits on component mount
  useEffect(() => {
    if (userInfo) {
      fetchUserCredits();
    }
  }, [userInfo]);

  // Listen for session creation events
  useEffect(() => {
    const handleSessionCreated = (event: CustomEvent) => {
      const session = event.detail;
      if (session && session.uuid) {
        handleAddSession(session);
      }
    };

    // Add event listener
    window.addEventListener(
      "session-created",
      handleSessionCreated as EventListener,
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "session-created",
        handleSessionCreated as EventListener,
      );
    };
  }, []);

  // Listen for credits update events
  useEffect(() => {
    const handleCreditsUpdated = () => {
      // Refresh credits when credits are consumed
      fetchUserCredits();
    };

    // Add event listener
    window.addEventListener("credits-updated", handleCreditsUpdated);

    // Cleanup
    return () => {
      window.removeEventListener("credits-updated", handleCreditsUpdated);
    };
  }, []);

  // Listen for insufficient credits events
  useEffect(() => {
    const handleInsufficientCredits = () => {
      // Show insufficient credits modal instead of direct redirect
      setIsInsufficientCreditsModalOpen(true);
    };

    // Add event listener
    window.addEventListener("insufficient-credits", handleInsufficientCredits);

    // Cleanup
    return () => {
      window.removeEventListener(
        "insufficient-credits",
        handleInsufficientCredits,
      );
    };
  }, []);

  // Listen for show insufficient credits modal events
  useEffect(() => {
    const handleShowInsufficientCreditsModal = () => {
      setIsInsufficientCreditsModalOpen(true);
    };

    // Add event listener
    window.addEventListener(
      "show-insufficient-credits-modal",
      handleShowInsufficientCreditsModal,
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "show-insufficient-credits-modal",
        handleShowInsufficientCreditsModal,
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${isSidebarCollapsed ? "w-16" : "w-80"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed left-0 top-0 h-full z-40`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              {!isSidebarCollapsed ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <img
                      src="/logo.png"
                      alt="logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {t("metadata.name")}
                  </span>
                </div>
              ) : (
                <div className="w-8 h-8 "></div>
              )}
              <button
                onClick={toggleSidebar}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation - Main Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {mainItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-6">
              {!isSidebarCollapsed && (
                <div className="px-4 mb-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {category.category}
                  </h3>
                </div>
              )}
              <div className="space-y-1 px-2">
                {category.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      router.push(item.href);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    {!isSidebarCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Settings Section - Fixed at Bottom */}
        <div className="border-t border-gray-200 py-4">
          {settingsItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-4">
              {!isSidebarCollapsed && (
                <div className="px-4 mb-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {category.category}
                  </h3>
                </div>
              )}
              <div className="space-y-1 px-2">
                {category.items
                  .filter((item) => item.sidebar === true)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === "feedback") {
                          setShowFeedback(true);
                        } else {
                          setActiveSection(item.id);
                          router.push(item.href);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      {!isSidebarCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile Section */}
        {!isSidebarCollapsed && userInfo && (
          <div className="p-4 border-t border-gray-200">
            {userInfo.subscription_status !== "active" &&
              userInfo.subscription_status !== "" && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Upgrade
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Upgrade to Pro to access all features
                  </p>
                  <button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    onClick={() => router.push("/pricing")}
                  >
                    Upgrade
                  </button>
                </div>
              )}
            <div className="flex items-center space-x-3">
              {userInfo?.avatar_url ? (
                <img
                  src={userInfo.avatar_url}
                  alt={userInfo.nickname || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userInfo?.nickname ||
                    userInfo?.email?.split("@")[0] ||
                    "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userInfo?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${isSidebarCollapsed ? "ml-16" : "ml-80"}`}
      >
        {/* Top Header */}
        <header
          className="bg-white border-b border-gray-200 px-6 py-1.5 fixed top-0 right-0 left-0 z-30"
          style={{ left: isSidebarCollapsed ? "4rem" : "20rem" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
              {activeSection !== "dashboard" && (
                <>
                  <span>›</span>
                  <span className="text-gray-900 font-medium">
                    {
                      sidebarItems
                        .flatMap((cat) => cat.items)
                        .find((item) => item.id === activeSection)?.label
                    }
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {localeNames[locale]}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-gray-500 transition-transform ${isLanguageMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {Object.keys(localeNames).map((key: string) => (
                      <button
                        key={key}
                        onClick={() => handleSwitchLanguage(key)}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors ${
                          locale === key
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{localeNames[key]}</span>
                        {locale === key && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Information */}
              <div className="relative" ref={userMenuRef}>
                <div
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {userInfo?.avatar_url ? (
                    <img
                      src={userInfo.avatar_url}
                      alt={userInfo.nickname || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {userInfo?.nickname ||
                        userInfo?.email?.split("@")[0] ||
                        ""}
                    </p>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {userCredits
                          ? `${userCredits.left_credits} credits`
                          : "Loading..."}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchUserCredits();
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                        title="Refresh credits"
                      >
                        <RefreshCw
                          className={`w-3 h-3 text-gray-500 ${isRefreshingCredits ? "animate-spin" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {userInfo?.avatar_url ? (
                          <img
                            src={userInfo.avatar_url}
                            alt={userInfo.nickname || "User"}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {userInfo?.nickname ||
                              userInfo?.email?.split("@")[0] ||
                              "User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {userInfo?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      {sidebarItems
                        .filter((cat) => cat.category === "Settings")
                        .flatMap((cat) => cat.items)
                        .map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (item.id === "feedback") {
                                setShowFeedback(true);
                                setIsUserMenuOpen(false);
                              } else {
                                router.push(item.href);
                              }
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 mt-16">{children}</main>
      </div>

      {/* Sign Out Dialog */}
      <Dialog
        open={isSignOutDialogOpen}
        onOpenChange={() => setIsSignOutDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSignOutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmSignOut}>
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Session Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "
              {sessionToDelete?.name || "this session"}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeletingSession}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteSession}
              disabled={isDeletingSession}
            >
              {isDeletingSession ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        open={isInsufficientCreditsModalOpen}
        onOpenChange={setIsInsufficientCreditsModalOpen}
        onGoToBilling={() => {
          setIsInsufficientCreditsModalOpen(false);
          router.push("/dashboard/billing");
        }}
      />

      {/* Feedback Component */}
      <Feedback hideButton={true} />
    </div>
  );
};

export default DashboardClient;
