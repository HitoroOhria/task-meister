package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

const port = ":8000"

type Product struct {
	gorm.Model
	Code  string
	Price uint
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
	mySql, err := generateGormClient()
	if err != nil {
		fmt.Printf("err = %+v\n", err)
		return err
	}

	err = mySql.AutoMigrate(&Product{})
	if err != nil {
		fmt.Printf("err = %+v\n", err)
		return err
	}
	mySql.Create(&Product{Code: "D42", Price: 100})

	return c.String(http.StatusOK, "Hello, World!")
}

// See https://gorm.io/docs/connecting_to_the_database.html
func generateGormClient() (*gorm.DB, error) {
	return gorm.Open(mysql.New(mysql.Config{
		// Host is container name then local development.
		// "user:pasword@rcp(host:port)/table"
		DSN: "docker:docker@tcp(tm-db:3306)/main?charset=utf8&parseTime=True&loc=Asia%2FTokyo",
	}), &gorm.Config{})
}
