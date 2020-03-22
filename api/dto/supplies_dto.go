package dto

type Supplies struct {
	SupplyId    string `json:"supply_id"`
	Title       string `json:"title"`
	CountryId   string `json:"country_id"`
	Url         string `json:"url"`
	Description string `json:"description"`
	ExtraInfo   string `json:"extra_info"`
}
