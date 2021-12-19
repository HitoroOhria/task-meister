package main

import (
	"log"
	"taskmeister.com/backend/handler"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const (
	location = "Asia/Tokyo"
	port     = ":8000"
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
	handler.RouteV1Api(e)

	// Start server
	e.Logger.Fatal(e.Start(port))
}
