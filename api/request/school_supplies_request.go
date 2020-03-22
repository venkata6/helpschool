package request

import "net/http"

type SchoolSuppliesRequest struct {
	SchoolId       string `json:"school_id"`
	SupplyId       string `json:"supply_id"`
	Quantity       string `json:"quantity"`
	FulfilledCount string `json:"fulfilled_count"`
	ExtraInfo      string `json:"extra_info"`
}

func (a *SchoolSuppliesRequest) Bind(r *http.Request) error {
	return nil
}
