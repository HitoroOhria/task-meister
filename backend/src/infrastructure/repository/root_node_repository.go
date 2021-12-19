package repository

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"taskmeister.com/backend/domain/entity"
	"taskmeister.com/backend/infrastructure/client"
)

type RootNodeRepository struct {
	ctx        context.Context
	collection *firestore.CollectionRef
}

func NewRootNodeRepository(ctx context.Context, handler *client.FirestoreClient) *RootNodeRepository {
	return &RootNodeRepository{
		ctx:        ctx,
		collection: handler.Client.Collection("RootNodes"),
	}
}

func (r *RootNodeRepository) Add(rootNode *entity.RootNode) error {
	doc, _, err := r.collection.Add(r.ctx, &rootNode)
	if err != nil {
		log.Printf("adding Collection to RootNode failed.\nerr = %+v\n", err)
		return err
	}
	rootNode.Id = doc.ID

	return nil
}

func (r *RootNodeRepository) GetById(id string) (*entity.RootNode, error) {
	dataSnap, err := r.collection.Doc(id).Get(r.ctx)
	if status.Code(err) == codes.NotFound {
		log.Printf("not found RootNode Doc. Id is %+v\nerr = %+v", id, err)
		return nil, err
	} else if err != nil {
		log.Printf("getting RootNode Doc failed.\nerr = %+v", err)
	}

	var rootNode entity.RootNode
	if err = dataSnap.DataTo(&rootNode); err != nil {
		log.Printf("can not convert RootNode Doc.\nerr=%+v", err)
		return nil, err
	}
	rootNode.Id = id

	return &rootNode, nil
}
