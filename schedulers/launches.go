package schedulers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"spacealert/models"
)

func CheckLaunches(db *sql.DB) error {

	query := `
		SELECT users, launch_id, statuses.id, statuses.name, statuses.abbrev, statuses.description
		FROM subscriptions
		INNER JOIN statuses ON subscriptions.status_id = statuses.id
	`

	// Execute the query
	rows, err := db.Query(query)
	if err != nil {
		return err
	}
	defer rows.Close()

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
			return err
		}

		// Create a new Subscription instance
		subscription := models.Subscription{
			Users:    []string{users}, // Assuming "users" is a JSON or string array column
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
			log.Fatal(err)
		}

		// Unmarshal the JSON result into a map[string]interface{}
		var result map[string]interface{}
		err = json.Unmarshal([]byte(jsonResult), &result)
		if err != nil {
			log.Fatal(err)
		}

		if result["status"].(map[string]interface{})["name"] == subscription.Status.Name {
			log.Println("Hey Bro")
		}
	}
	return nil
}
