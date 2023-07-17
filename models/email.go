package models

type Email struct {
	Recipients []string
	From       string
	Subject    string
	HTML       string
}
