// Handler functions for events...
package handler

import (
	"log"
	"net/http"
	"strings"

	"chouseisan/repository"

	"github.com/gin-gonic/gin"
)

type EventRequest struct {
	Title    string `json:"title"`
	Detail   string `json:"detail"`
	Proposal string `json:"proposal"`
}

type EventHandler struct {
	Repo *repository.Repository
}

func NewEventHandler(repo *repository.Repository) *EventHandler {
	return &EventHandler{Repo: repo}
}

type CreateEventRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Proposals   string `json:"proposals"`
}

func (h *EventHandler) CreateEventHandler(c *gin.Context) {
	// Parse the JSON request
	var createEventRequest CreateEventRequest
	if err := c.ShouldBindJSON(&createEventRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Split proposals by "\n"
	proposals := strings.Split(createEventRequest.Proposals, "\n")

	// Create the event
	eventID, err := h.Repo.CreateEvent(createEventRequest.Title, createEventRequest.Description, proposals)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create event"})
		return
	}

	// Return the event ID as a response
	c.JSON(http.StatusCreated, gin.H{"event_id": eventID})
}

func (h *EventHandler) EventBasicHandler(c *gin.Context) {
	// accessed like /eventBasic/{uuid of event}
	event_uuid := c.Param("uuid")
	event, err := h.Repo.GetEventById(event_uuid)
	if err != nil {
		log.Fatalln("Error seraching for event:", err)
	}
	c.IndentedJSON(http.StatusOK, event)
}
