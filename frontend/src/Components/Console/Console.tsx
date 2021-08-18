import { Card, Spinner } from "react-bootstrap"


interface ConsoleProps {
    stdout: string;
    stderr: string;
    loading: boolean;
}

export const Console: React.FC<ConsoleProps> = (props: ConsoleProps) => {
    
    return (
        <Card>
            <Card.Header>
                <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        hidden={!props.loading}
                    />
                Execution Console
            </Card.Header>
            <Card.Body>
                <h6>Standard Output (stdout):</h6>
                {props.stdout.split('\n').map((stline, index) => {
                    if (stline !== "" && stline !== null && stline !== undefined){
                        return (<div><code key={index}>{'>'} {stline}</code></div>);
                    }
                    return null;
                })}
                <h6>Standard Error Output (stderr):</h6>
                {props.stderr.split('\n').map((stline, index) => {
                    if (stline !== "" && stline !== null && stline !== undefined){
                        return (<div><code key={index}>{'>'} {stline}</code></div>);
                    }
                    return null;
                })}
            </Card.Body>
        </Card>
    )
}