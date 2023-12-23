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

    if (user && user.publicMetadata.banned && pathname != "/not-allowed") {
      return NextResponse.redirect(new URL("/not-allowed", req.url));
    }

    // ++++++++++++++++++++ Αν το request είναι στο api ++++++++++++++++++++
    if (pathname.includes("api")) {
      if (pathname.includes("/api/admin") && !user?.publicMetadata.role === "admin") {
        return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
      }
      return;
    }

    // ++++++++++++++++++++ Αν το request ΔΕΝ είναι στο api ++++++++++++++++++++

    // Αν ο user πάει να κάνει sign-up ή sign-in
    if (!user) {
      if (pathname.startsWith("/sign-up") || pathname.startsWith("/sign-in")) {
        return;
      } else {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
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

    // Προστασία των user paths

    // Προστασία των leader paths
    if (pathname.includes("/leader") && user.publicMetadata.role !== "leader" && user.publicMetadata.role !== "admin") {
      return NextResponse.redirect(new URL("/not-allowed", req.url));
    }

    // Προστασία των admin paths
    if (pathname.includes("/admin") && user.publicMetadata.role !== "admin") {
      return NextResponse.redirect(new URL("/not-allowed", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

//if (req.nextUrl.searchParams.get("id")) {
