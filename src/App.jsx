import { useState } from 'react';
import Home from './components/Home';
import Detail from './components/Detail';
import Diagram from './components/Diagram';

function App() {
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [showDiagram, setShowDiagram] = useState(false);
    const [favorites, setFavorites] = useState([]);

    function toggleFavorite(name) {
        if (favorites.includes(name)) {
            setFavorites(favorites.filter(f => f !== name));
        } else {
            setFavorites([...favorites, name]);
        }
    }

    // Show detail page
    if (selectedPokemon) {
        return (
            <Detail
                pokemonName={selectedPokemon}
                onBack={() => setSelectedPokemon(null)}
            />
        );
    }

    // Show diagram page
    if (showDiagram) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <button onClick={() => setShowDiagram(false)}>← Go Back</button>
                <Diagram />
            </div>
        );
    }

    // Show home page
    return (
        <div className="App">
            <button onClick={() => setShowDiagram(true)}>📊 View Type Diagram</button>
            <Home
                onSelect={(name) => setSelectedPokemon(name)}
                favorieten={favorites}
                toggleFavoriet={toggleFavorite}
            />
        </div>
    );
}

export default App;