import React from 'react';
import { propTypes } from 'redux-form/immutable';

export const renderField = field => (
    <div>
      <input {...field.input} 
        maxLength = {field.maxLength?field.maxLength:''}
        className = {field.className}
        placeholder={field.label}/>

      {field.meta.touched && (field.meta.error && <span className="error">{field.meta.error}</span>)}
    </div>
);

renderField.propTypes = Object.assign({}, ...propTypes, {label:React.PropTypes.string});


export const renderCheckbox = field => {
  return (
      <input {...field.input} 
        type="checkbox"
        className = {"checkbox" + field.className?field.className:""}/>);
};
