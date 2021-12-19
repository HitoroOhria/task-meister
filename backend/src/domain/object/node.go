package object

type Node struct {
	Text           string
	EstimateMinute int64
	Checked        bool
	Children       []Node
}
