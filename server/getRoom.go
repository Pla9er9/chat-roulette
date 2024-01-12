package main

import (
	m "chat_roulete/models"
	"fmt"

	"github.com/google/uuid"
)

func start(user *m.User) *m.Room {
	if len(rooms) == 0 {
		r, err := CreateRoom(*user)
		if err != nil {
			fmt.Println(err)
			return nil
		}
		rooms = append(rooms, r)
		return r
	} else {
		for i := 0; i < len(rooms); i++ {
			if !rooms[i].IsFull() && !was(user.UsersMetIds, rooms[i].User1.Id) {
				JoinRoom(rooms[i], *user)
				return rooms[i]
			}
		}
		r, err := CreateRoom(*user)
		if err != nil {
			fmt.Println(err.Error())
			return nil
		}
		rooms = append(rooms, r)
		return r
	}
}

func was(arr []uuid.UUID, id uuid.UUID) bool {
	for _, _id := range arr {
		if (_id == id) {
			return true
		}
	}
	return false
}

func getActiveUserFromRoom(room m.Room) m.User {
	if (room.User1.Id == m.User{}.Id) {
		return room.User2
	}
	return room.User1
}
