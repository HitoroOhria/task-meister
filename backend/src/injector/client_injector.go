package injector

import (
	"context"

	"taskmeister.com/backend/infrastructure/client"
)

func InjectFirestoreClient(ctx context.Context) *client.FirestoreClient {
	return client.NewFirestoreClient(ctx)
}
