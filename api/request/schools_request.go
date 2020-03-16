package request

import "net/http"

type SchoolsRequest struct {
	Name      	string `json:"name"`
	Place		string `json:"place"`
	Address 	string `json:"address"`
	DistrictId 	string `json:"district_id"`
	GovtId		string `json:"govt_id"`
	ExtraInfo   string `json:"extra_info"`

}

func (a *SchoolsRequest) Bind(r *http.Request) error {
	return nil
}
