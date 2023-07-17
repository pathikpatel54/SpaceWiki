package utils

import (
	"fmt"
	"spacealert/config"
	"spacealert/models"

	"github.com/SparkPost/gosparkpost"
)

func SendEmail(email *models.Email) error {
	cfg := &gosparkpost.Config{
		BaseUrl:    "https://api.sparkpost.com",
		ApiKey:     config.Keys.SparkPostKey,
		ApiVersion: 1,
	}

	client := &gosparkpost.Client{}
	err := client.Init(cfg)
	if err != nil {
		return err
	}

	// Create a new transmission
	transmission := &gosparkpost.Transmission{
		Recipients: email.Recipients,
		Content: gosparkpost.Content{
			HTML:    email.HTML,
			From:    email.From,
			Subject: email.Subject,
		},
	}

	// Send the email
	_, res, err := client.Send(transmission)
	if err != nil {
		return err
	}

	// Check the response status
	if res.HTTP.StatusCode >= 200 && res.HTTP.StatusCode < 300 {
		fmt.Println("Email sent successfully!")
	} else {
		return fmt.Errorf("failed to send email. Status: %d", res.HTTP.StatusCode)
	}

	return nil
}
