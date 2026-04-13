import { Routes, Route } from 'react-router';
import { useState } from 'react';
import Home from './components/Home';
import Detail from './components/Detail';
import Diagram from './components/Diagram';

function App() {
    const [favorites, setFavorites] = useState([]);
    function toggleFavorite(name) {
        if (favorites.includes(name)) {
            setFavorites(favorites.filter(f => f !== name));
        } else {
            setFavorites([...favorites, name]);
        }
    }
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Home
                        favorieten={favorites}
                        toggleFavoriet={toggleFavorite}
                    />
                }
            />
            <Route
                path="/pokemon/:name"
                element={<Detail />}
            />
            <Route
                path="/diagram"
                element={<Diagram />}
            />
        </Routes>
    );
}
export default App;