import React from "react";
import PropTypes from 'prop-types';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'

const BalloonEditorElement = ({}) => {

    return (
        <CKEditor
            editor={ BalloonEditor }
            config={{
                // toolbar: ['bold', 'italic', '|', 'undo', 'redo']
                plugins: [ Essentials, Paragraph, Bold, Italic ],
                toolbar: [ 'bold', 'italic' ]
            }}
            data="<p>Hello from Balloon !</p>"
            onReady={ editor => {
                // You can store the "editor" and use when it is needed.
            } }
            onChange={ ( event, editor ) => {
                const data = editor.getData();
            } }
            onBlur={ ( event, editor ) => {
            } }
            onFocus={ ( event, editor ) => {
            } }
        />
    )
}

BalloonEditorElement.propTypes = {

};

export default BalloonEditorElement;
