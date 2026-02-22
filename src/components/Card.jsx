import '../styles/Card.css';

function parseName(name) {
	return name
		.split('-')
		.map((lower) => {
			return lower.charAt(0).toUpperCase() + lower.slice(1);
		})
		.join(' ');
}

function Card({ pokemon, onClick }) {
	return (
		<button id={pokemon ? pokemon.id : null} onClick={onClick} className="card">
			<img className="card-img" src={pokemon ? pokemon.imgURL : null} />
			<p className="card-description">{pokemon ? parseName(pokemon.name) : null}</p>
		</button>
	);
}

export default Card;
