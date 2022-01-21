package repository

import "taskmeister.com/backend/domain/entity"

type RootNodeRepository interface {
	Add(*entity.RootNode) error
	GetById(string) (*entity.RootNode, error)
	DeleteById(string) error
}
