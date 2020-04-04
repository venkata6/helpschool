package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/venkata6/helpschool/api/dto"
	"github.com/venkata6/helpschool/api/request"
	"github.com/venkata6/helpschool/api/response"
	"github.com/venkata6/helpschool/api/util"
	"net/http"
)

type StatesService interface {
	CreateStates(w http.ResponseWriter, r *http.Request)
	GetStates(w http.ResponseWriter, r *http.Request)
	DeleteStates(w http.ResponseWriter, r *http.Request)
}

type StatesServiceInternal struct {
	db *pgxpool.Pool
}

func NewStatesService(db *pgxpool.Pool) StatesService {
	return &StatesServiceInternal{db: db}
}

// CreateCountries persists the posted Article and returns it
// back to the client as an acknowledgement.
func (a *StatesServiceInternal) CreateStates(w http.ResponseWriter, r *http.Request) {
	data := &request.StatesRequest{}
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
		`INSERT INTO helpschool.states( state_id,name,country_id,govt_id,extra_info)
					VALUES ( $1, $2, $3, $4, $5)`, uuid.New(), data.Name,
		id, data.GovtId, data.ExtraInfo); err == nil {
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
	render.DefaultResponder(w, r, render.M{"status": "created"})
	//render.Status(r, http.StatusCreated)
	//render.Render(w, r, )
}
func (a *StatesServiceInternal) GetStates(w http.ResponseWriter, r *http.Request) {

	var count int
	rowCount, err := a.db.Query(context.Background(), "select count(*) as count from  helpschool.states")
	for rowCount.Next() {
		_ = rowCount.Scan(&count)
		//checkErr(err)
	}
	rows, err := a.db.Query(context.Background(), "select name,state_id,country_id,govt_id,extra_info from helpschool.states")
	defer rows.Close()
	states := make([]response.StatesResponse, count)
	i := 0
	for rows.Next() {
		// Read
		var name string
		var stateId string
		var countryId string
		var govtId string
		var extraInfo string

		err = rows.Scan(&name, &stateId, &countryId, &govtId, &extraInfo)
		states[i].States = &dto.States{} // allocate space
		states[i].Name = name
		states[i].StateId = stateId
		states[i].CountryId = countryId
		states[i].GovtId = govtId
		states[i].ExtraInfo = extraInfo

		if err != nil {
			fmt.Printf("Error doing 'scan' states -  %v  \n",  err )
			return
		}
		i++
	}
	// Any errors encountered by rows.Next or rows.Scan will be returned here
	if rows.Err() != nil {
		fmt.Printf("Error doing 'select' states -  %v  %v \n", rows.Err(), err )
		return
	}
	if err := render.RenderList(w, r, NewStatesListResponse(states)); err != nil {
		render.Render(w, r, util.ErrRender(err))
		return
	}
}

func (a *StatesServiceInternal) DeleteStates(w http.ResponseWriter, r *http.Request) {
	//render.RenderList(w, r, NewCountriesListResponse(articles))
}

func NewStatesListResponse(states []response.StatesResponse) []render.Renderer {
	list := []render.Renderer{}
	for _, state := range states {
		list = append(list, state)
	}
	return list
}
