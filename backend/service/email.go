package service

import (
	"fmt"
	"net/smtp"
	"os"
)

func SendEmail(userName, email, eventID, title string) error {
	from := "chousei208@gmail.com"
	password := os.Getenv("CHOUSEISAN_EMAIL_PASSWORD")

	// Set up authentication information.
	auth := smtp.PlainAuth("", from, password, "smtp.gmail.com")

	body := fmt.Sprintf("Dear %s, \n The poll for your event %s has ended.\n You can check the result here:\n http://localhost:3000/scheduler/view_event/%s", userName, title, eventID)

	// Compose the message
	msg := []byte("To: " + email + "\r\n" +
		"Subject: Event Poll Ended!" + "\r\n" +
		"\r\n" +
		body + "\r\n")

	// Send the email
	err := smtp.SendMail("smtp.gmail.com:587", auth, from, []string{email}, msg)
	return err
}
