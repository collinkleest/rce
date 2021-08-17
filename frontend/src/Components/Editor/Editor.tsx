import { Button, Card, Dropdown } from "react-bootstrap";
import { default as MonacoEditor } from '@monaco-editor/react';
import { useEffect, useState } from "react";


import { LangDropdowns } from "../../data/lang-dropdowns";
import { LangDropdownItem } from './LangDropdownItem'; 
import { langSnippets } from '../../data/lang-snippets';

export const Editor : React.FC = () => {

    const [ monacoLang, setMonacoLang ] = useState('javascript');
    const [ backendLang, setBackendLang ] = useState('javascript');
    const [ editorCode, setEditorCode ] = useState('');

    useEffect(() => {
        setEditorCode(langSnippets[backendLang]);
    }, [backendLang])

    return (
        <Card>
            <Card.Header className="d-inline-flex">
                <Dropdown id="lang-dropdown" className="mx-2">
                    <Dropdown.Toggle variant="dark">
                        Language
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {LangDropdowns.map(({editorLang, backendLang, title}) => {
                            return (
                                <LangDropdownItem
                                    key={backendLang} 
                                    title={title}
                                    backendLang={backendLang}
                                    editorLang={editorLang}
                                    setMonacoLang={(lang) => setMonacoLang(lang)}
                                    setBackendLang={(lang) => setBackendLang(lang)}
                                />
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown id="theme-dropdown" className="mx-2">
                    <Dropdown.Toggle variant="dark">
                        Theme
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            Dark
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Light
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Card.Header>
            
            <Card.Body className="p-0">
                <MonacoEditor
                    height="900px"
                    width="100%"
                    defaultLanguage="javascript"
                    language={monacoLang}
                    value={editorCode}
                    theme="vs-dark"
                />
            </Card.Body>

            <Card.Footer>
                <Button variant="success">Run Code</Button>
            </Card.Footer>
        </Card>
    );

}