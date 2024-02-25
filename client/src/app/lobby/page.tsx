"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PartyInterface } from "@/interface/party.interface";
import socket from "@/lib/socket";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Lobby = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [partyId, setPartyId] = useState("");
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const partyId = searchParams.get("partyId");
    partyId && setPartyId(partyId);
  }, [searchParams]);

  useEffect(() => {
    socket.connect();

    const handleConnectionChange = () => {
      setIsConnected(socket.connected);
      if (socket.connected && !partyId) {
        socket.emit(
          "create-party",
          { username: "El Creator" },
          (response: PartyInterface) => {
            setPartyId(response.partyId);
            setPlayers(response.players);
          },
        );
      } else if (socket.connected && partyId) {
        socket.emit(
          "join-party",
          { partyId, username: searchParams.get("username") ?? "no-name" },
          (response: { status: string; partyId: string; players: any }) => {
            setPlayers(response.players);
          },
        );
      } else {
        toast.error("You are not connected to the server");
      }
    };

    const handlePlayerJoined = (data: { partyId: string; players: any }) => {
      setPlayers(data.players);
    };

    const handlePlayerLeft = (player: any) => {
      setPlayers((prevPlayers) => {
        delete prevPlayers[player.id];
        return { ...prevPlayers };
      });
    };

    const handlePartyStarted = () => {
      router.push("/game");
    };

    const handleNewMessage = (message: any) => {
      setMessages([...messages, message]);
      console.log(messages);
    };

    socket.on("connect", handleConnectionChange);
    socket.on("disconnect", handleConnectionChange);
    socket.on("player-joined", handlePlayerJoined);
    socket.on("player-left", handlePlayerLeft);
    socket.on("party-started", handlePartyStarted);
    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("connect", handleConnectionChange);
      socket.off("disconnect", handleConnectionChange);
      socket.off("player-joined", handlePlayerJoined);
      socket.off("player-left", handlePlayerLeft);
      socket.off("party-started", handlePartyStarted);
      socket.off("new-message", handleNewMessage);
    };
  }, [messages, partyId, players, router, searchParams]);

  return (
    <div className="m-10 flex gap-4">
      <div className="flex-1 flex flex-col items-center">
        <h1 className="font-bold text-2xl">Welcome to the lobby</h1>
        {isConnected ? (
          <div>Your connected</div>
        ) : (
          <div>Your not connected</div>
        )}
        <div className="flex flex-col items-center">
          <div className="font-bold">Party ID:</div>
          <div> {partyId}</div>
        </div>
        <div className="m-10">
          <div className="font-bold mb-3">Players :</div>
          <div className="flex gap-3">
            {Object.values(players).map((player: any) => (
              <Card key={player.id}>
                <CardHeader>
                  <CardTitle>{player.username}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>{player.ready ? "Ready" : "Not Ready yet"}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => socket.emit("start-party", { partyId: partyId })}
          >
            Start the party
          </Button>
          <Button
            variant={"outline"}
            onClick={() => {
              socket.disconnect();
              router.push("/");
            }}
          >
            Leave the party
          </Button>
        </div>
      </div>
      <div className="border w-[300px] h-[70vh] overflow-scroll">
        <div className="font-bold text-2xl text-center mt-2">Chat</div>
        <div className="m-4">
          <div>
            {messages.map((message: any, index: number) => (
              <div key={index} className="flex flex-col mb-2">
                <div className="font-bold">{message.player.username}</div>
                <div className="italic">{message.message}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              value={message}
              type="text"
              placeholder="Type a message"
            />
            <Button
              onClick={() => {
                socket.emit("send-message", { partyId, message });
                setMessage("");
              }}
            >
              Send a message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
