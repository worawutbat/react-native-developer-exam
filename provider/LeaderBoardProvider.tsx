import React, { useCallback, useState } from 'react';

const initLeaderBoard = [
  {
    userName: 'Bee',
    userScore: 20
  },
  {
    userName: 'John',
    userScore: 10
  },
  {
    userName: 'Ann',
    userScore: 105
  },
  {
    userName: 'bb',
    userScore: 20
  },
]

export interface IUser {
  userName: string// unique
  userScore: number;
}

export type ILeaderBoard = IUser[]

const LeaderBoardContext = React.createContext<{leaderBoard: ILeaderBoard; onAddNewScoreToBoard: (user: IUser) => void}>({
  leaderBoard: [],
  onAddNewScoreToBoard: function (user: IUser): void {
    throw new Error('Function not implemented.');
  }
});

const LeaderBoardProvider = ({ children }: any ) => {
  const [leaderBoard, setLeaderBoard] = useState<ILeaderBoard>(initLeaderBoard)

  const onAddNewScoreToBoard = useCallback((user: IUser) => {
      if (!leaderBoard?.length) {
          setLeaderBoard([user])
      } else {
          setLeaderBoard([...leaderBoard, user]?.sort((a, b) => b.userScore - a.userScore))
      }
  }, [setLeaderBoard, leaderBoard])

  return (
    <LeaderBoardContext.Provider value={{ leaderBoard, onAddNewScoreToBoard }}>
      {children}
    </LeaderBoardContext.Provider>
  );
};

export { LeaderBoardContext, LeaderBoardProvider };
