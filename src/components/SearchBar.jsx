function SearchBar({ searchTerm, setSearchTerm, typeFilter, setTypeFilter, types }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search a Pokémon..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="all">All types</option>
                <option value="favorites">❤️ Favorites</option>
                {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
        </div>
    );
}

export default SearchBar;