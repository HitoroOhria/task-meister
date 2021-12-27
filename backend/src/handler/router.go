package handler

import (
	"context"

	"github.com/labstack/echo/v4"

	"taskmeister.com/backend/injector"
)

func RouteV1Api(e *echo.Echo) {
	ctx := context.Background()
	g := e.Group("/v1")

	healthCheckHandler := injector.InjectHealthCheckHandler()
	g.GET("/health-check", healthCheckHandler.Ok)

	rootNodeHandler := injector.InjectRootNodeHandler(ctx)
	g.GET("/root-nodes/:id", rootNodeHandler.GetRootNode)
	g.POST("/root-nodes", rootNodeHandler.CreateRootNode)
	g.DELETE("/root-nodes/:id", rootNodeHandler.DeleteRootNode)
}
