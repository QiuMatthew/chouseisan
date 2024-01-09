package repository

import (
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
)

func (repo Repository) DeleteEventUserByEventID(event_id string) error {
	result := repo.db.Where("event_id = ?", event_id).Delete(&EventUser{})
	if result.Error != nil {
		// An error occurred during deletion
		// You can handle the error here
		fmt.Println("Error deleting record:", result.Error)
		return result.Error
	} else if result.RowsAffected == 0 {
		// No records were deleted because there were no matches for the conditions
		fmt.Println("No records matching the conditions")
	} else {
		// Deletion was successful
		fmt.Println("Record deleted successfully")
	}
	return nil
}

func (repo Repository) InsertEventUser(newEventUser *EventUser) (uint, error) {
	// returns newly created user_id
	result := repo.db.Create(newEventUser)
	if err := result.Error; err != nil {
		log.Println("Gorm Error:", err)
		return 0, err
	}
	log.Println(newEventUser.ID)
	fmt.Println(newEventUser.ID)
	return newEventUser.ID, nil
}

func (repo Repository) GetUsersByEventID(eventID string) ([]EventUser, error) {
	var eventUsers []EventUser
	query := repo.db.Where("event_id = ?", eventID).Order("id").Find(&eventUsers)

	if query.Error != nil {
		if query.Error == gorm.ErrRecordNotFound {
			return eventUsers, fmt.Errorf("GetTimeslotsByEventID %s: error getting timeslots", eventID)
		}
		return eventUsers, query.Error
	}
	return eventUsers, nil
}
