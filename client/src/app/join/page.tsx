"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";

const JoinLobby: React.FC = () => {
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div className="m-10 flex flex-col items-center gap-3">
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Enter the party Id"
      />
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter a username"
      />
      <Button asChild>
        <Link href={`/lobby?partyId=${search}&username=${username}`}>
          Join the party
        </Link>
      </Button>
    </div>
  );
};

export default JoinLobby;
