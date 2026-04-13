import { useNavigate } from 'react-router';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import TypeBadge from './TypeBadge';

function PokemonCard({ pokemon, isFavorite, toggleFavoriet }) {
    const navigate = useNavigate();
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    return (
        <div
            className="pokemon-card"
            onClick={() => navigate(`/pokemon/${pokemon.name}`)}
        >
            <button
                className="favorite-btn"
                onClick={e => { e.stopPropagation(); toggleFavoriet(pokemon.name); }}
            >
                {isFavorite ? <FaHeart color="red" size={20} /> : <FaRegHeart color="gray" size={20} />}
            </button>

            <img src={image} alt={pokemon.name} />
            <p className="pokemon-name-text">{pokemon.name}</p>

            <div className="pokemon-types-container">
                {pokemon.types.map(t => (
                    <TypeBadge key={t} type={t} />
                ))}
            </div>
        </div>
    );
}

export default PokemonCard;