package response

import (
	"github.com/venkata6/helpschool/api/dto"
	"net/http"
)

type StatesResponse struct {
	*dto.States
}

func (rd StatesResponse) Render(w http.ResponseWriter, r *http.Request) error {
	// Pre-processing before a response is marshalled and sent across the wire
	return nil
}
