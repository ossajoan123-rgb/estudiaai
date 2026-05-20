export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/academic/:path*",
    "/wellness/:path*",
    "/planner/:path*",
  ],
}