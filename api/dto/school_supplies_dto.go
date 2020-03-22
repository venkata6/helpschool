package dto

type SchoolSupplies struct {
	SchoolId       string `json:"school_id"`
	SupplyId       string `json:"supply_id"`
	Quantity       string `json:"quantity"`
	FulfilledCount string `json:"fulfilled_count"`
	ExtraInfo      string `json:"extra_info"`
}
