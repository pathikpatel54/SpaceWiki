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

	router.GET("/launches", sc.GetUpcomingLaunches)
	router.GET("/events", sc.GetEvents)
	router.GET("/agencies", sc.GetAgencies)
	router.GET("/astronauts", sc.GetAstronauts)
	router.GET("/space_stations", sc.GetSpaceStations)
	router.GET("/expeditions", sc.GetExpeditions)
	router.GET("/dockings", sc.GetDockingEvent)
	router.GET("/launch_vehicles", sc.GetLaunchVehicles)
	router.GET("/spacecraft", sc.GetSpacecraft)
	router.GET("/locations", sc.GetLocations)
	router.GET("/pads", sc.GetPads)
	router.POST("/subscriptions", sc.CreateSubscription)
	router.DELETE("/subscriptions/:id", sc.Unsubscribe)

	router.Run()
}
