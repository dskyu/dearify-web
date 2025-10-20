"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Header as HeaderType } from "@/types/blocks/header";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import LocaleToggle from "@/components/locale/toggle";
import { Menu, BarChart3, X } from "lucide-react";
import SignToggle from "@/components/sign/toggle";
import ThemeToggle from "@/components/theme/toggle";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

// 智能菜单项组件，能够根据位置调整子菜单对齐
function SmartNavigationMenuItem({
  item,
  index,
}: {
  item: any;
  index: number;
}) {
  const [alignment, setAlignment] = useState<"start" | "center" | "end">(
    "center",
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (item.children && item.children.length > 0) {
    return (
      <NavigationMenuItem key={index} className="text-gray-600">
        <NavigationMenuTrigger
          ref={triggerRef}
          className="text-gray-900 bg-transparent hover:text-primary hover:bg-transparent px-4 py-2 text-sm font-medium"
        >
          {item.icon && (
            <Icon name={item.icon} className="size-4 shrink-0 mr-2" />
          )}
          <span>{item.title}</span>
        </NavigationMenuTrigger>
        <NavigationMenuContent align={alignment}>
          <ul className="w-80 p-2 bg-white rounded-xl border border-gray-200 shadow-xl">
            <NavigationMenuLink>
              {item.children.map((iitem: any, ii: number) => (
                <li key={ii}>
                  <Link
                    className={cn(
                      "flex select-none gap-3 rounded-lg p-3 leading-none no-underline outline-hidden transition-colors hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900",
                    )}
                    href={iitem.url as any}
                    target={iitem.target}
                  >
                    {iitem.icon && (
                      <Icon
                        name={iitem.icon}
                        className="size-5 shrink-0 text-gray-600"
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">
                        {iitem.title}
                      </div>
                      <p className="text-xs leading-snug text-gray-600 mt-1">
                        {iitem.description}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={index}>
      <Link
        className={cn(
          "text-gray-900 hover:text-primary px-4 py-2 text-sm font-medium transition-colors",
        )}
        href={item.url as any}
        target={item.target}
      >
        {item.icon && (
          <Icon name={item.icon} className="size-4 shrink-0 mr-2" />
        )}
        {item.title}
      </Link>
    </NavigationMenuItem>
  );
}

export default function Header({ header }: { header: HeaderType }) {
  if (header.disabled) {
    return null;
  }

  return (
    <>
      {/* Main Header */}
      <section className="fixed top-0 w-full z-50 py-4">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-gray-100/50 px-6 py-4">
            <nav className="hidden justify-between items-center lg:flex">
              {/* Brand */}
              <div className="flex items-center">
                <Link
                  href={(header.brand?.url as any) || "/"}
                  className="flex items-center gap-3"
                >
                  {header.brand?.logo?.src && (
                    <img
                      src={header.brand.logo.src}
                      alt={header.brand.logo.alt || header.brand.title}
                      className="w-8 h-8"
                    />
                  )}
                  {header.brand?.title && (
                    <span className="text-xl text-gray-900 font-semibold">
                      {header.brand?.title || ""}
                    </span>
                  )}
                </Link>
              </div>

              {/* Centered Navigation Menu */}
              <div className="flex items-center">
                <NavigationMenu>
                  <NavigationMenuList className="gap-1">
                    {header.nav?.items?.map((item, i) => (
                      <SmartNavigationMenuItem key={i} item={item} index={i} />
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              {/* Right side buttons */}
              <div className="shrink-0 flex gap-3 items-center">
                <LocaleToggle />
                <SignToggle />
              </div>
            </nav>

            <div className="block lg:hidden">
              <div className="flex items-center justify-between">
                <Link
                  href={(header.brand?.url || "/") as any}
                  className="flex items-center gap-2"
                >
                  {header.brand?.logo?.src && (
                    <img
                      src={header.brand.logo.src}
                      alt={header.brand.logo.alt || header.brand.title}
                      className="w-8"
                    />
                  )}
                  {header.brand?.title && (
                    <span className="text-xl font-bold">
                      {header.brand?.title || ""}
                    </span>
                  )}
                </Link>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="default" size="icon">
                      <Menu className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>
                        <Link
                          href={(header.brand?.url || "/") as any}
                          className="flex items-center gap-2"
                        >
                          {header.brand?.logo?.src && (
                            <img
                              src={header.brand.logo.src}
                              alt={header.brand.logo.alt || header.brand.title}
                              className="w-8"
                            />
                          )}
                          {header.brand?.title && (
                            <span className="text-xl font-bold">
                              {header.brand?.title || ""}
                            </span>
                          )}
                        </Link>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mb-8 mt-8 flex flex-col gap-4">
                      <Accordion type="single" collapsible className="w-full">
                        {header.nav?.items?.map((item, i) => {
                          if (item.children && item.children.length > 0) {
                            return (
                              <AccordionItem
                                key={i}
                                value={item.title || ""}
                                className="border-b-0"
                              >
                                <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline text-left">
                                  {item.title}
                                </AccordionTrigger>
                                <AccordionContent className="mt-2">
                                  {item.children.map((iitem, ii) => (
                                    <Link
                                      key={ii}
                                      className={cn(
                                        "flex select-none gap-4 rounded-md p-3 leading-none outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                      )}
                                      href={iitem.url as any}
                                      target={iitem.target}
                                    >
                                      {iitem.icon && (
                                        <Icon
                                          name={iitem.icon}
                                          className="size-4 shrink-0"
                                        />
                                      )}
                                      <div>
                                        <div className="text-sm font-semibold">
                                          {iitem.title}
                                        </div>
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {iitem.description}
                                        </p>
                                      </div>
                                    </Link>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            );
                          }
                          return (
                            <Link
                              key={i}
                              href={item.url as any}
                              target={item.target}
                              className="font-semibold my-4 flex items-center gap-2 px-4 text-gray-900 hover:text-primary transition-colors"
                            >
                              {item.icon && (
                                <Icon
                                  name={item.icon}
                                  className="size-4 shrink-0"
                                />
                              )}
                              {item.title}
                            </Link>
                          );
                        })}
                      </Accordion>
                    </div>
                    <div className="flex-1"></div>
                    <div className="border-t pt-4">
                      <div className="mt-2 flex flex-col gap-3">
                        {header.buttons?.map((item, i) => {
                          return (
                            <Button key={i} variant={item.variant}>
                              <Link
                                href={item.url as any}
                                target={item.target || ""}
                                className="flex items-center gap-1"
                              >
                                {item.title}
                                {item.icon && (
                                  <Icon
                                    name={item.icon}
                                    className="size-4 shrink-0"
                                  />
                                )}
                              </Link>
                            </Button>
                          );
                        })}

                        {header.show_sign && <SignToggle />}
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        {header.show_locale && <LocaleToggle />}
                        <div className="flex-1"></div>

                        {header.show_theme && <ThemeToggle />}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
