"use client";

import { Button } from "@/components/ui/button";
import socket from "@/lib/socket";
import Link from "next/link";
import { useEffect } from "react";

const Result = () => {
  useEffect(() => {}, []);

  return (
    <div>
      <div>Game is finished</div>
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
