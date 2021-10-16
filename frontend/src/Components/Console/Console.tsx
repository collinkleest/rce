import { Card, Spinner } from "react-bootstrap";
import styled from "styled-components";

interface ConsoleProps {
  stdout: string;
  stderr: string;
  loading: boolean;
}

const OutputContainer = styled.div`
  height: 20rem;
  overflow-y: scroll;
`;

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
        <OutputContainer>
          {props.stdout
            .slice(0, 50000)
            .split("\n")
            .map((stline, index) => {
              if (stline !== "" && stline !== null && stline !== undefined) {
                return (
                  <div>
                    <code key={index}>
                      {">"} {stline}
                    </code>
                  </div>
                );
              }
              return "";
            })}
        </OutputContainer>
        <h6>Standard Error Output (stderr):</h6>
        <OutputContainer>
          {props.stderr
            .slice(0, 50000)
            .split("\n")
            .map((stline, index) => {
              if (stline !== "" && stline !== null && stline !== undefined) {
                return (
                  <div>
                    <code key={index}>
                      {">"} {stline}
                    </code>
                  </div>
                );
              }
              return "";
            })}
        </OutputContainer>
      </Card.Body>
    </Card>
  );
};
