package service

import (
	"context"
	"errors"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/venkata6/helpschool/api/dto"
	"github.com/venkata6/helpschool/api/request"
	"github.com/venkata6/helpschool/api/response"
	"github.com/venkata6/helpschool/api/util"
	"net/http"
	"strconv"
)

type TeachersRequestService interface {
	CreateTeachersRequest(w http.ResponseWriter, r *http.Request)
	GetTeachersRequest(w http.ResponseWriter, r *http.Request)
	DeleteTeachersRequest(w http.ResponseWriter, r *http.Request)
}

type TeachersRequestServiceInternal struct {
	db *pgxpool.Pool
}

func NewTeachersRequestService(db *pgxpool.Pool) TeachersRequestService {
	return &TeachersRequestServiceInternal{db: db}
}

// CreateCountries persists the posted Article and returns it
// back to the client as an acknowledgement.
func (a *TeachersRequestServiceInternal) CreateTeachersRequest(w http.ResponseWriter, r *http.Request) {
	data := &request.TeachersSuppliesRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, util.ErrInvalidRequest(err))
		return
	}

	// Validate the form data
	if len(data.Url) == 0 || data.QuantityNeeded == 0  {
		render.Render(w, r, util.ErrInvalidRequest(errors.New("empty product url OR quantity needed is zero")))
		return
	}
	if len(data.TeacherName) == 0 || len(data.TeacherPhone) == 0  {
		render.Render(w, r, util.ErrInvalidRequest(errors.New("empty TeacherName or TeacherPhone")))
		return
	}
	if len(data.Address) == 0 || len(data.District) == 0 || len(data.Place) == 0 || len(data.State) == 0    {
		render.Render(w, r, util.ErrInvalidRequest(errors.New("empty Address,place, district  or state")))
		return
	}
	// Validate the form data

	if _, err := a.db.Exec(context.Background(),
		`INSERT INTO helpschool.teacher_requests( teacher_name,teacher_phone,teacher_email,url,quantity_needed,address,place,district,state,country,zipcode,extra_info,photo_link)
					VALUES ( $1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13)`, data.TeacherName,data.TeacherPhone,data.TeacherEmail,data.Url,data.QuantityNeeded,data.Address,data.Place,
					        data.District,data.State,data.Country,data.ZipCode,data.ExtraInfo,data.PhotoLink); err == nil {
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		render.DefaultResponder(w, r, render.M{"status": "error: not created"})
	}
	render.DefaultResponder(w, r, render.M{"status": "created"})
	//render.Status(r, http.StatusCreated)
	//render.Render(w, r, )
}
func (a *TeachersRequestServiceInternal) GetTeachersRequest(w http.ResponseWriter, r *http.Request) {

	id := chi.URLParam(r, "id")
	if len(id) == 0 {
		render.Render(w, r, util.ErrInvalidRequest(errors.New("empty id , id cant be null")))
		return
	}
	rowId,_ := strconv.Atoi(id) // convert to integer
	rows, err := a.db.Query(context.Background(), "select id,teacher_name,teacher_phone,teacher_email,url,quantity_needed,address,place,district,state,country,zipcode,extra_info,photo_link from helpschool.teacher_requests where id =$1",rowId)
	defer rows.Close()
	// Any errors encountered by rows.Next or rows.Scan will be returned here
	if rows.Err() != nil {
		render.Render(w, r, util.ErrRender(errors.New("database error")))
		return
	}

	// let us keep it as array for now as later on GET may return mulitiple records .. here it returns just one
	rows.Next(); // get the row
	teachersSupplies := make([]response.TeachersSuppliesResponse, 1)
	teachersSupplies[0].TeacherRequests = &dto.TeacherRequests{}

    i := 0  // only one object here as we queried by ID

	err = rows.Scan(&teachersSupplies[i].Id,&teachersSupplies[i].TeacherName,&teachersSupplies[i].TeacherPhone,&teachersSupplies[i].TeacherEmail,&teachersSupplies[i].Url,&teachersSupplies[i].QuantityNeeded,
                   &teachersSupplies[i].Address,&teachersSupplies[i].Place,&teachersSupplies[i].District,&teachersSupplies[i].State,&teachersSupplies[i].Country,
                   &teachersSupplies[i].ZipCode,&teachersSupplies[i].ExtraInfo,&teachersSupplies[i].PhotoLink)
    if err != nil {
        return
    }
	if err := render.RenderList(w, r, NewTeachersSuppliesResponse(teachersSupplies)); err != nil {
		render.Render(w, r, util.ErrRender(err))
		return
	}
}

func (a *TeachersRequestServiceInternal) DeleteTeachersRequest(w http.ResponseWriter, r *http.Request) {
	//render.RenderList(w, r, NewCountriesListResponse(articles))
}

func NewTeachersSuppliesResponse(teachersSupplies []response.TeachersSuppliesResponse) []render.Renderer {
	list := []render.Renderer{}
	for _, teachersSupply := range teachersSupplies {
		list = append(list, teachersSupply)
	}
	return list
}
