package schedulers

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"
)

func updateAPIData(db *sql.DB, apiURL string, columnName string) {
	resp, err := http.Get(apiURL)
	if err != nil {
		log.Printf("Failed to fetch from API: %v", err)
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Failed to read response body: %v", err)
		return
	}
	resp.Body.Close()

	// Check if the body is a valid JSON
	if !json.Valid(body) {
		log.Printf("Invalid JSON received from API")
		return
	}

	_, err = db.Exec("INSERT INTO api_data(id, "+columnName+") VALUES(1, $1) ON CONFLICT (id) DO NOTHING", string(body))
	if err != nil {
		log.Printf("Failed to insert into database: %v", err)
		return
	}

	_, err = db.Exec("UPDATE api_data SET "+columnName+" = $1 WHERE id = 1", string(body))
	if err != nil {
		log.Printf("Failed to update database: %v", err)
		return
	}

	log.Printf("Inserted/updated data into %s successfully", columnName)
}

func LaunchDataFetcher(db *sql.DB) {
	tickers := make(map[string]*time.Ticker)
	apiMap := map[string]string{
		"launches":        "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?format=json&limit=100&mode=detailed",
		"events":          "https://ll.thespacedevs.com/2.2.0/event/upcoming/?format=json&limit=100&mode=detailed",
		"agencies":        "https://ll.thespacedevs.com/2.2.0/agencies/?format=json&limit=100&mode=detailed",
		"astronauts":      "https://ll.thespacedevs.com/2.2.0/astronaut/?format=json&limit=100&mode=detailed",
		"space_stations":  "https://ll.thespacedevs.com/2.2.0/spacestation/?format=json&limit=100&mode=detailed",
		"expeditions":     "https://ll.thespacedevs.com/2.2.0/expedition/?format=json&limit=100&mode=detailed",
		"docking_event":   "https://ll.thespacedevs.com/2.2.0/docking_event/?format=json&limit=100&mode=detailed",
		"launch_vehicles": "https://ll.thespacedevs.com/2.2.0/launcher/?format=json&limit=100&mode=detailed",
		"spacecraft":      "https://ll.thespacedevs.com/2.2.0/spacecraft/?format=json&limit=100&mode=detailed",
		"locations":       "https://ll.thespacedevs.com/2.2.0/location/?format=json&limit=100&mode=detailed",
		"pads":            "https://ll.thespacedevs.com/2.2.0/pad/?format=json&limit=100&mode=detailed",
	}

	for column := range apiMap {
		tickers[column] = time.NewTicker(60 * time.Minute) // Adjust ticker frequency based on rate limit
	}

	for {
		for column, url := range apiMap {
			select {
			case <-tickers[column].C:
				updateAPIData(db, url, column) // Now uses actual API URL for each column
			default:
			}
		}
		time.Sleep(10 * time.Second) // Wait a bit before next iteration
	}
}
