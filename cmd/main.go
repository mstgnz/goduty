package main

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/mstgnz/goduty/config"
	"github.com/mstgnz/goduty/handler"
)

var PORT string

var (
	db = config.OpenDatabase()
)

func init() {
	// Load Env
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Load Env Error: %v", err)
	}

	PORT = os.Getenv("PORT")
}

type HttpHandler func(w http.ResponseWriter, r *http.Request) error

func Catch(h HttpHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := h(w, r); err != nil {
			slog.Info("HTTP handler error", "err", err, "path", r.URL.Path)
		}
	}
}

func main() {
	defer config.CloseDatabase(db)

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.RealIP)
	r.Use(middleware.RequestID)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "PUT", "POST", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	workDir, _ := os.Getwd()
	fileServer(r, "/asset", http.Dir(filepath.Join(workDir, "asset")))

	// web without auth
	homeHandler := handler.HomeHandler{}
	r.Get("/", Catch(homeHandler.Index))

	// web with auth
	r.Group(func(r chi.Router) {
		r.Use(webAuthMiddleware)
		//r.Get("/", Catch(webHandler.HomeHandler))
		//r.Get("/profile", Catch(webHandler.ProfileHandler))
		//r.Get("/schedules", Catch(webHandler.ListHandler))
	})

	err := http.ListenAndServe(fmt.Sprintf(":%s", PORT), r)
	if err != nil && err != http.ErrServerClosed {
		log.Fatal(err.Error())
	}
}

func webAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		/* tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

		userId, err := config.GetUserIDByToken(tokenString)
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		user_id, err := strconv.Atoi(userId)
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		user := &models.User{}
		getUser := user.GetUserWithId(user_id)

		ctx := context.WithValue(r.Context(), config.CKey("user"), getUser)
		next.ServeHTTP(w, r.WithContext(ctx)) */
		next.ServeHTTP(w, r)
	})
}

func fileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", http.StatusMovedPermanently).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
