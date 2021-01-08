import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSock } from "../hooks/useSock";
import { CodeBox } from "../components/CodeBox";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

interface Params {
  code: string;
}

interface Player {
  color: string;
  username: string;
}

export interface Position {
  username: string;
  color: string;
  position: number;
}

interface StartGame {
  text: string;
  positions: Position[];
}

const colors = ["red", "green", "blue", "yellow", "purple"];
const color = colors[Math.floor(Math.random() * colors.length)];
const names = [
  "Bob",
  "The Bobz",
  "Big Bob",
  "BOOOOOOOOOOOOOOOOOOOOOOOOOOB",
  "Hello World",
];
const name = names[Math.floor(Math.random() * names.length)];

const GameRoom = () => {
  const { code } = useParams<Params>();
  const history = useHistory();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const socket = useSock();

  // For the game
  const [positions, setPositions] = useState<Position[]>([]);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (socket) {
      socket.on("get-room-players", (playerDetails: Player[]) => {
        console.log(playerDetails);
        setPlayers(playerDetails);
      });
      socket.emit("join-room", {
        username: name,
        color: color,
        roomCode: code,
      });

      socket.on("error-found", () => {
        history.push("/");
      });

      socket.on("start-game", (data: StartGame) => {
        setGameStarted(true);
        setPositions(data.positions);
        setText(data.text);
      });
    }
  }, [socket]);

  const startGame = () => {
    socket?.emit("start-game", {});
  };

  if (!gameStarted) {
    return (
      <div className="lobby-container">
        <div className="header">
          <h3>Gameroom {code}</h3>
          <Button
            onClick={() => {
              // Start Game
            }}
          >
            Start Game
          </Button>
        </div>

        <Table striped bordered hover variant={"dark"}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Room Code</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr style={{ color: player.color }}>
                <td>{index}</td>
                <td>{player.username}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  return <CodeBox text={text} positions={positions} name={name} />;
};

export default GameRoom;
