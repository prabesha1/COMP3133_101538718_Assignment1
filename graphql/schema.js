const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type User {
    _id: ID!
    username: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
    message: String!
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    createdAt: String
    updatedAt: String
  }

  type MessageResponse {
    message: String!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  type Query {
    employees: [Employee!]!
    employeeById(id: ID!): Employee
    employeesByDepartment(department: String!): [Employee!]!
    employeesByDesignation(designation: String!): [Employee!]!
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee!
    deleteEmployee(id: ID!): MessageResponse!
  }
`);
