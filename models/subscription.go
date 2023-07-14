package models

type Status struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Abbrev      string `json:"abbrev"`
	Description string `json:"description"`
}

type Subscription struct {
	Users    []string `json:"users"`
	LaunchID string   `json:"launch_id"`
	Status   Status   `json:"status"`
}
