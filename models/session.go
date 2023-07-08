package models

import "time"

type Session struct {
	ID        int       `json:"id"`
	SessionID string    `json:"session_id"`
	Email     string    `json:"email"`
	Expires   time.Time `json:"expires"`
}
