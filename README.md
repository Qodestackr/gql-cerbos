GraphQL && Cerbos.
😑 Wish there was an Easy way of doing this 

<!-- 

Scalar fields (strings, booleans, or numbers) that should have different levels of access controls to other fields.
Object and collection fields where an access check can be applied to the parent to save the field resolution, and avoid individual policy checks on each resolved object. 
-->

<!-- 

In the example above, we see that the business logic layer requires the caller to provide a user object. If you are using GraphQL.js, the User object should be populated on the context argument or rootValue in the fourth argument of the resolver. Field authorization does not replace object level checks, unless the object precisely matches the access level of the parent project
Field authorization is recommended for:
 -->