package config

import (
	"os"
	"spacealert/models"
)

var prodConfig = models.Key{
	PostGresURL:        os.Getenv("POSTGRES_URL"),
	GoogleClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
	GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
}
