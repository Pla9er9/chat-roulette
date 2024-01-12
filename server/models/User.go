package models

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type User struct {
	Id          uuid.UUID
	Conn        *websocket.Conn
	UsersMetIds []uuid.UUID
}


func (u *User) WriteMessage(msg string) {
	u.Conn.WriteMessage(websocket.TextMessage, []byte(msg))
}