package repository

type Event struct {
	EventID   string `gorm:"primarykey"`
	Title     string `json:"title" gorm:"column:title"`
	Detail    string `json:"detail" gorm:"column:detail"`
	HostToken string `gorm:"column:host_token"`
}

type EventUser struct {
	ID       uint   `gorm:"primarykey"`
	EventID  uint   `gorm:"column:event_id"`
	UserName string `gorm:"column:user_name"`
}

type EventTimeslot struct {
	EventTimeslotID uint   `gorm:"primarykey"`
	EventID         string `gorm:"column:event_id"`
	Description     string `gorm:"column:description"`
}
