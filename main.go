package main

import (
	"log"
	"spacealert/databases"
	"spacealert/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.New()
	db, err := databases.ConnectDatabase()

	if err != nil {
		log.Panicln("Database Connection error", err)
	}
	ac := routes.NewAuthController(db)

	// Google OAuth
	router.GET("/auth/google", ac.Login)
	router.GET("/auth/google/callback", ac.Callback)
	router.GET("/api/user", ac.User)
	router.GET("/api/logout", ac.Logout)
	
	router.Run()
}
