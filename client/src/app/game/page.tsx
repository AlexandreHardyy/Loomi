"use client";

import GameStartSoon from "@/components/GameStartSoon";
import QuestionStartSoon from "@/components/QuestionStartSoon";
import Result from "@/components/Result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionInterface } from "@/interface/question.interface";
import socket from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [timer, setTimer] = useState<number>();
  const [voteProposition, setVoteProposition] = useState(false);
  const [newTimer, setNewTimer] = useState<string>();
  const [intervalValue, setIntervalValue] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      socket.emit("ready-for-game");
      setReady(true);
    }, 5000);

    socket.on("get-ready-question", () => {
      setReadyComponent(true);
    });

    socket.on("time-changed", () => {
      toast.warning("Le timer pour la prochaine question a été changé");
    });

    socket.on("launch-vote-new-time", (data: any) => {
      setVoteProposition(true);
    });

    socket.on("next-question", (data: any) => {
      if (intervalValue) clearInterval(intervalValue);

      setQuestion(data.question);
      setAlreadyAnswered(false);
      setSelectedResponse([]);
      setReadyComponent(false);
      setTimer(data.question.timeInSeconds);
      const interval = setInterval(() => {
        setTimer((prevTimer: any) => {
          if (prevTimer === 0) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      setIntervalValue(interval);
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
      socket.off("time-changed");
      socket.off("vote-new-time");
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
          <Button onClick={handleResponse}>Play</Button>
          <div>{timer}</div>
          <div className="flex gap-2">
            <Input
              onChange={(event) => {
                setNewTimer(event.target.value);
              }}
              value={newTimer}
              type="text"
              placeholder="Set a new timer"
            />
            <Button
              onClick={() => {
                socket.emit("change-time-for-next-question", {
                  timeInSeconds: Number(newTimer),
                });
              }}
            >
              Proposer un nouveau timer pour la prochaine question
            </Button>
            {voteProposition && (
              <div className="flex flex-col gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    socket.emit("vote-new-time", { vote: true });
                    setVoteProposition(false);
                    setNewTimer("");
                  }}
                >
                  Voter pour le nouveau timer
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    socket.emit("vote-new-time", { vote: false });
                    setVoteProposition(false);
                    setNewTimer("");
                  }}
                >
                  Voter contre le nouveau timer
                </Button>
              </div>
            )}
          </div>
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
