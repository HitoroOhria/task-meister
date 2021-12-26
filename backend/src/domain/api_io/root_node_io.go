package api_io

import (
	"taskmeister.com/backend/domain/entity"
)

type GetRootNodeInput struct {
	Id string `param:"id" validate:"required"`
}

func (i *GetRootNodeInput) Validate() error {
	return validatorClient.Struct(i)
}

type GetRootNodeOutput struct {
	RootNode *entity.RootNode `json:"rootNode"`
}

type CreateRootNodeInput struct {
	MindMapId string `json:"mindMapId" validate:"required"`
	NodeJson  string `json:"nodeJson" validate:"required"`
}

func (i *CreateRootNodeInput) Validate() error {
	return validatorClient.Struct(i)
}

type CreateRootNodeOutput struct {
	Id string `json:"id"`
}
