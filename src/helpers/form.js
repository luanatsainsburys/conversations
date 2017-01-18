import React from 'react';
import { propTypes } from 'redux-form/immutable';

export const renderField = field => (
    <div>
      <input {...field.input} 
        maxLength = {field.maxLength?field.maxLength:''}
        placeholder={field.label} 
        className="form-control"/>

      {field.meta.touched && (field.meta.error && <span className="error">{field.meta.error}</span>)}
    </div>
);

renderField.propTypes = Object.assign({}, ...propTypes, {label:React.PropTypes.string});