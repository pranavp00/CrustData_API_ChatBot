import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
const CodeBlock = ({ language, code }) => {
  return (
    <SyntaxHighlighter language={language} style={dracula}>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;