const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String!
    category: String!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }
`);

module.exports = schema;
