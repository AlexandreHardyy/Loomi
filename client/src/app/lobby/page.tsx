"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyInterface } from "@/interface/party.interface";
import socket from "@/lib/socket";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Lobby = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [partyId, setPartyId] = useState("");
  const [players, setPlayers] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const partyId = searchParams.get("partyId");
    partyId && setPartyId(partyId);
  }, [searchParams]);

  useEffect(() => {
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

    socket.on("connect", handleConnectionChange);
    socket.on("disconnect", handleConnectionChange);
    socket.on("player-joined", handlePlayerJoined);
    socket.on("player-left", handlePlayerLeft);

    return () => {
      socket.off("connect", handleConnectionChange);
      socket.off("disconnect", handleConnectionChange);
      socket.off("player-joined", handlePlayerJoined);
      socket.off("player-left", handlePlayerLeft);
    };
  }, [partyId, players, searchParams]);

  return (
    <div className="m-10 flex flex-col items-center">
      <h1 className="font-bold text-2xl">Welcome to the lobby</h1>
      {isConnected ? <div>Your connected</div> : <div>Your not connected</div>}
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
        <Button onClick={() => socket.emit("start-game")}>
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
  );
};

export default Lobby;
