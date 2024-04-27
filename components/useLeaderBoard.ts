import { useCallback, useMemo, useState } from "react"

export interface IUser {
    userName: string// unique
    userScore: number;
}

type ILeaderBoard = IUser[]

export const useLeaderBoard = () => {
    const [leaderBoard, setLeaderBoard] = useState<ILeaderBoard>([{userName: 'a', userScore: 10}])
    const leaderBoardSorted = useMemo(() => leaderBoard?.sort((a, b) => b.userScore - a.userScore),[leaderBoard])

    const onAddNewScoreToBoard = useCallback((user: IUser) => {
        if (!leaderBoard?.length) {
            setLeaderBoard([user])
        } else {
            setLeaderBoard([...leaderBoard, user])
        }
    }, [setLeaderBoard, leaderBoard])

    return ({
        leaderBoard,
        leaderBoardSorted,
        onAddNewScoreToBoard
    })
} 