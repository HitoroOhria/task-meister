package api_handler

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

type HealthCheckHandler struct {
}

func NewHealthCheckHandler() *HealthCheckHandler {
	return &HealthCheckHandler{}
}

func (h *HealthCheckHandler) Ok(c echo.Context) error {
	return c.String(http.StatusOK, "ok")
}
