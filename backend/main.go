package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"chouseisan/schedule"
)

func main() {
	router := gin.Default()

    // solve the CORS block problem
	router.Use(cors.Default())

	schedule.SetupScheduleRoutes(router)

	router.Run("0.0.0.0:8080")
}
