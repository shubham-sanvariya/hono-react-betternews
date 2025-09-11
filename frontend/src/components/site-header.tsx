import { Link } from "@tanstack/react-router";

import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";

export function Header() {

  const { data: user } = useQuery(userQueryOptions());

  return (
    <header
      className={
        "sticky top-0 z-50 w-full border-border/40 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90"
      }
    >
      <div
        className={"container mx-auto flex items-center justify-between p-4"}
      >
        <div className="flex items-center space-x-4">
          <Link to={"/"} className={"text-2xl font-bold"}>
            BetterNews
          </Link>
          <nav className={"hidden items-center space-x-4 md:flex"}>
            <Link to={"/"} className={"hover:underline"}>
              new
            </Link>
            <Link to={"/"} className={"hover:underline"}>
              top
            </Link>
            <Link to={"/"} className={"hover:underline"}>
              submit
            </Link>
          </nav>
        </div>
        <div className="hidden items-center space-x-4">
          {user ? (<>
            <span>{user}</span>
            <Button asChild size="sm" variant={'secondary'} className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70">
              <a href="api/auth/logout">Log out</a>
            </Button>
          </>) : (<Button asChild size="sm" variant={'secondary'} className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70">
              <Link to="/">
                Log in
              </Link>
            </Button>)}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"secondary"} size={"icon"} className={"md:hidden"}>
              <MenuIcon className={"size-6"} />
            </Button>
          </SheetTrigger>
          <SheetContent className="mb-2">
            <SheetHeader>
              <SheetTitle>BetterNews</SheetTitle>
              <SheetDescription className={"sr-only"}>
                Navigation
              </SheetDescription>
            </SheetHeader>
            <nav className={'flex p-2 flex-col space-y-4'}>
              <Link to={"/"} className={"hover:underline"}>
                new
              </Link>
              <Link to={"/"} className={"hover:underline"}>
                top
              </Link>
              <Link to={"/"} className={"hover:underline"}>
                submit
              </Link>
              {user ? (<>
                <span>{user}</span>
                <Button asChild size="sm" variant={'secondary'} className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70">
                  <a href="api/auth/logout">Log out</a>
                </Button>
              </>) : (<Button asChild size="sm" variant={'secondary'} className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70">
                <Link to="/">
                  Log in
                </Link>
              </Button>)}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
