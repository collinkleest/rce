import React, { useEffect, useState } from 'react';
import { Nav } from './Nav/Nav';
import io, { Socket } from 'socket.io-client';

import { Submission } from '../../../src/models/submission'; 
import { Editor as CustomEditor} from './Editor/Editor';

let socket: Socket;

const App : React.FC = () => {
  const [ roomId, setRoomId ] = useState("");
  const [ remoteCode, setRemoteCode ] = useState(null);


  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      setRoomId(socket.id);
    })

    socket.on('new-code-remote', (code : string) => {
      setRemoteCode(code);
    })

    socket.on('code-output', (codeOutput: string) => {
      document.querySelector("#codeOutput").innerHTML = codeOutput;
    })

  }, [])

  const broadcastChanges = (value : string | undefined, event: Event) => {
    socket.emit('new-code', value, roomId);
  }

  const roomJoinHandler = (room : string) => {
    setRoomId(room);
    socket.emit('join-room', room);
  }

  const runCodeHandler = (code, lang) => {
    const submission : Submission = { code: code, lang: lang, roomId: roomId };
    socket.emit('code-submission', JSON.stringify(submission));
  }

  return (
    <div>
      <Nav 
        roomId={roomId}
        roomJoinHandler={roomJoinHandler}
      />
      <CustomEditor
        remoteCode={remoteCode}
        changeFunc={broadcastChanges}
      />
    </div>  
  );
}

export default App;
