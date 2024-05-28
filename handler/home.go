package handler

import (
	"net/http"

	"github.com/mstgnz/goduty/config"
	"github.com/mstgnz/goduty/view/page"
)

type HomeHandler struct{}

func (h HomeHandler) Index(w http.ResponseWriter, _ *http.Request) error {
	return config.RenderView(page.Home("welcome"), w)
}
