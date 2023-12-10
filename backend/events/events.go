package events

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"fmt"
	"log"
	"time"
)

var db *gorm.DB

type Event struct {
	ID			   	 uint   `gorm:"primarykey"`
	Title            string `json:"title"`
	HostName         string `json:"hostName"`
	DateTimeProposal string `json:"dateTimeProposal"`
	Detail           string `json:"detail"`
	//Hash 		   	 string `json:"hash"`
}

var events = make(map[string]Event)

func init() {
	var err error
	// Connect to mysql database

	time.Sleep(6 * time.Second)
	db, err := gorm.Open("mysql", "root:mysql@tcp(mysql:3306)/chouseisan?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Println("Failed to connect to database", err)
		log.Fatal(err)
		panic("failed to connect database")
	}
	
	if db == nil {
		log.Fatal("db nil")
	}
	
	// Migrate the schema
	db.AutoMigrate(&Event{})
}

func GetEventByHash(c *gin.Context) {
	hash := c.Query("hash")
    if hash == "" {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "hash parameter is missing"})
        return
    }

	event, ok := events[hash]
	if !ok {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "event not found"})
		return
	}
	c.IndentedJSON(http.StatusOK, event)
}

func GetEvents(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, events)
	/*
	var event Event
	if err := db.Find(&event).Error; err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "failed to get events"})
		return
	}
	c.IndentedJSON(http.StatusOK, events)
	*/
}

func CreateEvent(c *gin.Context) {
	var newEvent Event

	if err := c.BindJSON(&newEvent); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "invalid request body"})
		return
	}
	
	// add to memory
	events[newEvent.Title] = newEvent
	
	// print out the event
	log.Println(newEvent)

	newEvent = Event{
        Title:            "Sample Event",
        HostName:         "John Doe",
        DateTimeProposal: "2023-12-31 18:00:00",
        Detail:           "A sample event description",
    }

	// insert into database
	if err := db.Create(&newEvent).Error; err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "failed to create event"})
		log.Println(err)
		return
	}

	c.IndentedJSON(http.StatusCreated, newEvent)
}
