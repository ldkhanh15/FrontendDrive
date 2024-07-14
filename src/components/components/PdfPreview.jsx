import React from 'react';


const PdfPreview = ({ url }) => {
    return (
        <embed
          src={url}
          type="application/pdf"
          width="100%"
          height="600px"
        />
    )
  };

export default PdfPreview;
