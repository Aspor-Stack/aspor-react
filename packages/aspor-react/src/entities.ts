export type Project = {
    id: number,
    name: string

    primaryBoard: Board

    boards: Board[]
}

export type Board = {
    id: number,
    name: string
}

export type User = {
    id: number,
    name: string
}

