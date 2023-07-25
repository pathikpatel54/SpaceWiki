package routes

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"spacealert/models"
	"strings"

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

func (sc *SpaceController) GetPreviousLaunches(c *gin.Context) {
	sc.getData(c, "previous_launches")
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
	country := c.Query("country")

	if keyword != "" {
		switch columnName {
		case "launches":
			query = `SELECT jsonb_agg(elem)
	                  FROM api_data,
	                       jsonb_array_elements(api_data.launches) AS elem
	                  WHERE lower(elem->>'name') LIKE lower($1) 
					  OR lower(elem->'launch_service_provider'->>'name') LIKE lower($1)
					  OR lower(elem->'launch_service_provider'->>'abbrev') LIKE lower($1)`
		case "previous_launches":
			query = `SELECT jsonb_agg(elem)
						FROM api_data,
							jsonb_array_elements(api_data.previous_launches) AS elem
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
	                  WHERE lower(elem->>'name') LIKE lower($1) OR lower(elem->'spacestation'->>'name') LIKE lower($1)`
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
	                       jsonb_array_elements(api_data.spacecraft) AS elem
						   WHERE lower(elem->>'name') LIKE lower($1)
	                         OR lower(elem->'spacecraft_config'->'agency'->>'name') LIKE lower($1)
	                         OR lower(elem->'spacecraft_config'->'agency'->>'abbrev') LIKE lower($1)`
		case "pads":
			query = `SELECT jsonb_agg(elem)
	                  FROM api_data,
	                       jsonb_array_elements(api_data.pads) AS elem
						WHERE lower(elem->>'name') LIKE lower($1)
								OR lower(elem->>'country_code') LIKE lower($1)
								OR lower(elem->'location'->>'name') LIKE lower($1)`
		default:
			query = "SELECT " + columnName + " FROM api_data WHERE id = 1"
		}

		rows, err = sc.db.Query(query, "%"+keyword+"%")
	} else if country != "" {
		switch columnName {
		case "agencies":
			query = `SELECT jsonb_agg(elem)
					FROM api_data,
						jsonb_array_elements(api_data.agencies) AS elem
					WHERE lower(elem->>'country_code') LIKE lower($1)`
		default:
			query = "SELECT " + columnName + " FROM api_data WHERE id = 1"
		}
		rows, err = sc.db.Query(query, "%"+country+"%")
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

func (c *SpaceController) CreateSubscription(ctx *gin.Context) {
	var request models.Subscription
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if subscription with the same Launch ID exists
	var subscriptionID int
	var usersStr string
	err := c.db.QueryRowContext(c.ctx, "SELECT id, users FROM subscriptions WHERE launch_id = $1", request.LaunchID).Scan(&subscriptionID, &usersStr)
	if err != nil && err != sql.ErrNoRows {
		log.Println("Error checking existing subscription:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing subscription"})
		return
	}

	// If subscription exists, check if user already exists in the users array
	if err == nil {
		exists := false
		users := strings.Split(usersStr[1:len(usersStr)-1], ",") // Convert string to []string
		for _, user := range users {
			if user == request.Users[0] {
				exists = true
				break
			}
		}

		if exists {
			ctx.JSON(http.StatusOK, gin.H{"message": "User already exists in the subscription"})
			return
		}

		_, err := c.db.ExecContext(c.ctx, "UPDATE subscriptions SET users = array_append(users, $1) WHERE id = $2", request.Users[0], subscriptionID)
		if err != nil {
			log.Println("Error updating existing subscription:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update existing subscription"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "User added to existing subscription"})
		return
	}

	// Check if status exists
	var statusID int
	err = c.db.QueryRowContext(c.ctx, "SELECT id FROM statuses WHERE name = $1", request.Status.Name).Scan(&statusID)
	if err != nil {
		if err != sql.ErrNoRows {
			log.Println("Error checking existing status:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing status"})
			return
		}

		// Create new status
		_, err = c.db.ExecContext(c.ctx, "INSERT INTO statuses (id, name, abbrev, description) VALUES ($1, $2, $3, $4)",
			request.Status.ID, request.Status.Name, request.Status.Abbrev, request.Status.Description)
		if err != nil {
			log.Println("Error creating new status:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new status"})
			return
		}

		// Get the newly created status ID
		err = c.db.QueryRowContext(c.ctx, "SELECT id FROM statuses WHERE name = $1", request.Status.Name).Scan(&statusID)
		if err != nil {
			log.Println("Error retrieving newly created status ID:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve newly created status ID"})
			return
		}
	}

	// Convert []string to PostgreSQL array representation
	usersArray := "{" + strings.Join(request.Users, ",") + "}"

	// Create new subscription
	_, err = c.db.ExecContext(c.ctx, "INSERT INTO subscriptions (users, launch_id, status_id) VALUES ($1, $2, $3)",
		usersArray, request.LaunchID, statusID)
	if err != nil {
		log.Println("Error creating new subscription:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new subscription"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "New subscription created"})
}

func (c *SpaceController) Unsubscribe(ctx *gin.Context) {
	launchID := ctx.Param("id")

	// Check if the user is logged in
	if ok, email := isLoggedIn(ctx, c.db); !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	} else {
		// Check if the user is the last one in the subscription
		var userCount int
		err := c.db.QueryRowContext(c.ctx, "SELECT array_length(users, 1) FROM subscriptions WHERE launch_id = $1", launchID).Scan(&userCount)
		if err != nil {
			log.Println("Error checking user count in subscription:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unsubscribe"})
			return
		}

		if userCount == 1 {
			// If the user is the last one, delete the entire row
			_, err = c.db.ExecContext(c.ctx, "DELETE FROM subscriptions WHERE launch_id = $1", launchID)
			if err != nil {
				log.Println("Error unsubscribing:", err)
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unsubscribe"})
				return
			}
		} else {
			// If the user is not the last one, remove the user from the subscription
			_, err = c.db.ExecContext(c.ctx, "UPDATE subscriptions SET users = array_remove(users, $1) WHERE launch_id = $2", email.Email, launchID)
			if err != nil {
				log.Println("Error removing user from subscription:", err)
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unsubscribe"})
				return
			}
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Unsubscribed successfully"})
	}
}

func (c *SpaceController) GetLaunchID(ctx *gin.Context) {
	if logged, _ := isLoggedIn(ctx, c.db); !logged {
		ctx.String(http.StatusUnauthorized, "")
		return
	}

	launchID, ok := ctx.Params.Get("id")

	if !ok {
		ctx.String(http.StatusBadRequest, "")
		return
	}

	query := fmt.Sprintf(`
	SELECT launch FROM api_data, 
	jsonb_array_elements(api_data.launches) AS launch
	WHERE (launch->>'id') = '%s';`, launchID)

	// Execute the query
	row := c.db.QueryRow(query)

	// Scan the result into a string
	var jsonResult json.RawMessage
	if err := row.Scan(&jsonResult); err != nil {
		log.Printf("Failed to scan row: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	ctx.JSON(http.StatusOK, jsonResult)
}
