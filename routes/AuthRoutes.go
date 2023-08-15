package routes

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"spacealert/config"
	"spacealert/databases"
	"spacealert/models"
	"spacealert/utils"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type AuthController struct {
	db  *sql.DB
	ctx context.Context
}

func NewAuthController(db *sql.DB) *AuthController {
	return &AuthController{
		db,
		context.TODO(),
	}
}

var (
	googleOauthConfig *oauth2.Config
	oauthstate        string
)

func init() {
	var err error

	googleOauthConfig = &oauth2.Config{
		ClientID:     config.Keys.GoogleClientID,
		ClientSecret: config.Keys.GoogleClientSecret,
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}

	oauthstate, err = utils.GenerateRandomString(20)

	if err != nil {
		log.Println(err.Error())
	}
}

func (ac *AuthController) Login(c *gin.Context) {
	scheme := "http://"
	if c.Request.TLS != nil {
		scheme = "https://"
	}
	googleOauthConfig.RedirectURL = scheme + c.Request.Host + "/auth/google/callback"
	c.Redirect(http.StatusTemporaryRedirect, googleOauthConfig.AuthCodeURL(oauthstate))
}

func (ac *AuthController) Callback(c *gin.Context) {

	request := c.Request

	user, err := getUserInfo(request.FormValue("state"), request.FormValue("code"))

	log.Println(user)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	generateSession(user, c, ac)
	c.Redirect(http.StatusSeeOther, "/")
}

func (ac *AuthController) User(c *gin.Context) {
	logged, user := isLoggedIn(c, ac.db)

	if !logged {
		c.String(http.StatusUnauthorized, "")
		return
	}

	c.JSON(http.StatusOK, user)
}

func (ac *AuthController) Logout(c *gin.Context) {
	loggedIn, user := isLoggedIn(c, ac.db)

	if !loggedIn {
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	_, err := ac.db.Exec(`DELETE FROM sessions WHERE email = $1`, user.Email)

	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, "")
		return
	}

	c.SetCookie("session", "", -1, "/", "localhost", false, true)
	c.Redirect(http.StatusSeeOther, "/")
}

func getUserInfo(state string, code string) (*models.User, error) {
	var user models.User

	if state != oauthstate {
		log.Println(oauthstate)
		return &models.User{}, fmt.Errorf("oauth state does not match")
	}

	token, err := googleOauthConfig.Exchange(context.TODO(), code)

	if err != nil {
		return &models.User{}, fmt.Errorf("coud not generate token")
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)

	if err != nil {
		return &models.User{}, fmt.Errorf("request to get user details failed")
	}

	defer response.Body.Close()

	err = json.NewDecoder(response.Body).Decode(&user)

	if err != nil {
		return &models.User{}, fmt.Errorf("failed reading response body: %s", err.Error())
	}

	return &user, nil
}

func generateSession(user *models.User, c *gin.Context, ac *AuthController) {
	sessionID, _ := utils.GenerateRandomString(20)

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("session", sessionID, (30 * 24 * 60 * 60), "/", "localhost", false, true)

	query := `INSERT INTO users (google_id, email, verified_email, name, given_name, family_name, picture, locale) 
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			  ON CONFLICT (google_id) DO UPDATE SET email = $2, verified_email = $3, name = $4, given_name = $5, family_name = $6, picture = $7, locale = $8`
	_, err := ac.db.Exec(query, user.GoogleID, user.Email, user.VerifiedEmail, user.Name, user.GivenName, user.FamilyName, user.Picture, user.Locale)

	if err != nil {
		log.Println(err.Error())
	}

	query = `INSERT INTO sessions (email, session_id, expires) 
			 VALUES ($1, $2, $3)
			 ON CONFLICT (id) DO UPDATE SET email = $1, session_id = $2, expires = $3`
	_, err = ac.db.Exec(query, user.Email, sessionID, time.Now().Add(time.Second*24*60*60))

	if err != nil {
		log.Println(err.Error())
	}
}

func isLoggedIn(c *gin.Context, db *sql.DB) (bool, *models.User) {
	var session models.Session
	var user models.User

	cookie, err := c.Cookie("session")

	if err != nil {
		log.Println(err.Error())
		return false, &models.User{}
	}

	err = db.Ping()
	if err != nil {
		log.Println(err.Error())
		db, err = databases.ConnectDatabase()
		if err != nil {
			log.Println(err.Error())
			return false, &models.User{}
		}
	}

	row := db.QueryRow(`SELECT id, session_id, email, expires FROM sessions WHERE session_id = $1`, cookie)
	err = row.Scan(&session.ID, &session.SessionID, &session.Email, &session.Expires)

	if err != nil {
		log.Println(err.Error())
		return false, &models.User{}
	}

	if session.Expires.Before(time.Now()) {
		c.SetCookie("session", "", -1, "/", "localhost", false, true)
		_, err := db.Exec(`DELETE FROM sessions WHERE id = $1`, session.ID)

		if err != nil {
			log.Println(err.Error())
		}

		return false, &models.User{}
	}

	row = db.QueryRow(`SELECT google_id, email, verified_email, name, given_name, family_name, picture, locale FROM users WHERE email = $1`, session.Email)
	err = row.Scan(&user.GoogleID, &user.Email, &user.VerifiedEmail, &user.Name, &user.GivenName, &user.FamilyName, &user.Picture, &user.Locale)

	if err != nil {
		log.Println("Error retrieving User", err.Error())
		return false, &models.User{}
	}

	return true, &user
}
