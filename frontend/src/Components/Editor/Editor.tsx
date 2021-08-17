import { Card, Dropdown } from "react-bootstrap";


import { LangDropdowns } from "../../data/lang-dropdowns";
import { LangDropdownItem } from './LangDropdownItem'; 

export const Editor : React.FC = () => {

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
                                    title={title}
                                    backendLang={backendLang}
                                    editorLang={editorLang}
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
            
            <Card.Body>

            </Card.Body>

            <Card.Footer>

            </Card.Footer>
        </Card>
    );

}