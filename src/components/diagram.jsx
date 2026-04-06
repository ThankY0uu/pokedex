import { useState, useEffect } from 'react';
import './Diagram.css';

const TYPE_COLORS = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
};

const GENERATIONS = [
    { label: 'Gen 1', offset: 0, limit: 151 },
    { label: 'Gen 2', offset: 151, limit: 100 },
    { label: 'Gen 3', offset: 251, limit: 135 },
];

function Diagram() {
    const [typeCounts, setTypeCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generation, setGeneration] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const { offset, limit } = GENERATIONS[generation];

            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await res.json();

            const allTypes = await Promise.all(
                data.results.map(async p => {
                    const detail = await fetch(p.url).then(r => r.json());
                    return detail.types.map(t => t.type.name);
                })
            );

            const counts = {};
            allTypes.flat().forEach(type => {
                if (counts[type]) {
                    counts[type]++;
                } else {
                    counts[type] = 1;
                }
            });

            const sorted = Object.entries(counts)
                .map(([type, count]) => ({ type, count }))
                .sort((a, b) => b.count - a.count);

            setTypeCounts(sorted);
            setLoading(false);
        };

        fetchData();
    }, [generation]);

    if (loading) return <p>Loading diagram...</p>;

    const total = typeCounts.reduce((sum, t) => sum + t.count, 0);

    const radius = 150;
    const center = 200;
    let progress = 0;

    const segments = typeCounts.map(({ type, count }) => {
        const percentage = count / total;
        const startAngle = progress * 2 * Math.PI;
        const endAngle = (progress + percentage) * 2 * Math.PI;

        const x1 = center + radius * Math.sin(startAngle);
        const y1 = center - radius * Math.cos(startAngle);
        const x2 = center + radius * Math.sin(endAngle);
        const y2 = center - radius * Math.cos(endAngle);

        const largeArc = percentage > 0.5 ? 1 : 0;
        const d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        progress += percentage;

        return { type, count, d };
    });

    return (
        <div className="diagram-container">
            <h1>Type Distribution - {GENERATIONS[generation].label}</h1>

            {/* Generation buttons */}
            <div className="diagram-generations">
                {GENERATIONS.map((gen, i) => (
                    <button
                        key={gen.label}
                        onClick={() => setGeneration(i)}
                        style={{ fontWeight: generation === i ? 'bold' : 'normal' }}
                    >
                        {gen.label}
                    </button>
                ))}
            </div>

            <svg width="400" height="400" viewBox="0 0 400 400">
                {segments.map(seg => (
                    <path
                        key={seg.type}
                        d={seg.d}
                        fill={TYPE_COLORS[seg.type] || '#ccc'}
                        stroke="white"
                        strokeWidth="2"
                    />
                ))}
            </svg>

            <div className="diagram-legend">
                {typeCounts.map(({ type, count }) => (
                    <div key={type} className="diagram-legend-item">
                        <div
                            className="diagram-legend-color"
                            style={{ background: TYPE_COLORS[type] || '#ccc' }}
                        />
                        <span className="diagram-legend-label">
              {type} ({count})
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Diagram;