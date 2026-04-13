import { Routes, Route } from 'react-router';
import { useState } from 'react';
import Home from './components/Home';
import Detail from './components/Detail';
import Diagram from './components/Diagram';
import Navbar from './components/Navbar';

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
        <>
            <Navbar />
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
                    element={
                        <Detail
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                        />
                    }
                />
                <Route
                    path="/diagram"
                    element={<Diagram />}
                />
            </Routes>
        </>
    );
}

export default App;