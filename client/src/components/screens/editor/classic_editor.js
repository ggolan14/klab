import React from "react";
import PropTypes from 'prop-types';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'

const ClassicEditorElement = ({toolbar, data, onChange, part, isReadOnly, disabled, removeToolBar}) => {

    return (
        <CKEditor
            editor={ ClassicEditor }
            removePlugins={removeToolBar ? 'toolbar' : ''}
            disabled={disabled}
            config={{
                toolbar: toolbar !== null ? toolbar : [],
                isReadOnly,
                link:{
                    decorators: {
                        isExternal: {
                            mode: 'automatic',
                            callback: url => url.startsWith('http') || url.startsWith('mailto') ,
                            attributes: {
                                target: '_blank',
                                rel: 'noopener noreferrer'
                            }
                        }
                    }
                }
            }}
            onReady={ editor => {

            } }
            data={data}
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                onChange(part, data)

            } }
            onBlur={ ( event, editor ) => {
            } }
            onFocus={ ( event, editor ) => {
            } }
        />
    )
}

ClassicEditorElement.propTypes = {
    toolbar: PropTypes.any
};

export default ClassicEditorElement;

