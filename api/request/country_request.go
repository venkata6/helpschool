package request

import "net/http"

type CountryRequest struct {
	Name      string `json:"name"`
}

func (a *CountryRequest) Bind(r *http.Request) error {
	return nil
}
