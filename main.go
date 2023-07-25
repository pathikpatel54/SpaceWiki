package main

import (
	"log"
	"spacealert/databases"
	"spacealert/routes"
	"spacealert/schedulers"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.New()
	db, err := databases.ConnectDatabase()

	if err != nil {
		log.Panicln("Database Connection error", err)
	}

	go schedulers.LaunchDataFetcher(db)
	go schedulers.CheckLaunches(db)

	ac := routes.NewAuthController(db)
	sc := routes.NewSpaceController(db)

	// Google OAuth
	router.GET("/auth/google", ac.Login)
	router.GET("/auth/google/callback", ac.Callback)
	router.GET("/api/user", ac.User)
	router.GET("/api/logout", ac.Logout)

	router.GET("/api/launches", sc.GetUpcomingLaunches)
	router.GET("/api/launches/:id", sc.GetLaunchID)
	router.GET("/api/events", sc.GetEvents)
	router.GET("/api/agencies", sc.GetAgencies)
	router.GET("/api/astronauts", sc.GetAstronauts)
	router.GET("/api/space_stations", sc.GetSpaceStations)
	router.GET("/api/expeditions", sc.GetExpeditions)
	router.GET("/api/dockings", sc.GetDockingEvent)
	router.GET("/api/launch_vehicles", sc.GetLaunchVehicles)
	router.GET("/api/spacecraft", sc.GetSpacecraft)
	router.GET("/api/locations", sc.GetLocations)
	router.GET("/api/pads", sc.GetPads)
	router.POST("/api/subscriptions", sc.CreateSubscription)
	router.DELETE("/api/subscriptions/:id", sc.Unsubscribe)

	router.Run()
}
