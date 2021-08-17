import { Dropdown } from "react-bootstrap";

interface LangDropdownProps {
    editorLang: string;
    backendLang: string;
    title: string;
    setMonacoLang: (lang: string) => void;
    setBackendLang: (lang: string) => void;
}

export const changeActive = (event) => {
    event.target.classList.add('active');
    const parentChildren = event.target.parentElement.children;
    for (let i = 0; i < parentChildren.length; i++){
        if (parentChildren.item(i) !== event.target && parentChildren.item(i).classList.contains('active')){
            parentChildren.item(i).classList.remove('active');
        }
    }
}

export const LangDropdownItem: React.FC<LangDropdownProps> = (props: LangDropdownProps) => {

    return (
        <Dropdown.Item 
            onClick={(evt) => {
                changeActive(evt);
                props.setMonacoLang(props.editorLang);
                props.setBackendLang(props.backendLang);
            }}
            className={props.editorLang === 'javascript' ? 'active' : ''}
        >
            {props.title}
        </Dropdown.Item>
    )
}


