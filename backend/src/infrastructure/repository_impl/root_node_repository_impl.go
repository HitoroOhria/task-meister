package repository_impl

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"taskmeister.com/backend/domain/entity"
	"taskmeister.com/backend/domain/repository"
	"taskmeister.com/backend/infrastructure/client"
)

const (
	collectionName = "RootNodes"
)

type RootNodeRepositoryImpl struct {
	ctx        context.Context
	collection *firestore.CollectionRef
}

func NewRootNodeRepository(ctx context.Context, handler *client.FirestoreClient) repository.RootNodeRepository {
	return &RootNodeRepositoryImpl{
		ctx:        ctx,
		collection: handler.Client.Collection(collectionName),
	}
}

// Add create or update Node.
func (r *RootNodeRepositoryImpl) Add(rootNode *entity.RootNode) error {
	doc, _, err := r.collection.Add(r.ctx, &rootNode)
	if err != nil {
		log.Printf("adding Collection to Node failed.\nerr = %+v\n", err)
		return err
	}
	rootNode.Id = doc.ID

	log.Printf("generated RooNode ID: %+v", doc.ID)

	return nil
}

// GetById get Node from id.
func (r *RootNodeRepositoryImpl) GetById(id string) (*entity.RootNode, error) {
	dataSnap, err := r.collection.Doc(id).Get(r.ctx)
	if status.Code(err) == codes.NotFound {
		log.Printf("not found Node Doc. Id is %+v\nerr = %+v", id, err)
		return nil, err
	} else if err != nil {
		log.Printf("getting Node Doc failed.\nerr = %+v", err)
	}

	var rootNode entity.RootNode
	if err = dataSnap.DataTo(&rootNode); err != nil {
		log.Printf("can not convert Node Doc.\nerr=%+v", err)
		return nil, err
	}
	rootNode.Id = id

	return &rootNode, nil
}

// DeleteById delete Node by id.
func (r *RootNodeRepositoryImpl) DeleteById(id string) error {
	_, err := r.collection.Doc(id).Delete(r.ctx)
	if err != nil {
		log.Printf("can not delete Node. Id is %+v\nerr = %+v", id, err)
		return err
	}

	return nil
}
