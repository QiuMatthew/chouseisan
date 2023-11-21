package main

import (
	"chouseisan/schedule"
	"net/http"

	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var jwtKey = []byte("secret-key")

// Claims struct represents the claims stored in the JWT token
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func setCookieHandler(c *gin.Context) {
	expirationTime := time.Now().Add(24 * time.Hour)
	// claims := &jwt.StandardClaims{
	// 	ExpiresAt: expirationTime.Unix(),
	// 	IssuedAt:  time.Now().Unix(),
	// }
	claims := &Claims{
		Username: "aaa",
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating JWT"})
		return
	}
	c.SetCookie("jwt", tokenString, 3600*24, "/", "localhost", false, true)
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Cookie has been set"})
}

// func getCookieHandler(c *gin.Context) {
// 	cookie, err := c.Cookie("userid")
// 	if err != nil {
// 		c.String(http.StatusNotFound, "Cookie not found")
// 		return
// 	}
// 	c.String(http.StatusOK, "Cookie value: %s", cookie)
// }

func refreshCookieHandler(c *gin.Context) {
	// Check if a valid JWT cookie exists
	tokenString, err := c.Cookie("jwt")
	if err == nil {
		// Parse the existing token to verify its validity
		token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			// If the existing token is invalid, proceed to create a new one
			setCookieHandler(c)
			return
		}

		// If the existing token is valid, respond with a message
		c.JSON(http.StatusOK, gin.H{"message": "Token is still valid"})
		return
	}

	// If no valid JWT cookie exists, create and set a new token
	setCookieHandler(c)
}

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

	router.GET("/refreshToken", refreshCookieHandler)
	router.GET("/setCookie", setCookieHandler)
	// router.GET("/cookie", getCookieHandler)

	router.GET("/add-text", func(c *gin.Context) {
		// Use the context's String method to add text to the response
		c.String(http.StatusOK, "Hello, this is some text added to the response!")
	})

	schedule.SetupScheduleRoutes(router)

	router.Run("0.0.0.0:8080")
}
