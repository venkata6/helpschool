package service

import (
	"context"
	"errors"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/venkata6/helpschool/api/dto"
	"github.com/venkata6/helpschool/api/request"
	"github.com/venkata6/helpschool/api/response"
	"github.com/venkata6/helpschool/api/util"
	"net/http"
)

type DistrictsService interface {
	CreateDistricts(w http.ResponseWriter, r *http.Request)
	GetDistricts(w http.ResponseWriter, r *http.Request)
	DeleteDistricts(w http.ResponseWriter, r *http.Request)
}

type DistrictsServiceInternal struct {
	db *pgxpool.Pool
}

func NewDistrictsService(db *pgxpool.Pool) DistrictsService {
	return &DistrictsServiceInternal{db: db}
}

// CreateCountries persists the posted Article and returns it
// back to the client as an acknowledgement.
func (a *DistrictsServiceInternal) CreateDistricts(w http.ResponseWriter, r *http.Request) {
	data := &request.DistrictsRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, util.ErrInvalidRequest(err))
		return
	}
	if len(data.StateId) == 0 {
		render.Render(w, r, util.ErrInvalidRequest(errors.New("empty stateId")))
		return
	}
	stateId, _ := uuid.Parse(data.StateId)
	if _, err := a.db.Exec(context.Background(),
		`INSERT INTO helpschool.districts( district_id,name,state_id,govt_id,extra_info)
					VALUES ( $1, $2, $3, $4, $5)`, uuid.New(), data.Name,
		stateId, data.GovtId, data.ExtraInfo); err == nil {
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
	render.DefaultResponder(w, r, render.M{"status": "created"})
	//render.Status(r, http.StatusCreated)
	//render.Render(w, r, )
}
func (a *DistrictsServiceInternal) GetDistricts(w http.ResponseWriter, r *http.Request) {

	var count int
	stateId := chi.URLParam(r, "stateId")

	rowCount, err := a.db.Query(context.Background(), "select count(*) as count from  helpschool.districts where state_id = $1", stateId)
	for rowCount.Next() {
		_ = rowCount.Scan(&count)
		//checkErr(err)
	}
	if count > 0 && err == nil {
		rows, err := a.db.Query(context.Background(), "select name,district_id,state_id,govt_id,extra_info from helpschool.districts where state_id = $1", stateId)
		defer rows.Close()

		districts := make([]response.DistrictsResponse, count)
		i := 0
		for rows.Next() {
			// Read
			var name string
			var districtId string
			var stateId string
			var govtId string
			var extraInfo string

			err = rows.Scan(&name, &districtId, &stateId, &govtId, &extraInfo)
			districts[i].Districts = &dto.Districts{} // allocate space
			districts[i].Name = name
			districts[i].DistrictId = districtId
			districts[i].StateId = stateId
			districts[i].GovtId = govtId
			districts[i].ExtraInfo = extraInfo

			if err != nil {
				return
			}
			i++
		}
		// Any errors encountered by rows.Next or rows.Scan will be returned here
		if rows.Err() != nil {
			return
		}

		if err := render.RenderList(w, r, NewDistrictsListResponse(districts)); err != nil {
			render.Render(w, r, util.ErrRender(err))
			return
		}
	} else {
		if err := render.RenderList(w, r, NewDistrictsListResponse(nil)); err != nil {
			render.Render(w, r, util.ErrRender(err))
			return
		}
	}
}

func (a *DistrictsServiceInternal) DeleteDistricts(w http.ResponseWriter, r *http.Request) {
	//render.RenderList(w, r, NewCountriesListResponse(articles))
}

func NewDistrictsListResponse(districts []response.DistrictsResponse) []render.Renderer {
	list := []render.Renderer{}
	for _, district := range districts {
		list = append(list, district)
	}
	return list
}
