package api_io

import "github.com/go-playground/validator/v10"

// validatorClient is Validator for input.
// Defined to reduce instantiation costs.
var validatorClient = validator.New()
