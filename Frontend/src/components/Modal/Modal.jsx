import React from 'react';
import './Modal.css';

const Modal = ({ type, message, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className={`modal-box ${type}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-icon">
                    {type === 'success' ? '✅' : '❌'}
                </div>
                <p className="modal-message">{message}</p>
                <button className="modal-button" onClick={onClose}>
                    ACEPTAR
                </button>
            </div>
        </div>
    );
};

export default Modal;