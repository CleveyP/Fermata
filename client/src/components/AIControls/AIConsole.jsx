import "./AIConsole.css";


export const AIConsole = (props) =>{


    return (
        <div className="ai-console">
            {
                props.consoleHistory.map((item, index) =>{
                    return <p key={index} className="console-item">{item}</p>
                })
            }
        </div>
    )
}