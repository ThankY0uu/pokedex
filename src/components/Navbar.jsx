import { useNavigate } from 'react-router';

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
      <span className="navbar-logo" onClick={() => navigate('/')}>
        🏠 Pokédex
      </span>
            <button onClick={() => navigate('/diagram')}>
                📊 Diagram
            </button>
        </nav>
    );
}

export default Navbar;