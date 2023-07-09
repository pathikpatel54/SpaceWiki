package databases

import (
	"database/sql"
	"log"
	"spacealert/config"

	_ "github.com/lib/pq" // import the postgres driver
)

func ConnectDatabase() (*sql.DB, error) {
	db, err := sql.Open("postgres", config.Keys.PostGresURL)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	ensureTablesExist(db)

	return db, nil
}

func ensureTablesExist(db *sql.DB) {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		google_id VARCHAR(255) UNIQUE,
		email VARCHAR(255) UNIQUE,
		verified_email BOOLEAN,
		name VARCHAR(255),
		given_name VARCHAR(255),
		family_name VARCHAR(255),
		picture VARCHAR(255),
		locale VARCHAR(255)
	);`)

	if err != nil {
		log.Fatalf("Could not create users table: %v", err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS sessions (
		id SERIAL PRIMARY KEY,
		session_id VARCHAR(255),
		email VARCHAR(255),
		expires TIMESTAMP
	);`)

	if err != nil {
		log.Fatalf("Could not create sessions table: %v", err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS api_data (
		id SERIAL PRIMARY KEY,
		launches JSONB,
		events JSONB,
		agencies JSONB,
		astronauts JSONB,
		space_stations JSONB,
		expeditions JSONB,
		docking_event JSONB,
		launch_vehicles JSONB,
		spacecraft JSONB,
		locations JSONB,
		pads JSONB
	);`)

	if err != nil {
		log.Fatalf("Could not create api_data table: %v", err)
	}
}
