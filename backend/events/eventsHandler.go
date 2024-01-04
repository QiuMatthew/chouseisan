package events

import (
	"github.com/gin-gonic/gin"
)

func SetupEventsRoutes(router *gin.Engine) {
	/*
		router.GET("/chouseisan/events", GetEventByHash)
		router.POST("chouseisan/events", CreateEvent)
	*/
	router.GET("/event", GetEvents)
	router.POST("/event", CreateEvent)
	router.DELETE("/event", DeleteEvent)
}
