package events

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"log"
	"github.com/google/uuid"
)

type RequestInfo struct {
	EventID			 string   `json:"eventID"`
	Title            string `json:"title"`
	DateTimeProposal string `json:"dateTimeProposal"`
	Detail           string `json:"detail"`
	UserID			 uint	`json:"userID"`
	UserName		 string	`json:"userName"`
	UserEmail		 string	`json:"userEmail"`
	UserToken		 string	`json:"userToken"`
	HostID			 uint	`json:"hostID"`
	HostName		 string	`json:"hostName"`
	HostEmail		 string	`json:"hostEmail"`
	HostToken		 string	`json:"hostToken"`
}

type Event struct {
	EventID			 string   `gorm:"primarykey"`
	Title            string `json:"title" gorm:"column:title"`
	Detail           string `json:"detail" gorm:"column:detail"`
	HostToken        	 string `gorm:"column:host_token"`
}

type EventUser struct {
	ID				uint	`gorm:"primarykey"`
	EventID			uint	`gorm:"column:event_id"`
	UserName			string	`gorm:"column:user_name"`
}

type EventTimeslot struct {
	EventTimeslotID	 uint	`gorm:"primarykey"`
	EventID			 uint	`gorm:"column:event_id"`
	Description		 string	`gorm:"column:description"`
}

// Declare db as global variable, not optimal but useful at the moment
var db *gorm.DB

func init() {
	// This function will run immediately after backend is started, used to initialize database connection

	var err error

	// Connect to mysql database
    DBMS := "mysql"
    USER := "root"
    PASS := ""
    PROTOCOL := "tcp(localhost:3306)"
    DBNAME := "chouseisan"
    CONNECT := USER + ":" + PASS + "@" + PROTOCOL + "/" + DBNAME + "?charset=utf8&parseTime=True&loc=Local"
	db, err = gorm.Open(DBMS, CONNECT)
	if err != nil {
		log.Fatal(err)
		panic("failed to connect database")
	}
	
	// check if database connection is correctly established 
	if db == nil {
        log.Println("ERROR: db is nil!")
	}
	
	// Migrate the schema
	db.AutoMigrate(&Event{})
}

func GetEvents(c *gin.Context) {
    // GET /event
	var events []Event
	if err := db.Find(&events).Error; err != nil {
		log.Fatal(err)
		return
	}
	
	c.IndentedJSON(http.StatusOK, events)
}

func CreateEvent(c *gin.Context) {
    // POST /event
	var requestInfo RequestInfo

	if err := c.BindJSON(&requestInfo); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "invalid request body"})
		return
	}

	token := requestInfo.HostToken
	if token == "" {
		// new user
		// generate a token for the creator
		token = uuid.New().String()
		log.Println("New token created:", token)
	}

	// insert event info into events table
	newEventID := uuid.New().String()
	newEvent := Event {
		EventID:			newEventID,
		Title:				requestInfo.Title,
		Detail:				requestInfo.Detail,
		HostToken:			token,
	}

	if err := db.Create(&newEvent).Error; err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "failed to create event"})
		log.Println("Gorm Error:", err)
		return
	}

	// get event id from database
	var eventID uint
	if err := db.Model(&Event{}).Select("event_id").Where("title = ?", requestInfo.Title).Row().Scan(&eventID); err != nil {
		return
	}
	
	// insert event user info into event_users table
	newEventUser := EventUser {
		ID:					0,	// auto increment
		EventID:			eventID,
		UserName:			requestInfo.UserName,
	}
	
	if err := db.Create(&newEventUser).Error; err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "failed to create event user entry"})
		log.Println("Gorm Error:", err)
		return
	}

	c.IndentedJSON(http.StatusCreated, newEvent)
}

func DeleteEvent(c *gin.Context) {
    // DELETE /event/

	var requestInfo RequestInfo

	if err := c.BindJSON(&requestInfo); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "invalid request body"})
		return
	}

	// get host token of the event
    var hostToken string
	if err := db.Model(&Event{}).Select("host_token").Where("event_id = ?", requestInfo.EventID).Row().Scan(&hostToken); err != nil {
		return
	}
	
	// check if the user is the host of the event
    if hostToken == requestInfo.HostToken {
        // delete event from database
		if err := db.Where("event_id = ?", requestInfo.EventID).Delete(&Event{}).Error; err != nil {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "failed to delete event"})
			log.Println("Gorm Error:", err)
			return
		}
    } else {
        c.IndentedJSON(http.StatusForbidden, gin.H{"message": "permission denied, you are not the host of the event"})
        return
    }
}
