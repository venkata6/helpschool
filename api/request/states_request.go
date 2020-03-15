package request

import "net/http"

type StatesRequest struct {
	Name      	string `json:"name"`
	CountryId 	string `json:"country_id"`
	GovtId		string `json:"govt_id"`
	ExtraInfo   string `json:"extra_info"`

}

func (a *StatesRequest) Bind(r *http.Request) error {
	return nil
}
