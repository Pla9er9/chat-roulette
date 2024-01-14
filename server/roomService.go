package main

import (
	. "chat_roulete/models"
	"fmt"
	"github.com/google/uuid"
)

func CreateRoom(creator User) (*Room, error) {
	id, err := uuid.NewUUID()
	if err != nil {
		return &Room{}, fmt.Errorf("server error")
	}
	return &Room{
		Id:    id,
		User1: creator,
		User2: User{},
	}, nil
}

func JoinRoom(room *Room, user User) error {
	if room.IsFull() {
		return fmt.Errorf("room is full already")
	}
	if (room.User1.Id == User{}.Id) {
		room.User1 = user
	} else if (room.User2.Id == User{}.Id) {
		room.User2 = user
	} else {
		return fmt.Errorf("room doesnt has one user")
	}
	if room.IsFull() {
		room.SendMessage("-server-found-")
	}
	return nil
}
