import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { Nav } from './Nav/Nav';
import './App.css';
import { Button, Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import io, { Socket } from 'socket.io-client';
import { Submission } from '../../../src/models/submission'; 
import { langSnippets } from '../data/lang-snippets'

import { Editor as CustomEditor} from './Editor/Editor';

let socket: Socket;

const App : React.FC = () => {
  const [ roomId, setRoomId ] = useState("");
  const [ editorTheme, setEditorTheme ] = useState("vs-dark");
  const [ editorLanguage, setEditorLanguage ] = useState("javascript");
  const [ editorCode, setEditorCode ] = useState("");
  const [ backendLanguage, setBackendLanguage ] = useState("javascript");


  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      setRoomId(socket.id);
    })

    socket.on('new-code-remote', (code : string) => {
      setEditorCode(code);
    })

    socket.on('progress', (progress: string) => {
      const para = document.createElement("p");
      para.innerText = progress;
      document.querySelector("#buildOutput")?.append(para);
      document.querySelector("#codeO")
    })

    socket.on('code-output', (codeOutput: string) => {
      document.querySelector("#codeOutput").innerHTML = codeOutput;
    })

  }, [])

  useEffect(() => {
    setEditorCode(langSnippets[backendLanguage])
  }, [backendLanguage])

  const editorValueChange = (value : string | undefined, event: Event) => {
    socket.emit('new-code', value, roomId);
  }

  const roomJoinHandler = (room : string) => {
    setRoomId(room);
    socket.emit('join-room', room);
  }

  const runCodeHandler = () => {
    const submission : Submission = { code: editorCode, lang: backendLanguage, roomId: roomId };
    socket.emit('code-submission', JSON.stringify(submission));
  }

  return (
    <div>
      <Nav 
        roomId={roomId}
        roomJoinHandler={roomJoinHandler}
      />
      <CustomEditor></CustomEditor>
      <Container fluid>
        <Row>
          <Col xs={1}>
            <Dropdown id="lang-dropdown" className="m-2">
              <Dropdown.Toggle variant="dark">
                Language
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => {
                    setEditorLanguage("javascript");
                    setBackendLanguage("javascript");
                  }} active>
                  JavaScript
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                    setEditorLanguage("typescript");
                    setBackendLanguage("typescript");
                  }}>
                  TypeScript
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                    setEditorLanguage("python");
                    setBackendLanguage("python2");
                    }}>
                  Python2
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                    setEditorLanguage("python");
                    setBackendLanguage("python3");
                  }}>
                  Python3
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                    setEditorLanguage("java");
                    setBackendLanguage("java8");
                  }}>
                  Java8
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                    setEditorLanguage("java");
                    setBackendLanguage("java11");
                  }}>
                  Java11
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                    setEditorLanguage("go");
                    setBackendLanguage("go");
                  }}>
                  Go
                </Dropdown.Item>
              </Dropdown.Menu>

            </Dropdown>
          </Col>
          <Col xs={1}>
            <Dropdown className="m-2">
              <Dropdown.Toggle variant="dark">
                Theme
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setEditorTheme("light")}>
                  Light
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setEditorTheme("vs-dark")} active>
                  Dark
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
      
      <Container fluid>
        <Row className="editor-main">
          <Col xs={6}>
            <Card>
              <Card.Header>
                <Dropdown>
                  <Dropdown.Toggle>
                    Lang
                  </Dropdown.Toggle>
                  <Dropdown.Item>

                  </Dropdown.Item>
                </Dropdown>
              </Card.Header>
              <Card.Body className="p-0">
                <Editor
                  height="900px"
                  width="100%"
                  defaultLanguage="javascript"
                  language={editorLanguage}
                  onChange={editorValueChange}
                  value={editorCode}
                  theme={editorTheme}
                />
              </Card.Body>
              <Card.Footer>
                <div className="ms-auto">
                  <Button variant="success">Run Code</Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col xs={6}>
            <Card>
              <Card.Header>Console Output</Card.Header>
              <Card.Body>
                <Card.Title>Standard Output (stdout)</Card.Title>
              </Card.Body>
            </Card>
            <div id="codeOutput" className="">

            </div>
          </Col>
        </Row>
      </Container>

      <Container fluid>
        <button onClick={runCodeHandler} className="btn btn-lg btn-success">Run Code</button>
      </Container>
    </div>  
  );
}

export default App;
