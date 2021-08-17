import React, { useEffect, useState } from 'react';
import { Nav } from './Nav/Nav';
import io, { Socket } from 'socket.io-client';

import { Submission } from '../../../src/models/submission'; 
import { Editor as CustomEditor} from './Editor/Editor';
import { Console } from './Console/Console';
import { Col, Row } from 'react-bootstrap';

let socket: Socket;

const App : React.FC = () => {
  const [ roomId, setRoomId ] = useState("");
  const [ remoteCode, setRemoteCode ] = useState(null);
  const [ remoteCodeOutput, setRemoteCodeOutput ] = useState({stdout: '', stderr: ''});
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      setRoomId(socket.id);
    })

    socket.on('new-code-remote', (code : string) => {
      setRemoteCode(code);
    })

    socket.on('code-output', (codeOutput: string) => {
      setRemoteCodeOutput(JSON.parse(codeOutput));
    })

  }, [])

  useEffect(() => {
    setLoading(false);
  }, [remoteCodeOutput])

  const broadcastChanges = (value : string | undefined, event: Event) => {
    socket.emit('new-code', value, roomId);
  }

  const roomJoinHandler = (room : string) => {
    setRoomId(room);
    socket.emit('join-room', room);
  }

  const runCodeHandler = (code: string, lang: string) => {
    const submission : Submission = { code: code, lang: lang, roomId: roomId };
    socket.emit('code-submission', JSON.stringify(submission));
  }

  return (
    <div>
      <Nav 
        roomId={roomId}
        roomJoinHandler={roomJoinHandler}
      />
      <Row className="mx-1 my-1">
        <Col xl={8} lg={7} md={6} sm={6}>
          <CustomEditor
            remoteCode={remoteCode}
            changeFunc={broadcastChanges}
            runCodeFunc={runCodeHandler}
            setLoadingFunc={() => setLoading(true)}
          />
        </Col>
        
        <Col xl={4} lg={5} md={6} sm={6}>
          <Console
            stdout={remoteCodeOutput.stdout}
            stderr={remoteCodeOutput.stderr}
            loading={loading}
          />
        </Col>
      </Row>
      
    </div>  
  );
}

export default App;
