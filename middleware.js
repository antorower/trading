import { authMiddleware } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  beforeAuth: (req) => {},
  afterAuth: async (auth, req) => {
    let user;
    const pathname = req.nextUrl.pathname;

    if (auth?.userId) {
      user = await clerkClient.users?.getUser(auth.userId);
    }

    // ++++++++++++++++++++ Αν το request είναι στο api ++++++++++++++++++++
    if (pathname.includes("api")) {
      if (pathname.includes("/api/user") && !user) {
        return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
      }

      if (pathname.includes("/api/leader") && !user?.publicMetadata.role === "leader" && !user?.publicMetadata.role === "admin") {
        return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
      }

      if (pathname.includes("/api/admin") && !user?.publicMetadata.role === "admin") {
        console.log(user.publicMetadata);
        return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
      }
      return;
    }

    // ++++++++++++++++++++ Αν το request ΔΕΝ είναι στο api ++++++++++++++++++++

    // Αν ο user πάει να κάνει sign-up ή sign-in
    if (pathname === "/sign-up" || pathname === "/sign-in") {
      if (!user) {
        return;
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // ++++++++++++++++++++ Από εδώ και κάτω ο user έχει κάνει login ++++++++++++++++++++

    // Λογική για νέο χρήστη
    if (!user.publicMetadata.registered && pathname !== "/set-user") {
      return NextResponse.redirect(new URL("/set-user", req.url));
    }
    if (user.publicMetadata.registered && !user.publicMetadata.active && pathname !== "/activation") {
      return NextResponse.redirect(new URL("/activation", req.url));
    }
    if (pathname === "/activation" && user.publicMetadata.registered && user.publicMetadata.active) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

//if (req.nextUrl.searchParams.get("id")) {
