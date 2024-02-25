"use client";

import { Button } from "@/components/ui/button";
import socket from "@/lib/socket";
import Link from "next/link";
import { useEffect } from "react";

const Result = ({ result }: any) => {
  useEffect(() => {}, []);

  Object.values(result.players).map((player: any) => {
    console.log(player);
  });

  return (
    <div className="m-10">
      <div>Game is finished</div>
      <div>
        <h2>Result : </h2>
        {Object.values(result.players).map((player: any) => (
          <div key={player.id} className="flex gap-2">
            <span>{player.username}</span>
            <span>{player.score}</span>
          </div>
        ))}
      </div>
      <Button
        asChild
        onClick={() => {
          socket.disconnect();
        }}
      >
        <Link href="/">Go back to home</Link>
      </Button>
    </div>
  );
};

export default Result;
