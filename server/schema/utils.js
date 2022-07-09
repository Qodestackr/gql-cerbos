

const cerbosOptions = {
    actions: ["read", "create","update", "delete"],
    resource: {
      policyVersion: "default",
      kind: "project",
      instances: {
        project: {
          [Project.id]: {
            attr: {Project} // a map of attributes about the resource - not used yet
          },
        },
      },
    },
    principal: {
      id: user.id || "0", //// the user ID
      policyVersion: "default",
      roles: [user?.role || "unknown"], // list of roles from user's profile
      attr: {user},
    },
    includeMeta: true,
}

module.exports = cerbosOptions