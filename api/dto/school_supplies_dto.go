package dto

import "time"

type SchoolSupplies struct {
	Title 		   string `json:"title"`
	Description    string `json:"description"`
	Url 		   string `json:"url"`
	SchoolId       string `json:"school_id"`
	SupplyId       string `json:"supply_id"`
	Quantity       string `json:"quantity"`
	FulfilledCount string `json:"fulfilled_count"`
	ExtraInfo      string `json:"extra_info"`
	PostedDate	   time.Time `json:"posted_date"`
}
