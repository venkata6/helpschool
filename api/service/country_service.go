package service

import (
	"context"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/venkata6/helpschool/api/dto"
	"github.com/venkata6/helpschool/api/request"
	"github.com/venkata6/helpschool/api/response"
	"github.com/venkata6/helpschool/api/util"
	"net/http"
)

type CountriesService interface {
	CreateCountries(w http.ResponseWriter, r *http.Request)
	GetCountries(w http.ResponseWriter, r *http.Request)
	DeleteCountries(w http.ResponseWriter, r *http.Request)
}

type CountriesServiceInternal struct {
	db *pgxpool.Pool
}

func NewCountriesService(db *pgxpool.Pool) CountriesService {
	return &CountriesServiceInternal{db: db}
}

// CreateCountries persists the posted Article and returns it
// back to the client as an acknowledgement.
func (a *CountriesServiceInternal) CreateCountries(w http.ResponseWriter, r *http.Request) {
	data := &request.CountryRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, util.ErrInvalidRequest(err))
		return
	}

	if _, err := a.db.Exec(context.Background(), `INSERT INTO helpschool.countries( country_id,name)
					VALUES ( $1, $2)`, uuid.New(), data.Name); err == nil {
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
	render.DefaultResponder(w, r, render.M{"status": "created"})
	//render.Status(r, http.StatusCreated)
	//render.Render(w, r, )
}
func (a *CountriesServiceInternal) GetCountries(w http.ResponseWriter, r *http.Request) {

	var count int
	rowCount, err := a.db.Query(context.Background(), "select count(*) as count from  helpschool.countries")
	for rowCount.Next() {
		_ = rowCount.Scan(&count)
		//checkErr(err)
	}
	rows, err := a.db.Query(context.Background(), "select name,country_id from helpschool.countries")
	defer rows.Close()

	countries := make([]response.CountryResponse, count)
	i := 0
	for rows.Next() {
		// Read
		var name string
		var country_id string

		err = rows.Scan(&name, &country_id)
		countries[i].Country = &dto.Country{} // allocate space
		countries[i].Name = name
		countries[i].CountryId = country_id
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
		render.Render(w, r, util.ErrRender(err))
		return
	}
}

// DeleteCountries searches the Articles data for a matching article.
// It's just a stub, but you get the idea.
func (a *CountriesServiceInternal) DeleteCountries(w http.ResponseWriter, r *http.Request) {
	//render.RenderList(w, r, NewCountriesListResponse(articles))
}

func NewCountriesListResponse(countries []response.CountryResponse) []render.Renderer {
	list := []render.Renderer{}
	for _, country := range countries {
		list = append(list, country)
	}
	return list
}
