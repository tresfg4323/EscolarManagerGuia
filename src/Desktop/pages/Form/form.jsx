import React, { useState, useRef, useEffect} from 'react';
import JoditEditor from 'jodit-react';
import './FormModal.css';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Editor = ({ onChange }) => {
  const editor = useRef(null);

  const config = {
    readonly: false,
    height: 400,
    width: 1120,
    uploader: {
      url: '',
      filesVariableName: '',
      headers: {},
      prepareData: (formData) => {
        // add any additional data to the formData object here
        return formData;
      },
      process: (response, formData) => {
        // process the response here and return the image URL
        return response.url; // return the original image URL
      },
      error: (e) => {
        // handle any errors that occur during image upload
      },
    },
  };

  const handleBlur = (newContent) => {
    onChange(newContent);
  };

  return (
    <JoditEditor
      ref={editor}
      config={config}
      tabIndex={1} // tabIndex of textarea
      onBlur={handleBlur} // preferred to use only this option to update the content for performance reasons
      onChange={(newContent) => {}}
    />
  );
};

const SugestaoForm = (props) => {
  const [sugestao, setSugestao] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [nome, setNome] = useState('')
  const linkAtual = window.location.href
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Link da página anterior: ${linkAtual}`);
    console.log(`Editor Content: ${editorContent}`);
    
    // Enviar sugestão por e-mail
    fetch('https://back-endguiaescolarmanager.onrender.com/sugestao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ linkAtual, editorContent, nome }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Sugestão enviada com sucesso!');
          props.onClose();
        } else {
          console.log('Ocorreu um erro ao enviar a sugestão.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNome = (event) => {
    setNome(event.target.value);
  }

  const handleChange = (event) => {
    setSugestao(event.target.value);
  };

  const handleEditorChange = (newContent) => {
    setEditorContent(newContent);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <br />
      <label className='input-name-container'>
        Nome: <input type="text" value={nome} onChange={handleNome} id='nome-iput'/>
      </label>
      <br />
      <label>
        <h2 className="h2-text-style">Sua sugestão:</h2>
        <Editor onChange={handleEditorChange} className="teste" />
      </label>
      <br />
      <label>
        Link da página que sera alterada: <input type="text-link-style" value={linkAtual} readOnly />
        {/* <FontAwesomeIcon icon={faEnvelope} /> */}
      </label>
      <br />
      <button className="btn-style" type="submit">
        Enviar
      </button>
      <br />
      <Link to="/">
        <button className="btn-style" type="button" onClick={props.onClose}>
          Cancelar
        </button>
      </Link>
    </form>
  );
};

export default SugestaoForm;
