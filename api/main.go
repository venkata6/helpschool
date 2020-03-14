// Boot the server:
// ----------------
// $ go run main.go

package main

import (
	"context"
	"github.com/venkata6/helpschool/api/request"
	"flag"
	"fmt"
	"github.com/venkata6/helpschool/api/dto"
	"github.com/venkata6/helpschool/api/response"
	"net/http"
	"net/url"
	"os"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/docgen"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/log/log15adapter"
	"github.com/jackc/pgx/v4/pgxpool"
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

	// RESTy routes for "countries" resource
	r.Route("/countries", func(r chi.Router) {
		r.With(paginate).Get("/", GetCountries)
		r.Post("/", CreateCountries)   // POST /countries
		r.Delete("/", DeleteCountries) // DELETE /countries
	})

	// RESTy routes for "countries" resource
	r.Route("/states", func(r chi.Router) {
		r.With(paginate).Get("/", GetCountries)
		r.Post("/", CreateCountries)   // POST /countries
		r.Delete("/", DeleteCountries) // DELETE /countries
	})

	// RESTy routes for "countries" resource
	r.Route("/districts", func(r chi.Router) {
		r.With(paginate).Get("/", GetCountries)
		r.Post("/", CreateCountries)   // POST /countries
		r.Delete("/", DeleteCountries) // DELETE /countries
	})

	// RESTy routes for "countries" resource
	r.Route("/schools", func(r chi.Router) {
		r.With(paginate).Get("/", GetCountries)
		r.Post("/", CreateCountries)   // POST /countries
		r.Delete("/", DeleteCountries) // DELETE /countries
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

	defer db.Close()
	// database connection pool setup

	http.ListenAndServe(":3333", r)
}

func GetCountries(w http.ResponseWriter, r *http.Request) {

	var count int
	rowCount, err := db.Query(context.Background(), "select count(*) as count from  helpschool.countries")
	for rowCount.Next() {
		_ = rowCount.Scan(&count)
		//checkErr(err)
	}
	rows,err := db.Query( context.Background(), "select name,country_id from helpschool.countries")
	defer rows.Close()

	countries := make([]response.CountryResponse, count)
	i := 0
	for rows.Next() {
		// Read
		var name string
		var country_id string

		err = rows.Scan(&name,&country_id)
		countries[i].Country = &dto.Country{}  // allocate space
		countries[i].Name=name
		countries[i].CountryId=country_id
		if err != nil {
			return
		}
		i++
	}
	// Any errors encountered by rows.Next or rows.Scan will be returned here
	if rows.Err() != nil {
		return
	}
	if err := render.RenderList(w, r, NewCountriesListResponse(countries)); err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
}


// DeleteCountries searches the Articles data for a matching article.
// It's just a stub, but you get the idea.
func DeleteCountries(w http.ResponseWriter, r *http.Request) {
	//render.RenderList(w, r, NewCountriesListResponse(articles))
}

// CreateCountries persists the posted Article and returns it
// back to the client as an acknowledgement.
func CreateCountries(w http.ResponseWriter, r *http.Request) {
	data := &request.CountryRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, ErrInvalidRequest(err))
		return
	}

	if _, err := db.Exec( context.Background(),`INSERT INTO helpschool.countries( country_id,name)
					VALUES ( $1, $2)`,uuid.New(),data.Name); err == nil {
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
	render.DefaultResponder(w, r, render.M{"status": "created"})
	//render.Status(r, http.StatusCreated)
	//render.Render(w, r, )
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

//--
// Request and Response payloads for the REST api.
//
// The payloads embed the data model objects an
//
// In a real-world project, it would make sense to put these payloads
// in another file, or another sub-package.
//--


// ArticleRequest is the request payload for Article data model.
//
// NOTE: It's good practice to have well defined request and response payloads
// so you can manage the specific inputs and outputs for clients, and also gives
// you the opportunity to transform data on input or output, for example
// on request, we'd like to protect certain fields and on output perhaps
// we'd like to include a computed field based on other values that aren't
// in the data model. Also, check out this awesome blog post on struct composition:
// http://attilaolah.eu/2014/09/10/json-and-struct-composition-in-go/
//type ArticleRequest struct {
//	*Article
//
//	User *UserPayload `json:"user,omitempty"`
//
//	ProtectedID string `json:"id"` // override 'id' json to have more control
//}
//
//func (a *ArticleRequest) Bind(r *http.Request) error {
//	// a.Article is nil if no Article fields are sent in the request. Return an
//	// error to avoid a nil pointer dereference.
//	if a.Article == nil {
//		return errors.New("missing required Article fields.")
//	}
//
//	// a.User is nil if no Userpayload fields are sent in the request. In this app
//	// this won't cause a panic, but checks in this Bind method may be required if
//	// a.User or futher nested fields like a.User.Name are accessed elsewhere.
//
//	// just a post-process after a decode..
//	a.ProtectedID = ""                                 // unset the protected ID
//	a.Article.Title = strings.ToLower(a.Article.Title) // as an example, we down-case
//	return nil
//}

// ArticleResponse is the response payload for the Article data model.
// See NOTE above in ArticleRequest as well.
//
// In the ArticleResponse object, first a Render() is called on itself,
// then the next field, and so on, all the way down the tree.
// Render is called in top-down order, like a http handler middleware chain.
//type ArticleResponse struct {
//	*Article
//
//	User *UserPayload `json:"user,omitempty"`
//
//	// We add an additional field to the response here.. such as this
//	// elapsed computed property
//	Elapsed int64 `json:"elapsed"`
//}
//
//func (rd *ArticleResponse) Render(w http.ResponseWriter, r *http.Request) error {
//	// Pre-processing before a response is marshalled and sent across the wire
//	rd.Elapsed = 10
//	return nil
//}

func NewCountriesListResponse( countries []response.CountryResponse) []render.Renderer {
	list := []render.Renderer{}
	for _, country := range countries {
		list = append(list, country)
	}
	return list
}

// NOTE: as a thought, the request and response payloads for an Article could be the
// same payload type, perhaps will do an example with it as well.
// type ArticlePayload struct {
//   *Article
// }

//--
// Error response payloads & renderers
//--

// ErrResponse renderer type for handling all sorts of errors.
//
// In the best case scenario, the excellent github.com/pkg/errors package
// helps reveal information on the error, setting it on Err, and in the Render()
// method, using it to set the application-specific error code in AppCode.
type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

func ErrInvalidRequest(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 400,
		StatusText:     "Invalid request.",
		ErrorText:      err.Error(),
	}
}

func ErrRender(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 422,
		StatusText:     "Error rendering response.",
		ErrorText:      err.Error(),
	}
}

var ErrNotFound = &ErrResponse{HTTPStatusCode: 404, StatusText: "Resource not found."}

