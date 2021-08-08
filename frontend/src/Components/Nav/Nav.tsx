import { Fragment, useState } from "react";
import { Form, Modal } from "react-bootstrap";

interface NavProps {
    roomId: string;
    roomJoinHandler: (room: string) => void;
}

export const Nav : React.FC<NavProps> = (props : NavProps) => {

    const [ joinIsOpen, setJoinIsOpen ] = useState(false);
    const [ shareIsOpen, setShareIsOpen ] = useState(false);
    const [ roomId, setRoomId ] = useState('');
    
    const handleJoin = () => {
        setJoinIsOpen(false);
        props.roomJoinHandler(roomId);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(props.roomId).then(() => {
            setShareIsOpen(false);
        }).catch((err) => {
            console.error(`There was an error when copying to clipboard: ${err}`);
        })
    }

    return(
        <Fragment>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="navbar-brand">
                    Remote Code Executor
                </div>
                <div className="ms-auto">
                    <button onClick={() => setShareIsOpen(true)} className="btn btn-lg btn-outline-success m-2">Share Room</button>
                    <button onClick={() => setJoinIsOpen(true)} className="btn btn-lg btn-outline-primary m-2">Join Room</button>
                </div>
            </nav>
            <Modal show={joinIsOpen} onHide={() => setJoinIsOpen(false)}>
                <Modal.Header>
                    <Modal.Title>Join a room!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>Enter a Room ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Room ID"
                        aria-describedby="roomIdInput"
                        value={roomId}
                        onChange={e => setRoomId(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-danger" onClick={() => setJoinIsOpen(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleJoin}> Join </button>
                </Modal.Footer>
            </Modal>

            <Modal show={shareIsOpen} onHide={() => setShareIsOpen(false)}>
                <Modal.Header>
                    <Modal.Title>Share your room!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your room id is: {props.roomId} 
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleCopy} className="btn btn-primary">Copy to clipboard</button>
                </Modal.Footer>
            </Modal>

        </Fragment>
    );

}
