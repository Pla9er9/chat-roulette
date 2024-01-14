package models

import (
	"github.com/google/uuid"
)

type Room struct {
	Id    uuid.UUID
	User1 User
	User2 User
}

func (r *Room) IsFull() bool {
	return r.User1.Id != User{}.Id && r.User2.Id != User{}.Id
}

func (r *Room) SendMessage(msg string) {
	if (r.User1.Id != User{}.Id) {
		r.User1.WriteMessage(msg)
	}
	if (r.User2.Id != User{}.Id) {
		r.User2.WriteMessage(msg)
	}
}

func (r *Room) DeleteUserFromRoom(userId uuid.UUID) {
	r.SendMessage("-server-disconected-")
	if r.User1.Id == userId {
		r.User1 = User{}
	} else if r.User2.Id == userId {
		r.User2 = User{}
	}
}
