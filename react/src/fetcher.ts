const fetchx = async (input: RequestInfo, init?: RequestInit) => {
    const res = await fetch(input, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init?.headers
        },
    })
    return res.json();
}

const fetchGames = async () => {
    return fetchx("/api/games");
}

const fetchRecentGame = async () => {
    return fetchx("/api/games/recent");
}

const fetchCompletedGame = async () => {
    return fetchx("/api/games/completed");
}

const fetchContestants = async () => {
    return fetchx("/api/contestants");
}

const createContestant = async (dto: { name: string }) => {
    return fetchx("/api/contestants", {
        method: "POST",
        body: JSON.stringify(dto)
    });
}

const fetchTickets = async () => {
    return fetchx("/api/tickets");
}

const buyTicket = async (dto: { contestantId: string }) => {
    return fetchx("/api/tickets/buy", {
        method: "POST",
        body: JSON.stringify(dto)
    });
}

export {
    fetchGames,
    fetchContestants,
    fetchTickets,
    fetchRecentGame,
    fetchCompletedGame,
    createContestant,
    buyTicket,
}