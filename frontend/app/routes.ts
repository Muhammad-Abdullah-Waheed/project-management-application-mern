import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/auth/auth-layout.tsx", [
        index("routes/root/home.tsx"),
        route("sign-in", "routes/auth/sign-in.tsx"),
        route("sign-up", "routes/auth/sign-up.tsx"),
        route("forget-password", "routes/auth/forget-password.tsx"),
        route("reset-password", "routes/auth/reset-password.tsx"),
        route("verify-email", "routes/auth/verify-email.tsx"),
    ]),
    layout("routes/dashboard/dashBoard-Layout.tsx", [
        route("dashboard", "routes/dashboard/index.tsx"),
        route("workspaces", "routes/dashboard/workspaces/index.tsx"),
        route("workspaces/:workspaceId", "routes/dashboard/workspaces/workspace-details.tsx"),
        route("workspaces/:workspaceId/projects/:projectId",
            "routes/dashboard/projects/project-details.tsx"),
        route("workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
            "routes/dashboard/tasks/task-details.tsx"),
        route("my-tasks", "routes/dashboard/my-tasks.tsx"),
        route("members", "routes/dashboard/members.tsx"),
        route("achieved", "routes/dashboard/achieved.tsx"),
        route("settings", "routes/dashboard/settings.tsx"),
    ]),

    route("workspace-invite/:workspaceId", "routes/dashboard/workspaces/workspace-invite.tsx"),

    layout("routes/user/user-layout.tsx", [
        route("user/profile", "routes/user/profile.tsx"),
    ]),

] satisfies RouteConfig;
