const {Cerbos} = require('cerbos')

const cerbosInstance = new Cerbos({
  hostname: "http://localhost:3592",
})

async function cbs (principalId, action, resourceAtrr = {}){
        const user = {
            id: "62c9bcc3a98941e99160f6c1",
            name: 'Jade',
            email: 'jade@gmail.com',
            role: 'admin',
            password: '$2a$10$9Ia/jdgVoU8r6IrzBjyOSOLt4SkH/iukr5VK5X8CORCw6brSZ273m',
            __v: 0
        }
        const Project = {
                id:"62ca06c18874124bc8491e61",
                name: 'project1',
                description: 'My first project',
                status: 'Not Started',
                clientId: "62c9c202e66c7944628c79e0",
                __v: 0
        }
        //db.users.find((item) => item.id === Number(principalId));
      
        const cerbosObject = {
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
        };
      
        const cerbosCheck = await cerbosInstance.check(cerbosObject)

        const isAuthorized = cerbosCheck.isAuthorized("project", "delete")

        console.log(!isAuthorized)

        if (isAuthorized){
          throw new Error("You are not authorized to perform this action")
        }
        // console.log("Wow!")
        return true;       
}

// const permissions = await cerbosInstance.check({
//     principal: {
//       id: "34",//req.user.id, // will change
//       roles: "user",//req.user.roles, // will change
//       attr: "ruhg"//req.user // will change
//     },
//     resource: {
//       kind: "project",
//       instances: {
//         ["project.id"]: {
//           attr: "project"
//         },
//       },
//     },
    
//     actions: ["update"],
// })

console.log(cerbosInstance)

// cbs()
    // await deleteProject
    // This will return an either allow or deny
    // do policy check if authorized to perform action [update]::
    // if(!permissions.isAuthorized(project.id, "update")){ res.status(403).json({msg: "forbidden"}) }
  
    // else update if attributes match
    // await deleteProject(project, req.body)
    // res.status(200).json({status: "ok", data: project})

// module.exports = {
//     permissions
// }