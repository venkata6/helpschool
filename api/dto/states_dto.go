package dto

type States struct {
	Name      string `json:"name"`
	StateId   string `json:"state_id"`
	CountryId string `json:"country_id"`
	GovtId    string `json:"govt_id"`
	ExtraInfo string `json:"extra_info"`
}
