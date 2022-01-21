package injector

import (
	"context"

	"taskmeister.com/backend/handler/api_handler"
)

func InjectHealthCheckHandler() *api_handler.HealthCheckHandler {
	return api_handler.NewHealthCheckHandler()
}

func InjectRootNodeHandler(ctx context.Context) *api_handler.RootNodeHandler {
	return api_handler.NewRootNodeHandler(InjectRootNodeUsecase(ctx))
}
