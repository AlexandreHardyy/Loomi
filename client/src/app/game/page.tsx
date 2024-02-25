"use client";

import Result from "@/components/Result";
import { Button } from "@/components/ui/button";
import { QuestionInterface } from "@/interface/question.interface";
import socket from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Game = () => {
  const [question, setQuestion] = useState<QuestionInterface>();
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<string[]>([]);
  const [gameisFinished, setGameisFinished] = useState(false);
  const [result, setResult] = useState();
  const router = useRouter();

  useEffect(() => {
    socket.emit("ready-for-game");

    socket.on("next-question", (data: any) => {
      setQuestion(data.question);
      setAlreadyAnswered(false);
      setSelectedResponse([]);
    });

    socket.on("game-finished", (data: any) => {
      setResult(data);
      setGameisFinished(true);
    });

    socket.on(
      "player-answered",
      (data: { totalAnswers: number; totalPlayers: number }) => {
        setTotalAnswers(data.totalAnswers);
        setTotalPlayers(data.totalPlayers);
      },
    );

    return () => {
      socket.off("all-players-ready");
      socket.off("next-question");
      socket.off("game-finished");
    };
  }, [router]);

  const handleResponse = () => {
    if (!alreadyAnswered) {
      socket.emit("play", {
        response: selectedResponse,
      });
      setAlreadyAnswered(true);
      setQuestion(undefined);
      setSelectedResponse([]);
    }
  };

  if (gameisFinished) {
    return <Result result={result} />;
  }

  return (
    <div>
      {question ? (
        <div className="m-10 flex flex-col justify-center gap-6">
          <h2 className="text-2xl font-bold">{question.name}</h2>
          <div className="grid gap-2 grid-cols-2 grid-rows-2">
            {question.availableResponses.map(
              (response: string, index: number) => (
                <div
                  onClick={() => {
                    setSelectedResponse([...selectedResponse, response]);
                  }}
                  className="p-2 bg-primary col-span-1 row-span-1 rounded"
                  key={index}
                >
                  {response} {selectedResponse.includes(response) && "✅"}
                </div>
              ),
            )}
          </div>
          <Button onClick={handleResponse}>Play</Button>
        </div>
      ) : (
        <>
          <div>Waiting for the next question</div>
          <div>
            {totalAnswers} of {totalPlayers} already vote
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
