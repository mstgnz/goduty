package config

import (
	"context"
	"net/http"

	"github.com/a-h/templ"
)

func RenderView(view templ.Component, w http.ResponseWriter) error {
	return view.Render(context.Background(), w)
}
