import { faEraser, faImage, faPencilAlt, faTextHeight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@mui/material';
import { FC } from 'react';
import { Tool } from '../interfaces';

interface Props {
    tool: Tool;
    setTool: (value: React.SetStateAction<Tool>) => void;
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BUTTON_STYLE = {
    default: {
        cursor: 'pointer',
        backgroundColor: 'white',
        border: '1px solid gray',
        width: '2.2rem',
        height: '2.5rem'
    },
    selected: {
        cursor: 'pointer',
        backgroundColor: 'white',
        border: '3px solid gray',
        width: '2.2rem',
        height: '2.5rem'
    }
};

export const Settings: FC<Props> = ({ tool, setTool, color, setColor, handleImageUpload }) => {
    return (
        <div className="settings-container">
            <Tooltip title="Select pencil tool" arrow>
                <button 
                    onClick={() => setTool('pencil')} 
                    style={tool === 'pencil' ? BUTTON_STYLE.selected : BUTTON_STYLE.default}
                >
                    <FontAwesomeIcon icon={faPencilAlt} className="icon" />
                </button>
            </Tooltip>
            <Tooltip title="Select text tool" arrow>
                <button 
                    onClick={() => setTool('text')} 
                    style={tool === 'text' ? BUTTON_STYLE.selected : BUTTON_STYLE.default}
                >
                    <FontAwesomeIcon icon={faTextHeight} className="icon" />
                </button>
            </Tooltip>
            <Tooltip title="Select eraser tool" arrow>
                <button 
                    onClick={() => setTool('eraser')} 
                    style={tool === 'eraser' ? BUTTON_STYLE.selected : BUTTON_STYLE.default}
                >
                    <FontAwesomeIcon icon={faEraser} className="icon" />
                </button>
            </Tooltip>
            <Tooltip title="Select image tool" arrow>
                <button 
                    onClick={() => setTool('image')} 
                    style={tool === 'image' ? BUTTON_STYLE.selected : BUTTON_STYLE.default}
                >
                    <FontAwesomeIcon icon={faImage} className="icon" />
                </button>
            </Tooltip>
            <Tooltip title="Choose color" arrow>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="color-picker"
                />
            </Tooltip>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="imageUpload"
            />
            <Tooltip title="Upload image" arrow>
                <label htmlFor="imageUpload" className="upload-label">
                    <FontAwesomeIcon icon={faImage} className="icon" />
                </label>
            </Tooltip>
        </div>
    );
};
