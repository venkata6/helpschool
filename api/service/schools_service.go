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

type SchoolsService interface {
	CreateSchools(w http.ResponseWriter, r *http.Request)
	GetSchools(w http.ResponseWriter, r *http.Request)
	DeleteSchools(w http.ResponseWriter, r *http.Request)
}

type SchoolsServiceInternal struct {
	db *pgxpool.Pool
}

func NewSchoolsService(db *pgxpool.Pool) SchoolsService {
	return &SchoolsServiceInternal{db: db}
}

// CreateCountries persists the posted Article and returns it
// back to the client as an acknowledgement.
func (a *SchoolsServiceInternal) CreateSchools(w http.ResponseWriter, r *http.Request) {
	data := &request.SchoolsRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, util.ErrInvalidRequest(err))
		return
	}
	if len(data.DistrictId) == 0 {
		render.Render(w, r, util.ErrInvalidRequest(errors.New("empty districtId")))
		return
	}
	districtId,_ := uuid.Parse(data.DistrictId)
	if _, err := a.db.Exec(context.Background(),
		`INSERT INTO helpschool.schools( school_id,name,place,address,district_id,govt_id,extra_info)
					VALUES ( $1, $2, $3, $4, $5,$6,$7)`, uuid.New(), data.Name,data.Place,data.Address,
		districtId,data.GovtId,data.ExtraInfo); err == nil {
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
	render.DefaultResponder(w, r, render.M{"status": "created"})
	//render.Status(r, http.StatusCreated)
	//render.Render(w, r, )
}
func (a *SchoolsServiceInternal) GetSchools(w http.ResponseWriter, r *http.Request) {

	var count int
	districtId := chi.URLParam(r, "districtId")
	rowCount, err := a.db.Query(context.Background(), "select count(*) as count from  helpschool.schools " +
									"where district_id = $1",districtId)
	for rowCount.Next() {
		_ = rowCount.Scan(&count)
		//checkErr(err)
	}
	rows, err := a.db.Query(context.Background(), "select name,place,address,school_id,district_id,govt_id," +
		"extra_info from helpschool.schools where district_id = $1",districtId)
	defer rows.Close()

	schools := make([]response.SchoolsResponse, count)
	i := 0
	for rows.Next() {
		// Read
		var name string
		var place string
		var address string
		var schoolId string
		var districtId string
		var govtId string
		var extraInfo string

		err = rows.Scan(&name,&place,&address,&schoolId,&districtId, &govtId,&extraInfo)
		schools[i].Schools = &dto.Schools{} // allocate space
		schools[i].Name = name
		schools[i].Place = place
		schools[i].Address = address
		schools[i].SchoolId = schoolId
		schools[i].DistrictId = districtId
		schools[i].GovtId = govtId
		schools[i].ExtraInfo = extraInfo

		if err != nil {
			return
		}
		i++
	}
	// Any errors encountered by rows.Next or rows.Scan will be returned here
	if rows.Err() != nil {
		return
	}
	if err := render.RenderList(w, r, NewSchoolsListResponse(schools)); err != nil {
		render.Render(w, r, util.ErrRender(err))
		return
	}
}

func (a *SchoolsServiceInternal) DeleteSchools(w http.ResponseWriter, r *http.Request) {
	//render.RenderList(w, r, NewCountriesListResponse(articles))
}

func NewSchoolsListResponse(schools []response.SchoolsResponse) []render.Renderer {
	list := []render.Renderer{}
	for _, school := range schools {
		list = append(list, school)
	}
	return list
}
