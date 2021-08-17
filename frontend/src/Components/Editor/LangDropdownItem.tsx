import { Dropdown } from "react-bootstrap";

interface LangDropdownProps {
    editorLang: string;
    backendLang: string;
    title: string;
}

export const LangDropdownItem: React.FC<LangDropdownProps> = (props: LangDropdownProps) => {
    return (
        <Dropdown.Item>
            {props.title}
        </Dropdown.Item>
    )
}


