package cookie

import (
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var jwtKey = []byte("secret-key")

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func SetCookieHandler(c *gin.Context) {
	// expirationTime := time.Now().Add(24 * time.Hour)
	// claims := &jwt.StandardClaims{
	// 	ExpiresAt: expirationTime.Unix(),
	// 	IssuedAt:  time.Now().Unix(),
	// }
	claims := &Claims{
		Username: "None",
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

func RefreshCookieHandler(c *gin.Context) {
	// Check if a valid JWT cookie exists
	tokenString, err := c.Cookie("jwt")
	if err == nil {
		// Parse the existing token to verify its validity
		token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			// If the existing token is invalid, proceed to create a new one
			SetCookieHandler(c)
			return
		}

		// If the existing token is valid, respond with a message
		c.JSON(http.StatusOK, gin.H{"message": "Token is still valid"})
		return
	}

	// If no valid JWT cookie exists, create and set a new token
	SetCookieHandler(c)
}
