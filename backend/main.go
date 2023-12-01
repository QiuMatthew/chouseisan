package main

import (
	"chouseisan/cookie"
	"chouseisan/schedule"
	"net/http"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	// http.HandleFunc("/", setCookies)
	// http.HandleFunc("/cookie", showCookie)
	// solve the CORS block problem
	// router.Use(cors.Default())
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/refreshToken", cookie.RefreshCookieHandler)
	router.GET("/setCookie", cookie.SetCookieHandler)
	// router.GET("/cookie", getCookieHandler)

	router.GET("/add-text", func(c *gin.Context) {
		// Use the context's String method to add text to the response
		c.String(http.StatusOK, "Hello, this is some text added to the response!")
	})

	schedule.SetupScheduleRoutes(router)

	router.Run("0.0.0.0:8080")
}
