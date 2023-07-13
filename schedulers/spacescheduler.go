package schedulers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

func updateAPIData(db *sql.DB, apiURL string, columnName string) {
	var results []interface{}

	for {
		data, err := fetchData(apiURL)
		if err != nil {
			log.Printf("Failed to fetch data from API: %v", err)
			return
		}

		if res, ok := data["results"].([]interface{}); ok {
			results = append(results, res...)
		} else {
			log.Printf("No results in response: %v", err)
			return
		}

		if nextURL, ok := data["next"].(string); ok && nextURL != "" {
			apiURL = nextURL
		} else {
			break
		}
	}

	newBody, err := json.Marshal(results)
	if err != nil {
		log.Printf("Failed to re-marshal updated JSON: %v", err)
		return
	}

	_, err = db.Exec("INSERT INTO api_data(id, "+columnName+") VALUES(1, $1) ON CONFLICT (id) DO NOTHING", string(newBody))
	if err != nil {
		log.Printf("Failed to insert into database: %v", err)
		return
	}

	_, err = db.Exec("UPDATE api_data SET "+columnName+" = $1 WHERE id = 1", string(newBody))
	if err != nil {
		log.Printf("Failed to update database: %v", err)
		return
	}

	log.Printf("Inserted/updated data into %s successfully", columnName)
}

func fetchData(url string) (map[string]interface{}, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Check if the body is a valid JSON
	if !json.Valid(body) {
		return nil, errors.New("invalid JSON received from API")
	}

	// Unmarshal to a map for further checks
	var data map[string]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		return nil, err
	}

	// Check for throttling
	if detail, ok := data["detail"]; ok {
		if strings.Contains(detail.(string), "Request was throttled.") {
			return nil, errors.New("API request was throttled")
		}
	}

	// Check for "results" field
	if _, ok := data["results"]; !ok {
		return nil, errors.New("missing 'results' field in API response")
	}

	return data, nil
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
		"launch_vehicles": "https://ll.thespacedevs.com/2.2.0/config/launcher/?format=json&limit=100&mode=detailed",
		"spacecraft":      "https://ll.thespacedevs.com/2.2.0/spacecraft/?format=json&limit=100&mode=detailed",
		"locations":       "https://ll.thespacedevs.com/2.2.0/location/?format=json&limit=100&mode=detailed",
		"pads":            "https://ll.thespacedevs.com/2.2.0/pad/?format=json&limit=100&mode=detailed",
	}

	for column := range apiMap {
		if column == "launches" || column == "events" {
			tickers[column] = time.NewTicker(60 * time.Minute) // Update every 15 minutes
		} else {
			tickers[column] = time.NewTicker(24 * time.Hour) // Update every 24 hours
		}
	}

	for {
		for column, url := range apiMap {
			select {
			case <-tickers[column].C:
				// Create a new goroutine for each update
				go updateAPIData(db, url, column)
			default:
			}
		}
		time.Sleep(10 * time.Second) // Wait a bit before next iteration
	}
}
