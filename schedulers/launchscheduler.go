package schedulers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"spacealert/models"
	"spacealert/utils"
	"strings"
	"time"
)

func CheckLaunches(db *sql.DB) {
	ticker := time.NewTicker(time.Minute)

	for range ticker.C {
		query := `SELECT users, launch_id, statuses.id, statuses.name, statuses.abbrev, statuses.description
		FROM subscriptions
		INNER JOIN statuses ON subscriptions.status_id = statuses.id`

		// Execute the query
		rows, err := db.Query(query)
		if err != nil {
			log.Println(err)
			continue
		}

		// Iterate over the rows
		for rows.Next() {
			var users string
			var launchID string
			var statusID int
			var statusName string
			var statusAbbrev string
			var statusDesc string

			// Scan the values from the row into variables
			err := rows.Scan(&users, &launchID, &statusID, &statusName, &statusAbbrev, &statusDesc)
			if err != nil {
				log.Println(err)
				continue
			}

			// Create a new Subscription instance
			subscription := models.Subscription{
				Users:    strings.Split(strings.Trim(users, "{} "), ","), // Assuming "users" is a JSON or string array column
				LaunchID: launchID,
				Status: models.Status{
					ID:          statusID,
					Name:        statusName,
					Abbrev:      statusAbbrev,
					Description: statusDesc,
				},
			}

			// Prepare the SQL query
			query := fmt.Sprintf(`
			SELECT launch FROM api_data, 
			jsonb_array_elements(api_data.launches) AS launch
			WHERE (launch->>'id') = '%s';
			`, subscription.LaunchID)

			// Execute the query
			row := db.QueryRow(query)

			// Scan the result into a string
			var jsonResult string
			err = row.Scan(&jsonResult)
			if err != nil {
				log.Println(err)
				continue
			}

			// Unmarshal the JSON result into a map[string]interface{}
			var result map[string]interface{}
			err = json.Unmarshal([]byte(jsonResult), &result)
			if err != nil {
				log.Println(err)
				continue
			}
			resultStatus := result["status"].(map[string]interface{})
			if resultStatus["name"].(string) != subscription.Status.Name {
				var existingStatusID int
				err = db.QueryRow("SELECT id FROM statuses WHERE id = $1", int(resultStatus["id"].(float64))).Scan(&existingStatusID)
				if err != nil {
					if err != sql.ErrNoRows {
						log.Println(err)
						continue
					}

					// Status does not exist, insert a new record into the statuses table
					_, err = db.Exec("INSERT INTO statuses (id, name, abbrev, description) VALUES ($1, $2, $3, $4)",
						int(resultStatus["id"].(float64)), resultStatus["name"].(string), resultStatus["abbrev"].(string), resultStatus["description"].(string))
					if err != nil {
						log.Println(err)
						continue
					}
				}

				_, err = db.Exec("UPDATE subscriptions SET status_id = $1 WHERE launch_id = $2",
					existingStatusID, subscription.LaunchID)
				if err != nil {
					log.Println(err)
					continue
				}

				email := &models.Email{
					From: "spacealert@pathikpatel.me",
					Recipients: subscription.Users,
					Subject: "Test Email",
					HTML: `<p>This is an example</p>`,
				}
				utils.SendEmail(email)
			}
		}
		rows.Close()
	}

	ticker.Stop()
}
