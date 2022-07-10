<!-- 


Create a directory to store the policies.

mkdir -p cerbos-quickstart/policies

Now start the Cerbos server. We are using the container image in this guide but you can follow along using the binary as well. See installation instructions for more information.
docker run --rm --name cerbos -d -v $(pwd)/cerbos/policies:/policies $(pwd)/cerbos/policies:/policies -p 3592:3592 ghcr.io/cerbos/cerbos:0.17.0


docker run --rm --name cerbos -d -v $(pwd)/cerbos-quickstart/policies:/policies -p 3592:3592 ghcr.io/cerbos/cerbos:0.17.0
 -->

 <!-- docker run --rm --name cerbos -d -v $(pwd)/config:/config -v $(pwd)/policies:/policies -p 3592:3592 ghcr.io/cerbos/cerbos:0.17.0
 -->

```js
    // Delete a project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        client: { type: GraphQLString }, 
        email: { type: GraphQLString }, 
      },

      async resolve(parent, args) {

        const client = await Client.findOne({email:args.email})
        const project = await Project.findById(args.id)

        const isValidRole = await checkRole(client, project)
        
        if (!isValidRole){
          throw new Error("You are not authorized to perform this action")
        }

        return Project.findByIdAndRemove(args.id);
      },
    }

// // // // // // // // // // // // // // 
// // // // // // // // // // // // // // 
// // // // // // // // // // // // // // 

    async function checkRole(client, project){
        // cerbos options
        const cerbosOptions = {
          actions: ["read", "create","update", "delete"],
          resource: {
            policyVersion: "default",
            kind: "project",
            instances: {
              project: {
                [project.id]: {
                  attr: {} // a map of attributes about the resource
                },
              },
            },
          },
          principal: {
            id: client._id, //// the user ID
            policyVersion: "default",
            roles: [client?.role || "unknown"], // list of roles from user's profile
            attr: {},
          },
          includeMeta: true,
      }

        const cerbosCheck = await cerbosInstance.check(cerbosOptions)
        const isAuthorized = cerbosCheck.isAuthorized("project", "delete")
        return isAuthorized
    }

```