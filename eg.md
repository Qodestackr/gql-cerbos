<!-- 


Create a directory to store the policies.

mkdir -p cerbos-quickstart/policies

Now start the Cerbos server. We are using the container image in this guide but you can follow along using the binary as well. See installation instructions for more information.
docker run --rm --name cerbos -d -v $(pwd)/cerbos/policies:/policies $(pwd)/cerbos/policies:/policies -p 3592:3592 ghcr.io/cerbos/cerbos:0.17.0


docker run --rm --name cerbos -d -v $(pwd)/cerbos-quickstart/policies:/policies -p 3592:3592 ghcr.io/cerbos/cerbos:0.17.0
 -->

 <!-- docker run --rm --name cerbos -d -v $(pwd)/config:/config -v $(pwd)/policies:/policies -p 3592:3592 ghcr.io/cerbos/cerbos:0.17.0
 -->