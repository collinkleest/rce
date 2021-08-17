import { Button, Card, Dropdown } from "react-bootstrap";
import { default as MonacoEditor } from '@monaco-editor/react';
import { useEffect, useState } from "react";


import { LangDropdowns } from "../../data/lang-dropdowns";
import { LangDropdownItem } from './LangDropdownItem'; 
import { langSnippets } from '../../data/lang-snippets';

interface EditorProps {
    changeFunc: (value: string, event: Event) => void;
    runCodeFunc: (code: string, lang: string) => void;
    remoteCode: string;
}

export const Editor : React.FC<EditorProps> = (props: EditorProps) => {

    const [ editorTheme, setEditorTheme ] = useState('vs-dark');
    const [ monacoLang, setMonacoLang ] = useState('javascript');
    const [ backendLang, setBackendLang ] = useState('javascript');
    const [ editorCode, setEditorCode ] = useState('');

    useEffect(() => {
        setEditorCode(langSnippets[backendLang]);
    }, [backendLang])

    useEffect(() => {
        if (props.remoteCode !== null){
            setEditorCode(props.remoteCode);
        }
    }, [props.remoteCode])

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
                        <Dropdown.Item 
                            onClick={() => setEditorTheme('vs-dark')}
                        >
                            Dark
                        </Dropdown.Item>
                        <Dropdown.Item 
                            onClick={() => setEditorTheme('light')}
                        >
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
                    onChange={props.changeFunc}
                    theme={editorTheme}
                />
            </Card.Body>

            <Card.Footer>
                <Button onClick={() => props.runCodeFunc(editorCode, backendLang)} variant="success">Run Code</Button>
            </Card.Footer>
        </Card>
    );

}