package service

import (
	"context"
	"errors"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/venkata6/helpschool/api/dto"
	"github.com/venkata6/helpschool/api/request"
	"github.com/venkata6/helpschool/api/response"
	"github.com/venkata6/helpschool/api/util"
	"net/http"
)

type SuppliesService interface {
	CreateSupplies(w http.ResponseWriter, r *http.Request)
	GetSupplies(w http.ResponseWriter, r *http.Request)
	DeleteSupplies(w http.ResponseWriter, r *http.Request)
}

type SuppliesServiceInternal struct {
	db *pgxpool.Pool
}

func NewSuppliesService(db *pgxpool.Pool) SuppliesService {
	return &SuppliesServiceInternal{db: db}
}

// CreateCountries persists the posted Article and returns it
// back to the client as an acknowledgement.
func (a *SuppliesServiceInternal) CreateSupplies(w http.ResponseWriter, r *http.Request) {
	data := &request.SuppliesRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, util.ErrInvalidRequest(err))
		return
	}
	if len(data.CountryId) == 0 {
		render.Render(w, r, util.ErrInvalidRequest(errors.New("empty CountryId")))
		return
	}
	id, _ := uuid.Parse(data.CountryId)

	if _, err := a.db.Exec(context.Background(),
		`INSERT INTO helpschool.supplies( supply_id,title,country_id,url,description,extra_info)
					VALUES ( $1, $2, $3, $4, $5,$6)`, uuid.New(), data.Title, id,
		data.Url, data.Description, data.ExtraInfo); err == nil {
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
	render.DefaultResponder(w, r, render.M{"status": "created"})
	//render.Status(r, http.StatusCreated)
	//render.Render(w, r, )
}
func (a *SuppliesServiceInternal) GetSupplies(w http.ResponseWriter, r *http.Request) {

	var count int
	rowCount, err := a.db.Query(context.Background(), "select count(*) as count from  helpschool.supplies")
	for rowCount.Next() {
		_ = rowCount.Scan(&count)
		//checkErr(err)
	}
	rows, err := a.db.Query(context.Background(), "select supply_id,title,country_id,url,description,extra_info from helpschool.supplies")
	defer rows.Close()

	supplies := make([]response.SuppliesResponse, count)
	i := 0
	for rows.Next() {
		// Read
		var title string
		var supplyId string
		var countryId string
		var url string
		var description string
		var extraInfo string

		err = rows.Scan(&supplyId, &title, &countryId, &url, &description, &extraInfo)
		supplies[i].Supplies = &dto.Supplies{} // allocate space
		supplies[i].Title = title
		supplies[i].SupplyId = supplyId
		supplies[i].CountryId = countryId
		supplies[i].Url = url
		supplies[i].Description = description
		supplies[i].ExtraInfo = extraInfo

		if err != nil {
			return
		}
		i++
	}
	// Any errors encountered by rows.Next or rows.Scan will be returned here
	if rows.Err() != nil {
		return
	}
	if err := render.RenderList(w, r, NewSuppliesListResponse(supplies)); err != nil {
		render.Render(w, r, util.ErrRender(err))
		return
	}
}

func (a *SuppliesServiceInternal) DeleteSupplies(w http.ResponseWriter, r *http.Request) {
	//render.RenderList(w, r, NewCountriesListResponse(articles))
}

func NewSuppliesListResponse(supplies []response.SuppliesResponse) []render.Renderer {
	list := []render.Renderer{}
	for _, supply := range supplies {
		list = append(list, supply)
	}
	return list
}
