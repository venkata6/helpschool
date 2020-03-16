package request

import "net/http"

type SuppliesRequest struct {
	Title       string `json:"title"`
	CountryId   string `json:"country_id"`
	Url         string `json:"url"`
	Description string `json:"description"`
	ExtraInfo   string `json:"extra_info"`
}

func (a *SuppliesRequest) Bind(r *http.Request) error {
	return nil
}
