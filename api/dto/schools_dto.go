package dto

type Schools struct {
	Name       string `json:"name"`
	Place      string `json:"place"`
	SchoolId   string `json:"school_id"`
	Address    string `json:"address"`
	DistrictId string `json:"district_id"`
	GovtId     string `json:"govt_id"`
	ExtraInfo  string `json:"extra_info"`
}
