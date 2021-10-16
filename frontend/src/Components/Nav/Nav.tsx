import React, { Fragment, useState } from "react";
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import styled from "styled-components";

interface NavProps {
  roomId: string;
  roomJoinHandler: (room: string) => void;
}

const LoginIcon = styled.svg`
  fill: white;
  margin-right: 10px;
  cursor: pointer;
`;

export const Nav: React.FC<NavProps> = (props: NavProps) => {
  const [joinIsOpen, setJoinIsOpen] = useState(false);
  const [shareIsOpen, setShareIsOpen] = useState(false);
  const [loginIsOpen, setLoginIsOpen] = useState(false);
  const [registerViewActive, setRegisterViewActive] = useState(false);
  const [loginViewActive, setLoginViewActive] = useState(true);

  const [roomId, setRoomId] = useState("");

  const handleJoin = () => {
    setJoinIsOpen(false);
    props.roomJoinHandler(roomId);
  };

  const handleLoginViewClick = () => {
    if (loginViewActive) {
      return;
    }
    setRegisterViewActive(false);
    setLoginViewActive(true);
  };

  const handleRegisterViewClick = () => {
    if (registerViewActive) {
      return;
    }
    setLoginViewActive(false);
    setRegisterViewActive(true);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(props.roomId)
      .then(() => {
        setShareIsOpen(false);
      })
      .catch((err) => {
        console.error(`There was an error when copying to clipboard: ${err}`);
      });
  };

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="navbar-brand">Remote Code Executor</div>
        <div className="ms-auto">
          <button
            onClick={() => setShareIsOpen(true)}
            className="btn btn-lg btn-outline-success m-2"
          >
            Share Room
          </button>
          <button
            onClick={() => setJoinIsOpen(true)}
            className="btn btn-lg btn-outline-primary m-2"
          >
            Join Room
          </button>
        </div>
        <LoginIcon
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          onClick={() => setLoginIsOpen(true)}
        >
          <path d="M8 10v-5l8 7-8 7v-5h-8v-4h8zm2-8v2h12v16h-12v2h14v-20h-14z" />
        </LoginIcon>
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
            onChange={(e) => setRoomId(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger"
            onClick={() => setJoinIsOpen(false)}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleJoin}>
            {" "}
            Join{" "}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={shareIsOpen} onHide={() => setShareIsOpen(false)}>
        <Modal.Header>
          <Modal.Title>Share your room!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your room id is: {props.roomId}</Modal.Body>
        <Modal.Footer>
          <button onClick={handleCopy} className="btn btn-primary">
            Copy to clipboard
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={loginIsOpen} onHide={() => setLoginIsOpen(false)}>
        <Modal.Header>
          <Modal.Title>
            <ButtonGroup>
              <Button variant="secondary" onClick={handleLoginViewClick}>
                Sign In
              </Button>
              <Button variant="secondary" onClick={handleRegisterViewClick}>
                Sign Up
              </Button>
            </ButtonGroup>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loginIsOpen && loginViewActive && (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          )}
          {loginIsOpen && registerViewActive && (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleCopy} className="btn btn-primary">
            Copy to clipboard
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};
