// Boot the server:
// ----------------
// $ go run main.go

package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/docgen"
	"github.com/go-chi/render"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/log/log15adapter"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/venkata6/helpschool/api/service"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strings"

	//"time"
)

var routes = flag.Bool("routes", false, "Generate router documentation")
var db *pgxpool.Pool
var bProd = false

func main() {

	flag.Parse()

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(middleware.NoCache)
	r.Use(render.SetContentType(render.ContentTypeJSON))

	//add CORS middleware
	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})
	r.Use(cors.Handler)

	//connect to the database and setup the connection pool for services to use
	setUpDatabaseConnection()

	// RESTy routes for "countries" resource
	countryService := service.NewCountriesService(db)

	r.Route("/api/countries", func(r chi.Router) {
		r.With(paginate).Get("/", countryService.GetCountries)
		r.Post("/", countryService.CreateCountries)   // POST /countries
		r.Delete("/", countryService.DeleteCountries) // DELETE /countries
	})

	statesService := service.NewStatesService(db)
	//// RESTy routes for "states" resource
	r.Route("/api/states", func(r chi.Router) {
		r.With(paginate).Get("/", statesService.GetStates)
		r.Post("/", statesService.CreateStates)   // POST /countries
		r.Delete("/", statesService.DeleteStates) // DELETE /countries
	})
	//
	//// RESTy routes for "districts" resource
	districtsService := service.NewDistrictsService(db)
	r.Route("/api/districts", func(r chi.Router) {
		r.With(paginate).Get("/state/{stateId}", districtsService.GetDistricts)
		r.Post("/", districtsService.CreateDistricts)   // POST /countries
		r.Delete("/", districtsService.DeleteDistricts) // DELETE /countries
	})
	//
	//// RESTy routes for "schools" resource
	schoolsService := service.NewSchoolsService(db)
	r.Route("/api/schools", func(r chi.Router) {
		r.With(paginate).Get("/district/{districtId}", schoolsService.GetSchools)
		r.Post("/", schoolsService.CreateSchools)   // POST /countries
		r.Delete("/", schoolsService.DeleteSchools) // DELETE /countries
	})

	//// RESTy routes for "supplies" resource
	suppliesService := service.NewSuppliesService(db)
	r.Route("/api/supplies", func(r chi.Router) {
		r.With(paginate).Get("/", suppliesService.GetSupplies)
		r.Post("/", suppliesService.CreateSupplies)   // POST /countries
		r.Delete("/", suppliesService.DeleteSupplies) // DELETE /countries
	})

	//// RESTy routes for "supplies" resource
	schoolSuppliesService := service.NewSchoolSuppliesService(db)
	r.Route("/api/schools/{schoolId}/supplies", func(r chi.Router) {
		r.With(paginate).Get("/", schoolSuppliesService.GetSchoolSupplies)
		r.Post("/", schoolSuppliesService.CreateSchoolSupplies)   // POST /countries
		r.Delete("/", schoolSuppliesService.DeleteSchoolSupplies) // DELETE /countries
	})

	//// RESTy routes for "featured supplies" resource
	r.Route("/api/schools/supplies", func(r chi.Router) {
		r.With(paginate).Get("/", schoolSuppliesService.GetFeaturedSchoolSupplies)
	})

    //// RESTy routes for POST "teachers requests" resource
    teachersRequestService := service.NewTeachersRequestService(db)
	r.Route("/api/teachers/requests", func(r chi.Router) {
		r.With(paginate).Get("/{id}", teachersRequestService.GetTeachersRequest)
		r.Post("/", teachersRequestService.CreateTeachersRequest)   // POST /teachers/requests
	})



	// Mount the admin sub-router, which btw is the same as:
	// r.Route("/admin", func(r chi.Router) { admin routes here })
	r.Mount("/admin", adminRouter())

	// Passing -routes to the program will generate docs for the above
	// router definition. See the `routes.json` file in this folder for
	// the output.
	if *routes {
		fmt.Printf(docgen.JSONRoutesDoc(r))
		fmt.Println(docgen.MarkdownRoutesDoc(r, docgen.MarkdownOpts{
			ProjectPath: "github.com/go-chi/chi",
			Intro:       "Welcome to the chi/_examples/rest generated docs.",
		}))
		return
	}
	defer db.Close() //remove when sql is ready
	if ( bProd ){
		FileServer(r, "/", "web/")
	} else {
		FileServer(r, "/", "api/web/")
	}
	http.ListenAndServe(":8080", r)
}


