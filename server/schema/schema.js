const Project = require('../models/Project')
const Client = require('../models/Client')

const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

const {Cerbos} = require('cerbos')
const cerbosInstance = new Cerbos({
  hostname: "http://localhost:3592",
})


const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql')

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId)
      },
    },
  }),
})

// Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
    password: {type: GraphQLString}
  }),
})

const AuthPayload = new GraphQLObjectType({
  name: 'AuthPayloadType',
  fields: () => ({
    token: { type: GraphQLString },
    client: ClientType
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args, context, info) {
        // if(context.user.role ==='admin')
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
  },
})

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add a client
    // addClient
    registerClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, {name, email, role, password}) {

      const client = Client.create({
        name: name,
        email: email,
        role: role,
        password: await bcrypt.hash(password, 10),
      })


      // client.save()

      const token = jsonwebtoken.sign(
        {id: client.id, email:client.email},
        'supersecret',
      )
        return client
        
      },
    },
    loginClient: {
      type: ClientType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },

      async resolve(parent, args) {
        const client = await Client.findOne({ email: args.email })

        if (!client) {
          throw new Error(`No user found with email, ${args.email}`)
        }

        const isValid = await bcrypt.compare(args.password, client.password)

        if (!isValid){
          throw new Error('invalid password')
        }

        // Else
          const token = jsonwebtoken.sign(
            {id: client.id},
            'supersecret',
          )

          console.log(token)

          return client

      },
    },
    // Delete a client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        Project.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => {
            project.remove();
          });
        });

        return Client.findByIdAndRemove(args.id);
      },
    },
    // Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
              rejected: {value: 'Rejected'}
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });

        return project.save();
      },
    },




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

        // cerbos options
      //   const cerbosOptions = {
      //     actions: ["read", "create","update", "delete"],
      //     resource: {
      //       policyVersion: "default",
      //       kind: "project",
      //       instances: {
      //         project: {
      //           [args.id]: {
      //             attr: {} // a map of attributes about the resource - not used yet
      //           },
      //         },
      //       },
      //     },
      //     principal: {
      //       id: "0", //// the user ID
      //       policyVersion: "default",
      //       roles: [/**user?.role */ "admin" || "unknown"], // list of roles from user's profile
      //       attr: {},
      //     },
      //     includeMeta: true,
      // }

        // const cerbosCheck = await cerbosInstance.check(cerbosOptions)
        // const isAuthorized = cerbosCheck.isAuthorized("project", "delete")
        
        
        const isValidRole = await checkRole(client, project)

        console.log(!isValidRole)
        
        if (!!isValidRole){
          throw new Error("You are not authorized to perform this action")
        }
        
        return project//Project.findByIdAndRemove(args.id);
      },
    },

    // Update a project

    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
              rejected: { value: 'Rejected' }
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
})


async function checkRole(client, project){
  // cerbos options
  const cerbosOptions = {
    actions: ["read", "create","update", "delete"],
    resource: {
      policyVersion: "default",
      kind: "project",
      instances: {
        project: {
          [project._id]: {
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



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
})