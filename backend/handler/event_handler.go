// Handler functions for events...
package handler

import (
	"chouseisan/repository"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type EventRequest struct {
	Title            string `json:"title"`
	Detail           string `json:"detail"`
	DateTimeProposal string `json:"dateTimeProposal"`
}

type EventUserTimeslotRequest struct {
	Availability map[string](uint) `json:"availability"`
	Name         string            `json:"name"`
	Comment      string            `json:"comment"`
}

type ModifyEventUserTimeslotRequest struct {
	Availability map[string](uint) `json:"availability"`
	Name         string            `json:"name"`
	Comment      string            `json:"comment"`
	UserID       uint              `json:"user_id"`
}

type DeleteTimeslotsRequest struct {
	TimeslotIDs []uint `json:"timeslot_ids"`
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
	// c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(eventID, hostToken, 3600*24, "/", "http://localhost", false, true)

	// Return the event ID as a response
	c.JSON(http.StatusOK, gin.H{"event_id": eventID})
}

func (h *EventHandler) DeleteEventHandler(c *gin.Context) {
	eventID := c.Param("eventID")

	// check cookie for host token
	tokenString, err := c.Cookie(eventID)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusForbidden, gin.H{"message": "permission denied, you are not the host of the event"})
		return
	}

	// get event info
	event, err := h.Repo.GetEventByID(eventID)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Event Not Found."})
		return
	}

	// check if the user is the host of the event

	if tokenString != event.HostToken {
		c.IndentedJSON(http.StatusForbidden, gin.H{"message": "permission denied, you are not the host of the event"})
		return
	}

	// Delete Event from all tables
	err = h.Repo.DeleteEvent(eventID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "failed to delete event"})
		log.Println("Gorm Error:", err)
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Successfully delteted an event"})
}

func (h *EventHandler) EditTitleDetailHandler(c *gin.Context) {
	eventID := c.Param("eventID")

	// check cookie for host token
	tokenString, err := c.Cookie(eventID)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusForbidden, gin.H{"message": "permission denied, you are not the host of the event"})
		return
	}

	// get event info
	event, err := h.Repo.GetEventByID(eventID)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Event Not Found."})
		return
	}

	// check if the user is the host of the event

	if tokenString != event.HostToken {
		c.IndentedJSON(http.StatusForbidden, gin.H{"message": "permission denied, you are not the host of the event"})
		return
	}

	// get request body
	var eventRequest EventRequest
	if err := c.ShouldBindJSON(&eventRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// edit event
	if err := h.Repo.UpdateEventTitleDetail(eventID, eventRequest.Title, eventRequest.Detail); err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error editing event title and detail."})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Successfully modified event title and detail"})
}

func (h *EventHandler) GetTimeslotsHandler(c *gin.Context) {
	eventID := c.Param("eventID")
	// get event info
	if _, err := h.Repo.GetEventByID(eventID); err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Event Not Found."})
		return
	}

	//get all timeslots
	timeslots, err := h.Repo.GetTimeslotsByEventID(eventID)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error obtaining timeslots for this event."})
		return
	}

	// make timeslots hash dict

	timeslotsDict := make(map[string]map[uint]string)

	for _, timeslot := range timeslots {
		if _, ok := timeslotsDict["timeslots"]; !ok {
			timeslotsDict["timeslots"] = make(map[uint]string)
		}

		timeslotsDict["timeslots"][timeslot.ID] = timeslot.Description
	}

	c.IndentedJSON(http.StatusOK, timeslotsDict)
}

func (h *EventHandler) DeleteTimeslotsHandler(c *gin.Context) {
	eventID := c.Param("eventID")

	// request body
	var req DeleteTimeslotsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// check cookie for host token
	tokenString, err := c.Cookie(eventID)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusForbidden, gin.H{"message": "permission denied, you are not the host of the event"})
		return
	}

	// get event info
	event, err := h.Repo.GetEventByID(eventID)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Event Not Found."})
		return
	}

	// check if the user is the host of the event

	if tokenString != event.HostToken {
		c.IndentedJSON(http.StatusForbidden, gin.H{"message": "permission denied, you are not the host of the event"})
		return
	}

	// delete specified events
	if err := h.Repo.DeleteEventTimeslots(eventID, req.TimeslotIDs); err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error deleting events."})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Successfully deleted some timeslots"})

}

