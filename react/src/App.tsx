import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { 
    fetchGames, 
    fetchContestants, 
    fetchTickets, 
    createContestant, 
    buyTicket,
    fetchRecentGame,
    fetchCompletedGame
} from "./fetcher";
import { faker } from "@faker-js/faker";

export const App = () => {
    const [games, setGames] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [contestants, setContestants] = useState<any[]>([]);
    const [contestant, setContestant] = useState<any>({ name: "" });
    const [ticket, setTicket] = useState<any>({ contestantId: "" });
    const [contestantSeed, setContestantSeed] = useState<any>({ count: 0 });
    const [recentGame, setRecentGame] = useState<any>({});
    const [completedGame, setCompletedGame] = useState<any>({});
    const [error, setError] = useState<any>(null);
    const [socket, _] = useState(io());

    const handleFetchGames = async () => {
        setGames(await fetchGames());
    }

    const handleFetchTickets = async () => {
        setTickets(await fetchTickets());
    }

    const handleFetchContestants = async () => {
        setContestants(await fetchContestants());
    }

    const handleFetchRecentGame = async () => {
        setRecentGame(await fetchRecentGame());
    }

    const handleFetchCompletedGame = async () => {
        setCompletedGame(await fetchCompletedGame());
    }

    const handleCreateContestant = async () => {
        setContestant(await createContestant(contestant));
        await handleFetchContestants();
    }

    const handleBuyTicket = async () => {
        setTicket(await buyTicket(ticket));
        await handleFetchTickets();
    }

    const handleSeedTickets = async () => {
        await Promise.all(contestants.map(c => {
            return buyTicket({ contestantId: c._id });
        }))
        await handleFetchTickets();
    }

    const handleSeedContestants = async () => {
        await Promise.all(Array.from({ length: contestantSeed.count }).map(() => {
            return createContestant({ name: faker.internet.userName() });
        }))
        await handleFetchContestants();
    }

    const setContestantId = (ev: any) => {
        setTicket({ contestantId: ev.target.value });
    }

    const setContestantName = (ev: any) => {
        setContestant({ name: ev.target.value });
    }

    const setContestantSeedCount = (ev: any) => {
        setContestantSeed({ count: parseInt(ev.target.value) });
    }

    const init = async () => {
        await Promise.all([
            handleFetchGames(),
            handleFetchTickets(),
            handleFetchContestants(),
            handleFetchRecentGame(),
            handleFetchCompletedGame(),
        ]) 
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        socket.on("game.draw.recentGame", async (recentGame) => {
            setRecentGame(JSON.parse(recentGame));
            await handleFetchGames();
        });
        socket.on("game.draw.completedGame", async (completedGame) => {
            alert(JSON.stringify({ message: "draw is completed" }));
            setCompletedGame(JSON.parse(completedGame));
            await handleFetchGames();
        });
        socket.on("game.draw.failed", (error) => {
            setError(JSON.parse(error));
        });
    }, []);

    return (
        <div>
            <Data name="Recent Game" data={[recentGame]}/>
            <Data name="Last Completed Game" data={[completedGame]}/>
            <Data name="Error" data={[error]}/>
            <Data name="Games" data={games} />
            <Data name="Tickets" data={tickets} />
            <Data name="Contestants" data={contestants} />
            <Form
                name="Create Contestant"
                onSubmit={handleCreateContestant}
                data={[contestant]}
                inputs={() => (
                    <input type="text" onChange={setContestantName} />
                )}
            />
            <Form
                name="Seed Contestant"
                onSubmit={handleSeedContestants}
                data={[contestantSeed]}
                inputs={() => (
                    <input type="number" onChange={setContestantSeedCount} />
                )}
            />
            <Form
                name="Buy Tickets"
                onSubmit={handleBuyTicket}
                data={[ticket]}
                inputs={() => (
                    <input type="text" onChange={setContestantId} />
                )}
            />
            <Form
                name="Seed Tickets"
                onSubmit={handleSeedTickets}
                data={[]}
                inputs={() => null}
            />
        </div>
    )
}

const Data: React.FC<{ name: string, data: any[] }> = ({ name, data }) => {
    return (
        <div>
            <h1>{name}</h1>
            {data.map((datum) => <Datum datum={datum}/>)}
        </div>
    )
}

const Datum: React.FC<{ datum: any }> = ({ datum }) => {
    return (
        <div>{JSON.stringify(datum)}</div>
    )
}

const Form: React.FC<{ 
    name: string;
    inputs: () => React.ReactNode;
    onSubmit: () => any;
    data: any[];
}> = ({ name, inputs = () => null, onSubmit, data }) => {
    return (
        <div>
            <h1>{name}</h1>
            <form>
                {inputs()}
                <button type="button" onClick={onSubmit}>
                    Submit
                </button>
            </form>
            {data.map((datum) => <Datum datum={datum}/>)}
        </div>
    )
}