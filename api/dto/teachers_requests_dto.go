package dto

type TeacherRequests struct {
    Id                int `json:"id"`
    TeacherName       string `json:"teacher_name"`
	TeacherPhone      string `json:"teacher_phone"`
	TeacherEmail	  string `json:"teacher_email"`
	Url               string `json:"url"`
	QuantityNeeded    int    `json:"quantity_needed"`
    Address           string `json:"address"`
    Place             string `json:"place"`
    District          string `json:"district"`
    State             string `json:"state"`
    Country           string `json:"country"`
    ZipCode           string `json:"zipcode"`
    PhotoLink         string `json:"photo_link"`
    ExtraInfo         string `json:"extra_info"`
}