func (h *EventHandler) AddTimeslotsHandler(c *gin.Context) {
	eventID := c.Param("eventID")
	var eventRequest EventRequest
	if err := c.ShouldBindJSON(&eventRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Split proposals by "\n"
	proposals := strings.Split(eventRequest.DateTimeProposal, "\n")

	err := h.Repo.InsertEventTimeslot(eventID, proposals)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"AddTimeslotsHandler error": "Failed to add timeslots"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"event_id": eventID})
}

func (h *EventHandler) CheckEventExistsHandler(c *gin.Context) {
	eventID := c.Param("eventID")
	// get event info
	if _, err := h.Repo.GetEventByID(eventID); err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusOK, gin.H{"message": "Event Not Found."})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Event Found."})
}

func (h *EventHandler) IsCreatedBySelfHandler(c *gin.Context) {
	eventID := c.Param("eventID")
	// check cookie for host token
	tokenString, err := c.Cookie(eventID)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusForbidden, gin.H{"message": "permission denied, you are not the host of the event"})
		return
	}
	// get event info
	event, err := h.Repo.GetEventByID(eventID)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Event Not Found."})
		return
	}

	// check if the user is the host of the event

	if tokenString != event.HostToken {
		c.IndentedJSON(http.StatusForbidden, gin.H{"message": "permission denied, you are not the host of the event"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "you ARE the host of the event"})
}

func (h *EventHandler) AddAttendanceHandler(c *gin.Context) {
	eventID := c.Param("eventID")
	// get request body
	var req EventUserTimeslotRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}
	// get event info
	if _, err := h.Repo.GetEventByID(eventID); err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Event Not Found."})
		return
	}

	// convert availability map's key to integer
	uintAvailability := make(map[uint](uint))
	for strKey, value := range req.Availability {
		uintKey, err := strconv.ParseUint(strKey, 10, 64)
		if err != nil {
			// Handle the error if the conversion fails
			fmt.Printf("Error converting key %s: %v\n", strKey, err)
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error converting availability"})
			return
		}
		uintAvailability[uint(uintKey)] = value
	}

	err := h.Repo.AddAttendance(eventID, uintAvailability, req.Name, req.Comment)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error storing preferences"})
		return
	}
	c.IndentedJSON(http.StatusCreated, gin.H{"message": "Successfully stored preferences"})
}

func (h *EventHandler) GetAttendanceHandler(c *gin.Context) {
	eventID := c.Param("eventID")

	// get list of users
	eventUsers, users_err := h.Repo.GetUsersByEventID(eventID)
	if users_err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error obtaining list of users"})
		return
	}
	// get list of timeslots
	eventTimeslots, ts_err := h.Repo.GetTimeslotsByEventID(eventID)
	if ts_err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error obtaining list of timeslots"})
		return
	}

	preferences, err := h.Repo.GetAllPreferences(eventID, eventUsers, eventTimeslots)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error obtaining preferences"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Successfully got all preferences",
		"userAvailability": preferences,
		"users":            eventUsers,
		"timeslots":        eventTimeslots})
}

func (h *EventHandler) GetEventBasicHandler(c *gin.Context) {
	eventID := c.Param("eventID")

	event, err := h.Repo.GetEventByID(eventID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error obtaining event"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"title": event.Title, "detail": event.Detail})

}

func (h *EventHandler) ModifyAttendanceHandler(c *gin.Context) {
	eventID := c.Param("eventID")
	// get request body
	var req ModifyEventUserTimeslotRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}
	// get event info
	if _, err := h.Repo.GetEventByID(eventID); err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Event Not Found."})
		return
	}

	// convert availability map's key to integer
	uintAvailability := make(map[uint](uint))
	for strKey, value := range req.Availability {
		uintKey, err := strconv.ParseUint(strKey, 10, 64)
		if err != nil {
			// Handle the error if the conversion fails
			fmt.Printf("Error converting key %s: %v\n", strKey, err)
			continue
		}
		uintAvailability[uint(uintKey)] = value
	}

	err := h.Repo.ModifyAttendance(eventID, uintAvailability, req.Name, req.Comment, req.UserID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error storing preferences"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Successfully modified preferences"})

}
