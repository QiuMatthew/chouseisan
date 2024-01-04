// Handler functions for events...
package handler

import (
	"chouseisan/repository"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type EventRequest struct {
	Title            string `json:"title"`
	Detail           string `json:"detail"`
	DateTimeProposal string `json:"dateTimeProposal"`
}

type EventHandler struct {
	Repo *repository.Repository
}

func NewEventHandler(repo *repository.Repository) *EventHandler {
	return &EventHandler{Repo: repo}
}

func (h *EventHandler) CreateEventHandler(c *gin.Context) {
	// Parse the JSON request
	fmt.Println("here")
	var eventRequest EventRequest
	if err := c.ShouldBindJSON(&eventRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Split proposals by "\n"
	proposals := strings.Split(eventRequest.DateTimeProposal, "\n")

	// Store new information in DB
	eventID, hostToken, err := h.Repo.CreateEvent(eventRequest.Title, eventRequest.Detail, proposals)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"CreateEventHandler error": "Failed to create event"})
		return
	}

	// Set hostToken by set-cookie header field
	fmt.Println(hostToken)
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("coo", "doo", 3600*24*360, "/", "http://localhost", true, true)

	// Return the event ID as a response
	c.JSON(http.StatusCreated, gin.H{"event_id": eventID})
}

// func (h *EventHandler) EventBasicHandler(c *gin.Context) {
// 	// accessed like /eventBasic/{uuid of event}
// 	event_uuid := c.Param("uuid")
// 	event, err := h.Repo.GetEventById(event_uuid)
// 	if err != nil {
// 		log.Fatalln("Error seraching for event:", err)
// 	}
// 	c.IndentedJSON(http.StatusOK, event)
// }
