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

    if (pathname.includes("/api/admin") && !user?.publicMetadata.role != "admin") {
      return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
    }

    if (pathname.includes("/api/leader") && !user?.publicMetadata.role != "admin") {
      return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
    }

    if (user && !user.publicMetadata.registered && pathname != "/set-user" && !pathname.includes("api")) {
      return NextResponse.redirect(new URL("/set-user", req.url));
    }

    if (user && user.publicMetadata.registered && !user.publicMetadata.active && pathname != "/activation" && !pathname.includes("api")) {
      return NextResponse.redirect(new URL("/activation", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
