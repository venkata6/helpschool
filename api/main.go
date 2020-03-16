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
	"github.com/go-chi/docgen"
	"github.com/go-chi/render"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/log/log15adapter"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/venkata6/helpschool/api/service"
	"net/http"
	"net/url"
	"os"
)

var routes = flag.Bool("routes", false, "Generate router documentation")
var db *pgxpool.Pool

func main() {

	flag.Parse()

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(render.SetContentType(render.ContentTypeJSON))

	//connect to the database and setup the connection pool for services to use
	setUpDatabaseConnection()

	// RESTy routes for "countries" resource
	countryService := service.NewCountriesService(db)
	r.Route("/countries", func(r chi.Router) {
		r.With(paginate).Get("/", countryService.GetCountries)
		r.Post("/", countryService.CreateCountries)   // POST /countries
		r.Delete("/", countryService.DeleteCountries) // DELETE /countries
	})

	statesService := service.NewStatesService(db)
	//// RESTy routes for "states" resource
	r.Route("/states", func(r chi.Router) {
		r.With(paginate).Get("/", statesService.GetStates)
		r.Post("/", statesService.CreateStates)   // POST /countries
		r.Delete("/", statesService.DeleteStates) // DELETE /countries
	})
	//
	//// RESTy routes for "districts" resource
	districtsService := service.NewDistrictsService(db)
	r.Route("/districts", func(r chi.Router) {
		r.With(paginate).Get("/", districtsService.GetDistricts)
		r.Post("/", districtsService.CreateDistricts)   // POST /countries
		r.Delete("/", districtsService.DeleteDistricts) // DELETE /countries
	})
	//
	//// RESTy routes for "schools" resource
	schoolsService := service.NewSchoolsService(db)
	r.Route("/schools", func(r chi.Router) {
		r.With(paginate).Get("/", schoolsService.GetSchools)
		r.Post("/", schoolsService.CreateSchools)   // POST /countries
		r.Delete("/", schoolsService.DeleteSchools) // DELETE /countries
	})

	//// RESTy routes for "supplies" resource
	suppliesService := service.NewSuppliesService(db)
	r.Route("/supplies", func(r chi.Router) {
		r.With(paginate).Get("/", suppliesService.GetSupplies)
		r.Post("/", suppliesService.CreateSupplies)   // POST /countries
		r.Delete("/", suppliesService.DeleteSupplies) // DELETE /countries
	})

	// Mount the admin sub-router, which btw is the same as:
	// r.Route("/admin", func(r chi.Router) { admin routes here })
	r.Mount("/admin", adminRouter())

	// Passing -routes to the program will generate docs for the above
	// router definition. See the `routes.json` file in this folder for
	// the output.
	if *routes {
		// fmt.Println(docgen.JSONRoutesDoc(r))
		fmt.Println(docgen.MarkdownRoutesDoc(r, docgen.MarkdownOpts{
			ProjectPath: "github.com/go-chi/chi",
			Intro:       "Welcome to the chi/_examples/rest generated docs.",
		}))
		return
	}
	defer db.Close()
	http.ListenAndServe(":3333", r)
}

func setUpDatabaseConnection() {
	// database connection pool setup
	dsn := url.URL{
		User:     url.UserPassword("postgres", "Pass1234"),
		Scheme:   "postgres",
		Host:     fmt.Sprintf("%s:%s", "localhost", "5432"),
		Path:     "helpschool",
		RawQuery: (&url.Values{"sslmode": []string{"disable"}}).Encode(),
	}
	var poolConfig, err = pgxpool.ParseConfig(dsn.String())
	if err != nil {
		//log.Crit("Unable to parse DATABASE_URL", "error", err)
		os.Exit(1)
	}
	db, err = pgxpool.ConnectConfig(context.Background(), poolConfig)
	if err != nil {
		//log.Crit("Unable to create connection pool", "error", err)
		os.Exit(1)
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
