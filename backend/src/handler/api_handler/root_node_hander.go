package api_handler

import (
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

func (h *RootNodeHandler) GetRootNode(c echo.Context) error {
	input, err := bindGetRootNodeInput(c)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	err = input.Validate()
	if err != nil {
		log.Printf("input is invalid.\nerr = %+v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}

	output, err := h.RootNodeUsecase.GetRootNode(input)
	if err != nil {
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
