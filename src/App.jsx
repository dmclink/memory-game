import { useState, useEffect, useRef } from 'react';
import './App.css';
import Loader from './components/Loader';
import Card from './components/Card.jsx';
import ScoreBoard from './components/ScoreBoard.jsx';

const MAX_ID = 1025;

function pick10RandomNumbers() {
	const result = [];
	for (let i = 0; i < 10; i++) {
		result.push(Math.floor(Math.random() * MAX_ID + 1));
	}
	return result;
}

const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon/';

function buildEndpoint(id) {
	return `${POKE_API_URL}${String(id)}/`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function shuffle(arr) {
	const result = [...arr];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

function App() {
	// put all that stuff up top into a state initialization so i can reset the pokemon ids if needed
	const [ids, setIDs] = useState(() => {
		const idsStr = sessionStorage.getItem('ids');
		let result;
		if (!idsStr) {
			result = pick10RandomNumbers();
			sessionStorage.setItem('ids', JSON.stringify(result));
		} else {
			result = JSON.parse(idsStr);
		}
		return result;
	});
	const [pokemon, setPokemon] = useState({});

	const [loading, setLoading] = useState(false);
	const [clicked, setClicked] = useState(new Set());
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);

	function handleResetButtonClick() {
		setIDs(pick10RandomNumbers());
	}

	function handleCardClick(e) {
		//TODO: update stae with set of clicked IDs
		const id = e.currentTarget.getAttribute('id');
		if (!id) {
			return;
		}

		if (clicked.has(id)) {
			setHighScore(Math.max(highScore, score));
			setScore(0);
			setClicked(new Set());
		} else {
			setScore(score + 1);
			setClicked((prevSet) => new Set([...prevSet, id]));
		}
	}

	useEffect(() => {
		const newPokemon = {};
		(async () => {
			setLoading(true);
			if (dialogRef.current) {
				dialogRef.current.showModal();
			}
			for (const id of ids) {
				const nameKey = `${id}_name`;
				const imgURLKey = `${id}_img_url`;

				let name = localStorage.getItem(nameKey);
				let imgURL = localStorage.getItem(imgURLKey);

				if (!name) {
					const url = buildEndpoint(id);
					console.log('fetching pokemon api info for id:', id);

					const resp = await fetch(url);
					const data = await resp.json();

					name = data.name;
					imgURL = data.sprites.other['official-artwork']['front_default'] || data.sprites.front_default;
					localStorage.setItem(nameKey, name);
					localStorage.setItem(imgURLKey, imgURL);

					await sleep(100);
				}

				newPokemon[id] = {};

				newPokemon[id].id = id;
				newPokemon[id].name = name;
				newPokemon[id].imgURL = imgURL;
			}
			sessionStorage.setItem('ids', JSON.stringify(ids));
			setPokemon(newPokemon);
			setLoading(false);
			setScore(0);
			setClicked(new Set());
			if (dialogRef.current) {
				dialogRef.current.close();
			}
		})();
	}, [ids]);

	const dialogRef = useRef(null);

	const shuffledIds = shuffle(ids);

	return (
		<>
			<Loader ref={dialogRef} />
			<header>
				<h1>Pokemon Memory Game</h1>
				<button className="new-cards-button" disabled={loading} type="button" onClick={handleResetButtonClick}>
					Pick new cards
				</button>
				<ScoreBoard score={score} highScore={highScore} />
			</header>
			<main>
				{shuffledIds.map((id) => {
					const p = pokemon[id];
					return <Card pokemon={p} key={id} onClick={handleCardClick} />;
				})}
			</main>
		</>
	);
}

export default App;
