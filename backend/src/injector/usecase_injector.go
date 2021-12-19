package injector

import (
	"context"

	"taskmeister.com/backend/usecase"
)

func InjectRootNodeUsecase(ctx context.Context) *usecase.RootNodeUsecase {
	return usecase.NewRootNodeUsecase(InjectRootNodeRepository(ctx))
}
