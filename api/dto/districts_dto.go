package dto

type Districts struct {
	Name       string `json:"name"`
	DistrictId string `json:"district_id"`
	StateId    string `json:"state_id"`
	GovtId     string `json:"govt_id"`
	ExtraInfo  string `json:"extra_info"`
}
