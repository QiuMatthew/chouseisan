// Repository methods related to Event handling.
package repository

import (
	"chouseisan/model"
	"database/sql"
	"fmt"
	"log"

	"github.com/google/uuid"
)

// Define methods for reading data from the database
func (r Repository) GetEventById(uuid string) (model.Event, error) {
	var event model.Event
	row := r.db.QueryRow("SELECT BIN_TO_UUID(event_id), title, detail FROM event WHERE event_id = UUID_TO_BIN(?)", uuid)
	if err := row.Scan(&event.EventId, &event.Title, &event.Detail); err != nil {
		if err == sql.ErrNoRows {
			return event, fmt.Errorf("GetEventById %s: no such event", uuid)
		}
		return event, fmt.Errorf("GetEventById %s: %v", uuid, err)
	}
	return event, nil
}

// CreateEventInDB creates a new event in the database
func (repo Repository) CreateEvent(title, detail string, proposals []string) (string, error) {
	// Start a database transaction
	tx, err := repo.db.Begin()
	if err != nil {
		log.Println("Error starting transaction:", err)
		return "", err
	}

	newUUID := uuid.New()

	// Insert event information into the events table
	_, err = tx.Exec("INSERT INTO event (event_id, title, detail) VALUES (?,?,?);", newUUID[:], title, detail)
	if err != nil {
		// Rollback the transaction in case of an error
		tx.Rollback()
		log.Println("Error inserting event:", err)
		return "", err
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		log.Println("Error committing transaction:", err)
		return "", err
	}

	return newUUID.String(), nil
}
