import React from 'react';
import Editor from 'react-simple-code-editor';
import 'prismjs/themes/prism.css';
import { highlight, languages } from 'prismjs';

export const BasicEditor = ({ value, onChange, language }: { value: string, onChange: (value: string) => void, language: string }) => {
  return (
    <div className="h-[61vh]   overflow-auto border border-solid border-[#ddd] rounded-lg " >
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={(code) => highlight(code, languages[language] || languages.js, language)} 
        padding={10}
        className="min-h-[477px] text-black dark:text-white dark:bg-[#303030] bg-[#f5f5f5] text-size-[16px]"
      />
    </div>
  );
};
