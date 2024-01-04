// Repository methods related to Event handling.
package repository

import (
	"log"

	"github.com/google/uuid"
)

// Define methods for reading data from the database
// func (r Repository) GetEventById(uuid string) (model.Event, error) {
// 	var event model.Event
// 	row := r.db.QueryRow("SELECT BIN_TO_UUID(event_id), title, detail FROM event WHERE event_id = UUID_TO_BIN(?)", uuid)
// 	if err := row.Scan(&event.EventId, &event.Title, &event.Detail); err != nil {
// 		if err == sql.ErrNoRows {
// 			return event, fmt.Errorf("GetEventById %s: no such event", uuid)
// 		}
// 		return event, fmt.Errorf("GetEventById %s: %v", uuid, err)
// 	}

// 	// Retrieve proposals from event_timeslot table
// 	rows, err := r.db.Query("SELECT description FROM event_timeslot WHERE event_id = UUID_TO_BIN(?)", uuid)
// 	if err != nil {
// 		return event, fmt.Errorf("GetEventById %s: %v", uuid, err)
// 	}
// 	defer rows.Close()

// 	// Iterate through rows and append each proposal to the event
// 	for rows.Next() {
// 		var proposal string
// 		if err := rows.Scan(&proposal); err != nil {
// 			return event, fmt.Errorf("GetEventById %s: %v", uuid, err)
// 		}
// 		event.Proposals = append(event.Proposals, proposal)
// 	}

// 	// Check for errors from iterating over rows
// 	if err := rows.Err(); err != nil {
// 		return event, fmt.Errorf("GetEventById %s: %v", uuid, err)
// 	}

// 	return event, nil
// }

// CreateEventInDB creates a new event in the database
// func (repo Repository) CreateEvent(title, detail string, proposals []string) (string, error) {
// 	// Start a database transaction
// 	tx, err := repo.db.Begin()
// 	if err != nil {
// 		log.Println("Error starting transaction:", err)
// 		return "", err
// 	}

// 	newUUID := uuid.New().String()
// 	hostToken := uuid.New().String()

// 	fmt.Println(newUUID)

// 	// Insert event information into the events table
// 	_, err = tx.Exec("INSERT INTO events (event_id, title, detail, host_token) VALUES (?,?,?,?);", newUUID, title, detail, hostToken)
// 	if err != nil {
// 		// Rollback the transaction in case of an error
// 		tx.Rollback()
// 		log.Println("Error inserting event:", err)
// 		return "", err
// 	}

// 	// Insert timeslot information into the event-timeslot table
// 	stmt, err := tx.Prepare("INSERT INTO event_timeslots (event_id, description) VALUES (?, ?)")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer stmt.Close()

// 	// Insert each proposal into event_timeslot
// 	for proposal := range proposals {
// 		_, err := stmt.Exec(newUUID, proposal)
// 		fmt.Println(proposal)
// 		if err != nil {
// 			// Rollback the transaction in case of an error
// 			tx.Rollback()
// 			log.Fatal(err)
// 		}
// 	}

// 	// Commit the transaction
// 	if err := tx.Commit(); err != nil {
// 		log.Println("Error committing transaction:", err)
// 		return "", err
// 	}

// 	return newUUID, nil
// }

// CreateEventInDB creates a new event in the database
func (repo Repository) CreateEvent(title, detail string, proposals []string) (string, string, error) {
	// issue new event id and hostToken (both are uuid)
	newEventID := uuid.New().String()
	hostToken := uuid.New().String()

	// Create new event instance
	newEvent := Event{
		EventID:   newEventID,
		Title:     title,
		Detail:    detail,
		HostToken: hostToken,
	}

	// Insert new event info to db
	if err := repo.db.Create(&newEvent).Error; err != nil {
		log.Println("Gorm Error:", err)
		return "", "", err
	}

	// Insert each proposal into event_timeslot
	for i, proposal := range proposals {
		log.Println(i)
		newEventTimeslot := EventTimeslot{
			EventID:     newEventID,
			Description: proposal,
		}
		if err := DB.Create(&newEventTimeslot).Error; err != nil {
			log.Println("Gorm Error:", err)
			return "", "", err
		}
	}

	return newEventID, hostToken, nil
}

// func (repo Repository) CreateEvent_new(c *gin.Context) {
// 	// POST /event
// 	var requestInfo RequestInfo

// 	if err := c.BindJSON(&requestInfo); err != nil {
// 		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "invalid request body"})
// 		return
// 	}

// 	token := requestInfo.HostToken
// 	if token == "" {
// 		// new user
// 		// generate a token for the creator
// 		token = uuid.New().String()
// 		log.Println("New token created:", token)
// 	}

// 	// insert event info into events table
// 	newEventID := uuid.New().String()
// 	newEvent := Event{
// 		EventID:   newEventID,
// 		Title:     requestInfo.Title,
// 		Detail:    requestInfo.Detail,
// 		HostToken: token,
// 	}

// 	if err := db.Create(&newEvent).Error; err != nil {
// 		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "failed to create event"})
// 		log.Println("Gorm Error:", err)
// 		return
// 	}

// 	// get event id from database
// 	var eventID uint
// 	if err := db.Model(&Event{}).Select("event_id").Where("title = ?", requestInfo.Title).Row().Scan(&eventID); err != nil {
// 		return
// 	}

// 	// insert event user info into event_users table
// 	newEventUser := EventUser{
// 		ID:       0, // auto increment
// 		EventID:  eventID,
// 		UserName: requestInfo.UserName,
// 	}

// 	if err := db.Create(&newEventUser).Error; err != nil {
// 		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "failed to create event user entry"})
// 		log.Println("Gorm Error:", err)
// 		return
// 	}

// 	c.IndentedJSON(http.StatusCreated, newEvent)
// }
