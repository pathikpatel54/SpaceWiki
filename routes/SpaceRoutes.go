package routes

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SpaceController struct {
	db  *sql.DB
	ctx context.Context
}

func NewSpaceController(db *sql.DB) *SpaceController {
	return &SpaceController{
		db,
		context.TODO(),
	}
}

func (sc *SpaceController) GetUpcomingLaunches(c *gin.Context) {
	sc.getData(c, "launches")
}

func (sc *SpaceController) GetEvents(c *gin.Context) {
	sc.getData(c, "events")
}

func (sc *SpaceController) GetAgencies(c *gin.Context) {
	sc.getData(c, "agencies")
}

func (sc *SpaceController) GetAstronauts(c *gin.Context) {
	sc.getData(c, "astronauts")
}

func (sc *SpaceController) GetSpaceStations(c *gin.Context) {
	sc.getData(c, "space_stations")
}

func (sc *SpaceController) GetExpeditions(c *gin.Context) {
	sc.getData(c, "expeditions")
}

func (sc *SpaceController) GetDockingEvent(c *gin.Context) {
	sc.getData(c, "docking_event")
}

func (sc *SpaceController) GetLaunchVehicles(c *gin.Context) {
	sc.getData(c, "launch_vehicles")
}

func (sc *SpaceController) GetSpacecraft(c *gin.Context) {
	sc.getData(c, "spacecraft")
}

func (sc *SpaceController) GetLocations(c *gin.Context) {
	sc.getData(c, "locations")
}

func (sc *SpaceController) GetPads(c *gin.Context) {
	sc.getData(c, "pads")
}

func (sc *SpaceController) getData(c *gin.Context, columnName string) {
	if ok, _ := isLoggedIn(c, sc.db); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var jsonData []byte

	err := sc.db.QueryRowContext(sc.ctx, "SELECT "+columnName+" FROM api_data WHERE id = 1").Scan(&jsonData)
	if err != nil {
		log.Printf("Failed to fetch data: %v", err)
		c.JSON(500, gin.H{"error": "Failed to fetch data"})
		return
	}

	var data interface{}
	err = json.Unmarshal(jsonData, &data)
	if err != nil {
		log.Printf("Failed to unmarshal JSON: %v", err)
		c.JSON(500, gin.H{"error": "Failed to unmarshal JSON"})
		return
	}

	c.JSON(200, data)
}
