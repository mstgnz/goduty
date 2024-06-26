package config

import (
	"log"
	"os"
	"sync"
	"time"

	"github.com/mstgnz/goduty/pkg"
	"github.com/mstgnz/gomail"
)

var (
	once     sync.Once
	instance *config
)

// context key type
type CKey string

type config struct {
	DB        *DB
	Mail      *gomail.Mail
	Cache     *pkg.Cache
	SecretKey string
	QUERY     map[string]string
	Running   int
	Shutting  bool
}

func App() *config {
	once.Do(func() {
		instance = &config{
			DB:    &DB{},
			Cache: pkg.NewCache(),
			// the secret key will change every time the application is restarted.
			SecretKey: RandomString(8),
			Mail: &gomail.Mail{
				From: os.Getenv("MAIL_FROM"),
				Name: os.Getenv("MAIL_FROM_NAME"),
				Host: os.Getenv("MAIL_HOST"),
				Port: os.Getenv("MAIL_PORT"),
				User: os.Getenv("MAIL_USER"),
				Pass: os.Getenv("MAIL_PASS"),
			},
		}
		instance.DB.ConnectDatabase()
	})
	return instance
}

func Logger(fileName string, logger *log.Logger) {
	logsDir := "logs"
	if _, err := os.Stat(logsDir); os.IsNotExist(err) {
		os.Mkdir(logsDir, 0755)
	}

	lastCheckedDay := time.Now().Day()

	for {
		currentDay := time.Now().Day()
		currentTime := time.Now().Format("2006-01-02")
		logFileName := logsDir + "/" + fileName + "-" + currentTime + ".log"

		_, err := os.Stat(fileName)
		if currentDay != lastCheckedDay || os.IsNotExist(err) {

			file, err := os.OpenFile(logFileName, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
			if err != nil {
				log.Println("An error occurred while creating the log file:", err)
			}

			logger.SetOutput(file)

			lastCheckedDay = currentDay

			_ = file.Close()
		}
	}
}
