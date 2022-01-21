package repository_impl

import (
	"context"
	"github.com/google/go-cmp/cmp"
	"testing"

	"taskmeister.com/backend/domain/entity"
	"taskmeister.com/backend/infrastructure/client"
)

func TestRootNodeRepository_GetById(t *testing.T) {
	ctx := context.Background()
	repository := &RootNodeRepositoryImpl{
		ctx:        ctx,
		collection: client.NewFirestoreClient(ctx).Client.Collection(collectionName),
	}

	type args struct {
		id string
	}
	tests := []struct {
		name    string
		args    args
		want    *entity.RootNode
		wantErr bool
	}{
		{
			name: "DBにIDのデータが存在するとき、データを返すこと",
			args: args{
				id: "reOZXVnx5qWIeFSHdPWh",
			},
			want: &entity.RootNode{
				Id:        "reOZXVnx5qWIeFSHdPWh",
				MindMapId: "2",
				NodesJson: "bar",
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := repository.GetById(tt.args.id)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetById() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if diff := cmp.Diff(got, tt.want); diff != "" {
				t.Errorf(diff)
			}
		})
	}
}
