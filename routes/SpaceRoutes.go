package routes

import (
	"context"
	"database/sql"

	"github.com/gin-gonic/gin"
)

type SpaceController struct {
	db  *sql.DB
	ctx context.Context
}

func NewSpaceController(db *sql.DB) *SpaceController {
	return &SpaceController{
		db,
		context.TODO(),
	}
}

func (sc *SpaceController) GetUpcomingLaunches(c *gin.Context) {
	
}