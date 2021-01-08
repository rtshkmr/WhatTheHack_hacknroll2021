import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSock } from "../hooks/useSock";
import Table from "react-bootstrap/Table";

interface Room {
  roomCode: string;
  size: number;
}
const Home = () => {
  const socket = useSock();
  const [rooms, setRooms] = useState<Room[]>([]);
  const history = useHistory();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected");
        socket.emit("rooms");
      });

      socket.on("rooms", (data: Room[]) => {
        console.log(data);
        setRooms(data);
      });
    }
  }, [socket]);

  const onCreate = () => {
    socket?.on("create-room", (roomCode: string) => {
      history.push(`/room/${roomCode}`);
    });

    socket?.emit("create-room");
  };

  // @ts-ignore
  return (
      <div>
        <h1 className={"center"}>Available Rooms</h1>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>S/N</th>
            <th>Host</th>
            <th>Capacity</th>
          </tr>
          </thead>
          <tbody>
          {
            rooms.map((room, index) =>
                <tr>
                  <td>{index}</td>
                  <td>{room.roomCode}</td>
                  <td>{room.size} / 5</td>
                </tr>
            )
          }
          </tbody>
        </Table>

      <button onClick={onCreate}>Create Room</button>
    </div>
  );
};

export default Home;
