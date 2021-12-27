package api_io

import (
	"taskmeister.com/backend/domain/entity"
)

// ---------- GetRootNode ----------

type GetRootNodeInput struct {
	Id string `param:"id" validate:"required"`
}

func (i *GetRootNodeInput) Validate() error {
	return validatorClient.Struct(i)
}

type GetRootNodeOutput struct {
	RootNode *entity.RootNode `json:"rootNode"`
}

// ---------- CreateRootNode ----------

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

// ---------- DeleteRootNode ----------

type DeleteRootNodeInput struct {
	Id string `param:"id" validate:"required"`
}

func (i *DeleteRootNodeInput) Validate() error {
	return validatorClient.Struct(i)
}
