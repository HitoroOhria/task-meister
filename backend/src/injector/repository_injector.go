package injector

import (
	"context"
	"taskmeister.com/backend/domain/repository"
	"taskmeister.com/backend/infrastructure/repository_impl"
)

func InjectRootNodeRepository(ctx context.Context) repository.RootNodeRepository {
	return repository_impl.NewRootNodeRepository(
		ctx,
		InjectFirestoreClient(ctx),
	)
}
