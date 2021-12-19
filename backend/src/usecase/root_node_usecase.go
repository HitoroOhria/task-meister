package usecase

import (
	"taskmeister.com/backend/domain/api_io"
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
