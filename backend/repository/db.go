package repository

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() {
	// Initialize database connection
	cfg := mysql.Config{
		User:                 "user",
		Passwd:               "password",
		Net:                  "tcp",
		Addr:                 "mysql:3306",
		DBName:               "chouseisan",
		AllowNativePasswords: true,
	}

	var err error
	DB, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	// Test the connection
	if err := DB.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected!")
}
