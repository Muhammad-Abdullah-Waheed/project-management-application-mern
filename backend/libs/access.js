/**
 * Authorization helpers for workspace and project membership.
 * Handles both populated and unpopulated Mongoose refs on member.user.
 */

export function isWorkspaceMember(workspace, userId) {
    if (!workspace?.members?.length) return false;
    const uid = userId.toString();
    return workspace.members.some((m) => {
        const u = m.user;
        if (u == null) return false;
        const id = u._id != null ? u._id.toString() : u.toString();
        return id === uid;
    });
}

export function isProjectMember(project, userId) {
    if (!project?.members?.length) return false;
    const uid = userId.toString();
    return project.members.some((m) => {
        const u = m.user;
        if (u == null) return false;
        const id = u._id != null ? u._id.toString() : u.toString();
        return id === uid;
    });
}
