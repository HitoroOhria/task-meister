package injector

import (
	"context"
	"taskmeister.com/backend/infrastructure/repository"
)

func InjectRootNodeRepository(ctx context.Context) *repository.RootNodeRepository {
	return repository.NewRootNodeRepository(
		ctx,
		InjectFirestoreClient(ctx),
	)
}
