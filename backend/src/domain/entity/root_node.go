package entity

import (
	"encoding/json"
	"log"

	"taskmeister.com/backend/domain/object"
)

type RootNode struct {
	Id        string `firestore:"-"`
	MindMapId string `firestore:"mind_map_id"`
	NodesJson string `firestore:"nodesJson"`
}

func (r *RootNode) GetNodesFromNodesJson() ([]object.Node, error) {
	if r.NodesJson == "" {
		return nil, nil
	}

	var nodes []object.Node
	if err := json.Unmarshal([]byte(r.NodesJson), &nodes); err != nil {
		log.Printf("json.Unmarshal() faliled. RootNoode.NodesJson is invalid.\nerr = %+v", err)
		return nil, err
	}

	return nodes, nil
}

func (r *RootNode) SetNodesJsonFromNodes(nodes []object.Node) error {
	if nodes == nil {
		r.NodesJson = ""
		return nil
	}

	bytes, err := json.Marshal(nodes)
	if err != nil {
		log.Printf("json.Marshal failed. nodes is invalid.\nerr = %+v", err)
		return err
	}

	r.NodesJson = string(bytes)

	return nil
}
