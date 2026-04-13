const GENERATIONS = [
    { label: 'Gen 1', offset: 0, limit: 151 },
    { label: 'Gen 2', offset: 151, limit: 100 },
    { label: 'Gen 3', offset: 251, limit: 135 },
];

function GenerationButtons({ generation, setGeneration }) {
    return (
        <div className="generation-buttons">
            {GENERATIONS.map((gen, i) => (
                <button
                    key={gen.label}
                    onClick={() => setGeneration(i)}
                    className={generation === i ? 'active' : ''}
                >
                    {gen.label}
                </button>
            ))}
        </div>
    );
}

export { GENERATIONS };
export default GenerationButtons;