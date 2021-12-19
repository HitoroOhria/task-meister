package main

import (
	"context"
	"encoding/json"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"net/http"
	"os"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const (
	location        = "Asia/Tokyo"
	port            = ":8000"
	gcpProjectIdEnv = "GCP_PROJECT_ID"
)

func init() {
	log.Print("Run: main.init()")

	initTimeLocation()
	initLog()
}

// initTimeLocation は、time パッケージの TimeZone を JST で初期化します。
func initTimeLocation() {
	loc, err := time.LoadLocation(location)
	if err != nil {
		log.Printf("time.LoadLocation fialed.(err=%+v)", err)
		loc = time.FixedZone(location, 9*60*60)
	}

	time.Local = loc
}

// initLog は、log パッケージの設定を行います。
func initLog() {
	log.SetFlags(log.LstdFlags | log.Llongfile)
}

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", hello)

	// Start server
	e.Logger.Fatal(e.Start(port))
}

// Handler
func hello(c echo.Context) error {
	ctx := context.Background()
	firestoreHandler := NewFirestoreHandler(ctx)
	rootNodeRepo := NewRootNodeRepository(ctx, firestoreHandler)

	nodes := []Node{
		{
			Text:           "text",
			EstimateMinute: 15,
			Checked:        false,
			Children:       nil,
		},
	}
	rootNode := &RootNode{
		MindMapId: "mind_map_id3",
	}
	rootNode.SetNodesJsonFromNodes(nodes)

	//err := rootNodeRepo.Add(rootNode)
	//if err != nil {
	//	log.Printf("err = %+v", err)
	//}

	rootNode, err := rootNodeRepo.GetById("dhCmqpUSfJKa92oTwcAS")
	if err != nil {
		log.Fatalf("err = %+v\n", err)
	}
	nodes = rootNode.GetNodesFromNodesJson()

	log.Printf("rootNode = %+v\n", rootNode)
	log.Printf("nodes = %+v\n", nodes)

	return c.String(http.StatusOK, "Hello, World!")
}

type FirestoreHandler struct {
	Client *firestore.Client
}

func NewFirestoreHandler(ctx context.Context) *FirestoreHandler {
	client, err := firestore.NewClient(ctx, os.Getenv(gcpProjectIdEnv))
	if err != nil {
		log.Fatalf("err = %+v", err)
	}

	return &FirestoreHandler{
		Client: client,
	}
}

type RootNode struct {
	Id        string `firestore:"-"`
	MindMapId string `firestore:"mind_map_id"`
	NodesJson string `firestore:"nodesJson"`
}

func (r *RootNode) GetNodesFromNodesJson() []Node {
	if r.NodesJson == "" {
		return nil
	}

	var nodes []Node
	if err := json.Unmarshal([]byte(r.NodesJson), &nodes); err != nil {
		log.Fatalf("json.Unmarshal faliled.\nerr = %+v", err)
		return nil
	}

	return nodes
}

func (r *RootNode) SetNodesJsonFromNodes(nodes []Node) {
	if nodes == nil {
		r.NodesJson = ""
		return
	}

	bytes, err := json.Marshal(nodes)
	if err != nil {
		log.Fatalf("json.Marshal failed.\nerr = %+v", err)
	}

	r.NodesJson = string(bytes)
}

type Node struct {
	Text           string
	EstimateMinute int64
	Checked        bool
	Children       []Node
}

type RootNodeRepository struct {
	ctx        context.Context
	collection *firestore.CollectionRef
}

func NewRootNodeRepository(ctx context.Context, handler *FirestoreHandler) *RootNodeRepository {
	return &RootNodeRepository{
		ctx:        ctx,
		collection: handler.Client.Collection("RootNodes"),
	}
}

func (r *RootNodeRepository) Add(rootNode *RootNode) error {
	doc, _, err := r.collection.Add(r.ctx, &rootNode)
	if err != nil {
		log.Printf("err = %+v\n", err)
		return err
	}
	rootNode.Id = doc.ID

	return nil
}

func (r *RootNodeRepository) GetById(id string) (*RootNode, error) {
	dataSnap, err := r.collection.Doc(id).Get(r.ctx)
	if status.Code(err) == codes.NotFound {
		log.Printf("not found RootNode Doc. Id is %+v\nerr = %+v", id, err)
		return nil, err
	} else if err != nil {
		log.Printf("getting RootNode Doc failed.\nerr = %+v", err)
	}

	var rootNode RootNode
	if err = dataSnap.DataTo(&rootNode); err != nil {
		log.Printf("can not convert RootNode Doc.\nerr=%+v", err)
		return nil, err
	}
	rootNode.Id = id

	return &rootNode, nil
}
