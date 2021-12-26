package api_handler

import (
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"

	"taskmeister.com/backend/domain/api_io"
	"taskmeister.com/backend/usecase"
)

type RootNodeHandler struct {
	RootNodeUsecase *usecase.RootNodeUsecase
}

func NewRootNodeHandler(rootNodeUsecase *usecase.RootNodeUsecase) *RootNodeHandler {
	return &RootNodeHandler{
		RootNodeUsecase: rootNodeUsecase,
	}
}

// GetRootNode is handler of getting RootNode.
// @Accept html
// @Produce json
// @Param id path string true "RootNode ID"
// @Router /v1/root-nodes/{id} [get]
func (h *RootNodeHandler) GetRootNode(c echo.Context) error {
	input, err := bindGetRootNodeInput(c)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	if err = input.Validate(); err != nil {
		log.Printf("input is invalid.\nerr = %+v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}

	output, err := h.RootNodeUsecase.GetRootNode(input)
	if status.Code(err) == codes.NotFound {
		return c.String(http.StatusNotFound, err.Error())
	} else if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, output)
}

func bindGetRootNodeInput(c echo.Context) (*api_io.GetRootNodeInput, error) {
	var input api_io.GetRootNodeInput
	if err := c.Bind(&input); err != nil {
		log.Printf("binding input failed.\nerr = %+v", err)
		return nil, err
	}

	return &input, nil
}

// CreateRootNode is handler of creating RootNode.
// @Accept json
// @Produce json
// @Param mindMapId body string true "MindMap ID"
// @Param nodeJson body string true "NodeJson"
// @Router /v1/root-nodes [post]
func (h *RootNodeHandler) CreateRootNode(c echo.Context) error {
	input, err := bindCreateRootNodeInput(c)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	if err = input.Validate(); err != nil {
		log.Printf("input is invalid.\nerr = %+v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}

	output, err := h.RootNodeUsecase.CreateRootNode(input)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, output)
}

func bindCreateRootNodeInput(c echo.Context) (*api_io.CreateRootNodeInput, error) {
	var input api_io.CreateRootNodeInput
	if err := c.Bind(&input); err != nil {
		log.Printf("binding input failed.\nerr = %+v", err)
		return nil, err
	}

	return &input, nil
}
