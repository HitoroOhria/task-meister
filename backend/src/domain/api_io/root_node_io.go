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
	RootNode *entity.RootNode `json:"root_node"`
}

type CreateRootNodeInput struct {
	MindMapId string `json:"mind_map_id" validate:"required"`
	NodeJson  string `json:"node_json" validate:"required"`
}

func (i *CreateRootNodeInput) Validate() error {
	return validatorClient.Struct(i)
}

type CreateRootNodeOutput struct {
	Id string `json:"id"`
}