// FileServer is serving static files.
// FileServer is serving static files
func FileServer(r chi.Router, public string, static string) {

	if strings.ContainsAny(public, "{}*") {
		fmt.Printf("FileServer does not permit URL parameters. %v",public)
	}

	root, _ := filepath.Abs(static)
	if _, err := os.Stat(root); os.IsNotExist(err) {
		fmt.Printf("Static Documents Directory Not Found %v ",err )
	}

	fs := http.StripPrefix(public, http.FileServer(http.Dir(root)))

	if public != "/" && public[len(public)-1] != '/' {
		r.Get(public, http.RedirectHandler(public+"/", 301).ServeHTTP)
		public += "/"
	}

	r.Get(public+"*", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		file := strings.Replace(r.RequestURI, public, "/", 1)
		if _, err := os.Stat(root + file); os.IsNotExist(err) {
			http.ServeFile(w, r, path.Join(root, "index.html"))
			return
		}
		fs.ServeHTTP(w, r)
	}))
}

func setUpDatabaseConnection() {

	var dbPwd = ""
	var dsn url.URL
	var instanceConnectionName = ""
	// database connection pool setup
	if ( bProd) {
		dbPwd                  = "Nellai987!!!"
		instanceConnectionName = "/cloudsql/helpschool:us-central1:helpschool-db"
		dsn = url.URL{
			User:     url.UserPassword("postgres", dbPwd),
			Scheme:   "postgres",
			Host:     instanceConnectionName,
			Path:     "helpschool-db",
			RawQuery: (&url.Values{"sslmode": []string{"disable"}}).Encode(),
		}

		// "postgres://username:password@/databasename?host=/cloudsql/example:us-central1:example123"
		// "postgres://postgres:Nellai987!!!@/helpschool-db?host=/cloudsql/helpschool:us-central1:helpschool-db"

	} else {
		dbPwd = "Pass1234"
		dsn = url.URL{
			User:     url.UserPassword("postgres", dbPwd),
			Scheme:   "postgres",
			Host:     fmt.Sprintf("%s:%s", "localhost", "5432"),
			Path:     "helpschool",
			RawQuery: (&url.Values{"sslmode": []string{"disable"}}).Encode(),
		}
	}
	var connectionString = ""
	if ( bProd == true ){
		connectionString = "postgres://postgres:Nellai987!!!@/helpschool?host=/cloudsql/helpschool:us-central1:helpschool-db"
	} else {
		connectionString = dsn.String()
	}
	var poolConfig, err = pgxpool.ParseConfig(connectionString)
	if err != nil {
		fmt.Printf("Unable to parse DATABASE_URL %v \n", err)
		os.Exit(1)
	}
	db, err = pgxpool.ConnectConfig(context.Background(), poolConfig)
	if err != nil {
		fmt.Printf("Unable to create connection pool  %v \n ", err)
		os.Exit(1)
	} else {
		fmt.Printf("Database connection successful!!!   \n ")
	}

	// database connection pool setup
}

// A completely separate router for administrator routes
func adminRouter() chi.Router {
	r := chi.NewRouter()
	r.Use(AdminOnly)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("admin: index"))
	})
	r.Get("/accounts", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("admin: list accounts.."))
	})
	r.Get("/users/{userId}", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(fmt.Sprintf("admin: view user id %v", chi.URLParam(r, "userId"))))
	})
	return r
}

// AdminOnly middleware restricts access to just administrators.
func AdminOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		isAdmin, ok := r.Context().Value("acl.admin").(bool)
		if !ok || !isAdmin {
			http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// paginate is a stub, but very possible to implement middleware logic
// to handle the request params for handling a paginated request.
func paginate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// just a stub.. some ideas are to look at URL query params for something like
		// the page number, or the limit, and send a query cursor down the chain
		next.ServeHTTP(w, r)
	})
}

// This is entirely optional, but I wanted to demonstrate how you could easily
// add your own logic to the render.Respond method.
func init() {
	render.Respond = func(w http.ResponseWriter, r *http.Request, v interface{}) {
		if err, ok := v.(error); ok {

			// We set a default error status response code if one hasn't been set.
			if _, ok := r.Context().Value(render.StatusCtxKey).(int); !ok {
				w.WriteHeader(400)
			}

			// We log the error
			fmt.Printf("Logging err: %s\n", err.Error())

			// We change the response to not reveal the actual error message,
			// instead we can transform the message something more friendly or mapped
			// to some code / language, etc.
			render.DefaultResponder(w, r, render.M{"status": "error"})
			return
		}

		render.DefaultResponder(w, r, v)
	}
}
