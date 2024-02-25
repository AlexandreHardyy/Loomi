"use client";

const GameStartSoon = ({ result }: any) => {
  return (
    <div>
      <div className="m-10 flex justify-center font-bold text-3xl">
        Question will start soon !
      </div>
      <div className="flex justify-center">
        {Object.values(result.players).map((player: any) => (
          <div key={player.id} className="flex gap-2 border rounded px-2">
            <span>{player.username}</span>
            <span>{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameStartSoon;
