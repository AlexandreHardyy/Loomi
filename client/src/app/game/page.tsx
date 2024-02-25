"use client";

import GameStartSoon from "@/components/GameStartSoon";
import QuestionStartSoon from "@/components/QuestionStartSoon";
import Result from "@/components/Result";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  const [ready, setReady] = useState(false);
  const [readyComponent, setReadyComponent] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      socket.emit("ready-for-game");
      setReady(true);
    }, 5000);

    socket.on("get-ready-question", () => {
      setReadyComponent(true);
    });

    socket.on("next-question", (data: any) => {
      setQuestion(data.question);
      setAlreadyAnswered(false);
      setSelectedResponse([]);
      setReadyComponent(false);
      setupTimer(data.question.timeInSeconds);
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
      socket.off("player-answered");
      socket.off("get-ready-question");
    };
  }, [router]);

  const setupTimer = (timeInSeconds: number) => {
    setProgress(0);
    const newTimer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(newTimer);
          return 100;
        }
        return prevProgress + 100 / timeInSeconds;
      });
    }, 1000);

    setTimer(newTimer);
  };

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

  if (!ready) {
    return <GameStartSoon />;
  }

  if (readyComponent) {
    return <QuestionStartSoon />;
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
          <Progress value={progress} />
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
