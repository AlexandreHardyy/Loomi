"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";

const JoinLobby: React.FC = () => {
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div>
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Enter search term"
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
