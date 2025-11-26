function Historial(props){
    const operaciones = props.operaciones || [];

    if (operaciones.length === 0) {
        return (
            <div>
                <h2>Historial de operaciones</h2>
                <p>No hay operaciones registradas.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Historial de operaciones</h2>
            <ul>
                {operaciones.map((op) => (
                    <li key={op.id}>
                        {op.operacion} {op.v1} {op.simbolo} {op.v2} = {op.resultado}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Historial;
