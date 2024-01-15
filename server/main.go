package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	. "chat_roulete/models"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var (
	wsUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	users []User  = []User{}
	rooms []*Room = []*Room{}
)

func remove[T interface{}](slice []T, s int) []T {
	new := []T{}
	for i, u := range slice {
		if i == s {
			continue
		}
		new = append(new, u)
	}
	return new
}

func WsEndpoint(w http.ResponseWriter, r *http.Request) {
	wsUpgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	conn, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("could not upgrade: %s\n", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	id, err := uuid.NewUUID()
	if err != nil {
		fmt.Printf("could not create id: %s\n", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	user := User{
		Id:   id,
		Conn: conn,
	}

	users = append(users, user)
	for _, u := range users {
		if err != nil {
			fmt.Println(err)
		}
		u.WriteMessage(fmt.Sprint("-server-online-", len(users)))
	}

	openRoom := start(&user)
	if (openRoom == &Room{}) {
		log.Fatal("Nie mozna było dołaczyć lub utworzyc pokoju")
		return
	}
	closeHandler := conn.CloseHandler()
	conn.SetCloseHandler(func(code int, text string) error {
		var index = 0
		for i, u := range users {
			if u.Id == user.Id {
				index = i
			} else {
				u.WriteMessage(fmt.Sprint("-server-online-", len(users)-1))
			}
		}

		users = remove[User](users, index)
		stop(&user, openRoom)
		openRoom.SendMessage("-server-disconected-")
		for i, r := range rooms {
			if r.User1.Id == user.Id {
				rooms[i].User1 = User{}
				break
			} else if r.User2.Id == user.Id {
				rooms[i].User2 = User{}
				break
			}
			if (rooms[i].User1.Id == User{}.Id && rooms[i].User2.Id == User{}.Id) {
				rooms = remove[*Room](rooms, i)
			}
		}
		return closeHandler(code, text)
	})

	for {
		_, m, err := conn.ReadMessage()
		msg := string(m)
		if err != nil {
			fmt.Println(err.Error())
			conn.Close()
			break
		}
		if msg == "-skip-" {
			skip(&user, openRoom)
		} else if msg == "-stop-" {
			stop(&user, openRoom)
		}

		message, cut := strings.CutPrefix(msg, "-m-")
		if openRoom.IsFull() && cut {
			if openRoom.User1.Id == user.Id {
				openRoom.User2.WriteMessage(message)
			} else {
				openRoom.User1.WriteMessage(message)
			}
		}
	}
}

func stop(user *User, room *Room) {
	room.DeleteUserFromRoom(user.Id)
}

func skip(user *User, room *Room) {
	stop(user, room)
	start(user)
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/ws", WsEndpoint)
	fmt.Println("- Server started 🎉")
	log.Fatal(http.ListenAndServe(":4500", router))
}
