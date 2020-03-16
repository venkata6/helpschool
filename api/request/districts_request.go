package request

import "net/http"

type DistrictsRequest struct {
	Name      	string `json:"name"`
	StateId 	string `json:"state_id"`
	GovtId		string `json:"govt_id"`
	ExtraInfo   string `json:"extra_info"`

}

func (a *DistrictsRequest) Bind(r *http.Request) error {
	return nil
}
