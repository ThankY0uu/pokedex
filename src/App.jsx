import { useState } from 'react';
import Home from './components/Home';
import Detail from './components/Detail';

function App() {
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    if (selectedPokemon) {
        return (
            <Detail
                pokemonName={selectedPokemon}
                onBack={() => setSelectedPokemon(null)}
            />
        );
    }

    return (
        <div className="App">
            <Home
                onSelect={(naam) => setSelectedPokemon(naam)}
                favorieten={[]}
                toggleFavoriet={() => {}}
            />
        </div>
    );
}

export default App;