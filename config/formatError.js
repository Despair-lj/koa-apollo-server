import { GraphQLError } from 'graphql'

class ValidationError extends GraphQLError {
  constructor(errors) {
    super('The request is invalid.')
    console.log('error', errors)
    this.state = errors
  }
}

export { ValidationError }

export default error => ({
  message: error.message,
  state: error.originalError && error.originalError.state,
  locations: error.locations,
  path: error.path
})
