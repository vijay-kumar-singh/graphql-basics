const fetch = require('node-fetch')
const util = require('util')
require('util.promisify').shim()

const parseXML = util.promisify(require('xml2js').parseString)

const { GraphQLSchema, 
        GraphQLObjectType,
        GraphQLString, 
        GraphQLInt
    } = require('graphql')

fetch('https://www.goodreads.com/author/show.xml?id=4432&key=zbSXrHnNm437G9RPHclmyg')
.then(response => response.text())
.then(parseXML)

const AuthorType = new GraphQLObjectType({
    name:'Author',
    description: '...',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: xml => 
            xml.GoodreadsResponse.author[0].name[0]
        }
    })
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:'Query',
        description: '...',
        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: { type:GraphQLInt }
                },
                resolve: (root,args) => fetch(
                    `https://www.goodreads.com/author/show.xml?id=${args.id}&key=zbSXrHnNm437G9RPHclmyg`
                )
                .then(response => response.text())
                .then(parseXML)

                }
            
        })

    })
})