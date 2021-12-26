package object

// Node is element of mind map.
type Node struct {
	Text           string
	EstimateMinute int64
	Checked        bool
	Children       []Node
}
