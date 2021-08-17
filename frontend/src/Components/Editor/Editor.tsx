import { Button, Card, Dropdown } from "react-bootstrap";
import { default as MonacoEditor, Monaco } from '@monaco-editor/react';
import { useEffect, useState } from "react";


import { LangDropdowns } from "../../data/lang-dropdowns";
import { LangDropdownItem } from './LangDropdownItem'; 
import { langSnippets } from '../../data/lang-snippets';
import { Themes } from './Themes/Themes';


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

    const handleEditorMounted = (editor, monaco: Monaco) => {
        Themes.forEach((theme) => {
            monaco.editor.defineTheme(theme.themeName, theme.themeConfig);
        })
    }

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
                        {Themes.map((theme) => {
                            return (
                                <Dropdown.Item
                                    key={theme.themeName}
                                    onClick={() => setEditorTheme(theme.themeName)}
                                >
                                    {theme.themeTitle}
                                </Dropdown.Item>
                            )
                        })}
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
                    onMount={handleEditorMounted}
                    theme={editorTheme}
                />
            </Card.Body>

            <Card.Footer>
                <Button onClick={() => props.runCodeFunc(editorCode, backendLang)} variant="success">Run Code</Button>
            </Card.Footer>
        </Card>
    );

}