package models

type Key struct {
	PostGresURL        string `json:"POSTGRES_URL"`
	GoogleClientID     string `json:"GOOGLE_CLIENT_ID"`
	GoogleClientSecret string `json:"GOOGLE_CLIENT_SECRET"`
}
