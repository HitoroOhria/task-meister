package client

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
)

const gcpProjectIdEnv = "GCP_PROJECT_ID"

type FirestoreClient struct {
	Client *firestore.Client
}

func NewFirestoreClient(ctx context.Context) *FirestoreClient {
	client, err := firestore.NewClient(ctx, os.Getenv(gcpProjectIdEnv))
	if err != nil {
		log.Fatalf("firestore.NewClient() fialed.\n err = %+v", err)
		return nil
	}

	return &FirestoreClient{
		Client: client,
	}
}
