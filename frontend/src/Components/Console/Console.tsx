import { Card } from "react-bootstrap"


interface ConsoleProps {
    stdout: string;
    stderr: string;
}

export const Console: React.FC<ConsoleProps> = (props: ConsoleProps) => {
    return (
        <Card>
            <Card.Header>Execution Console</Card.Header>
            <Card.Body>
                <h6>Standard Output (stdout):</h6>
                {props.stdout.split('\n').map((stline, index) => {
                    if (stline !== "" && stline !== null && stline !== undefined){
                        return (<div><code key={index}>{'>'} {stline}</code></div>);
                    }
                })}
                <h6>Standard Error Output (stderr):</h6>
                {props.stderr.split('\n').map((stline, index) => {
                    if (stline !== "" && stline !== null && stline !== undefined){
                        return (<div><code key={index}>{'>'} {stline}</code></div>);
                    }
                })}
            </Card.Body>
        </Card>
    )
}