package schedule

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type PersonalAvailability struct {
	ID                    string `json:"id"`
	Name                  string `json:"name"`
	TimeSlotsAvailability []bool `json:"timeSlotsAvailability"`
}

var MembersAvailability = []PersonalAvailability{
	{ID: "1", Name: "John", TimeSlotsAvailability: []bool{true, true, true, true, true,}},
	{ID: "2", Name: "Mary", TimeSlotsAvailability: []bool{true, true, true, true, false,}},
}

func GetMembersAvailability(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, MembersAvailability)
}

func PostMembersAvailability(c *gin.Context) {
	var newMemberAvailability PersonalAvailability

	if err := c.BindJSON(&newMemberAvailability); err != nil {
		return
	}

	MembersAvailability = append(MembersAvailability, newMemberAvailability)
	c.IndentedJSON(http.StatusCreated, newMemberAvailability)
}