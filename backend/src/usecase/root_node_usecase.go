package usecase

import (
	"taskmeister.com/backend/domain/api_io"
	"taskmeister.com/backend/domain/entity"
	"taskmeister.com/backend/infrastructure/repository"
)

type RootNodeUsecase struct {
	RootNodeRepository *repository.RootNodeRepository
}

func NewRootNodeUsecase(rootNodeRepository *repository.RootNodeRepository) *RootNodeUsecase {
	return &RootNodeUsecase{
		RootNodeRepository: rootNodeRepository,
	}
}

func (u *RootNodeUsecase) GetRootNode(input *api_io.GetRootNodeInput) (*api_io.GetRootNodeOutput, error) {
	rootNode, err := u.RootNodeRepository.GetById(input.Id)
	if err != nil {
		return nil, err
	}

	return &api_io.GetRootNodeOutput{
		RootNode: rootNode,
	}, nil
}

func (u *RootNodeUsecase) CreateRootNode(input *api_io.CreateRootNodeInput) (*api_io.CreateRootNodeOutput, error) {
	rootNode := &entity.RootNode{
		MindMapId: input.MindMapId,
		NodesJson: input.NodeJson,
	}

	if err := u.RootNodeRepository.Add(rootNode); err != nil {
		return nil, err
	}

	return &api_io.CreateRootNodeOutput{
		Id: rootNode.Id,
	}, nil
}

func (u *RootNodeUsecase) DeleteRootNode(input *api_io.DeleteRootNodeInput) error {
	return u.RootNodeRepository.DeleteById(input.Id)
}
