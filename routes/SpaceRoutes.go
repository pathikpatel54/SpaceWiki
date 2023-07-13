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

	var query string
	var rows *sql.Rows
	var err error

	keyword := c.Query("keyword")
	if keyword != "" {
		switch columnName {
		case "launches":
			query = `SELECT jsonb_agg(elem)
	                  FROM api_data,
	                       jsonb_array_elements(api_data.launches) AS elem
	                  WHERE lower(elem->>'name') LIKE lower($1) 
					  OR lower(elem->'launch_service_provider'->>'name') LIKE lower($1)
					  OR lower(elem->'launch_service_provider'->>'abbrev') LIKE lower($1)`
		case "events":
			query = `SELECT jsonb_agg(elem)
	                  FROM api_data,
	                       jsonb_array_elements(api_data.events) AS elem
	                  WHERE lower(elem->>'name') LIKE lower($1) OR lower(elem->>'location') LIKE lower($1)`
		case "agencies":
			query = `SELECT jsonb_agg(elem)
					FROM api_data,
						jsonb_array_elements(api_data.agencies) AS elem
					WHERE lower(elem->>'abbrev') LIKE lower($1) OR lower(elem->>'name') LIKE lower($1)
						OR lower(elem->>'country_code') LIKE lower($1)`
		case "astronauts":
			query = `SELECT jsonb_agg(elem)
	                  FROM api_data,
	                       jsonb_array_elements(api_data.astronauts) AS elem
	                  WHERE lower(elem->>'name') LIKE lower($1) OR lower(elem->>'nationality') LIKE lower($1)`
		case "space_stations":
			query = `SELECT jsonb_agg(elem)
	                  FROM api_data,
	                       jsonb_array_elements(api_data.space_stations) AS elem
	                  WHERE lower(elem->>'name') LIKE lower($1)`
		case "expeditions":
			query = `SELECT jsonb_agg(elem)
	                  FROM api_data,
	                       jsonb_array_elements(api_data.expeditions) AS elem
	                  WHERE lower(elem->>'name') LIKE lower($1)`
		case "launch_vehicles":
			query = `SELECT jsonb_agg(elem)
					FROM api_data,
						jsonb_array_elements(api_data.launch_vehicles) AS elem
					WHERE lower(elem->>'name') LIKE lower($1)
						OR lower(elem->'manufacturer'->>'name') LIKE lower($1)
						OR lower(elem->'manufacturer'->>'abbrev') LIKE lower($1)`
		case "spacecraft":
			query = `SELECT jsonb_agg(elem)
	                  FROM api_data,
	                       jsonb_array_elements(api_data.spacecraft) AS elem,
	                       jsonb_array_elements_text(elem->'spacecraft_config') AS spacecraft_config
	                  WHERE lower(elem->>'name') LIKE lower($1)
	                         OR lower(spacecraft_config->'agency'->>'name') LIKE lower($1)
	                         OR lower(spacecraft_config->'agency'->>'abbrev') LIKE lower($1)`
		case "pads":
			query = `SELECT jsonb_agg(elem)
	                  FROM api_data,
	                       jsonb_array_elements(api_data.pads) AS elem,
	                       jsonb_array_elements_text(elem->'location') AS location
	                  WHERE lower(elem->>'name') LIKE lower($1)
	                         OR lower(elem->>'country_code') LIKE lower($1)
	                         OR lower(location->>'name') LIKE lower($1)`
		default:
			query = "SELECT " + columnName + " FROM api_data WHERE id = 1"
		}

		rows, err = sc.db.Query(query, "%"+keyword+"%")
	} else {
		query = "SELECT " + columnName + " FROM api_data WHERE id = 1"
		rows, err = sc.db.Query(query)
	}

	if err != nil {
		log.Printf("Failed to fetch data: %v", err)
		c.JSON(500, gin.H{"error": "Failed to fetch data"})
		return
	}
	defer rows.Close()

	var result json.RawMessage
	if rows.Next() {
		if err := rows.Scan(&result); err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(500, gin.H{"error": "Failed to fetch data"})
			return
		}
	}

	c.JSON(200, result)
}
