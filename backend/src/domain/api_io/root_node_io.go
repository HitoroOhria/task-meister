package api_io

import (
	"github.com/go-playground/validator/v10"
	"taskmeister.com/backend/domain/entity"
)

type GetRootNodeInput struct {
	Id string `param:"id" validate:"required"`
}

func (i *GetRootNodeInput) Validate() error {
	return validator.New().Struct(i)
}

type GetRootNodeOutput struct {
	RootNode *entity.RootNode `json:"root_node"`
}
