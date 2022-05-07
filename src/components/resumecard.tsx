import React, { useState } from "react";
const reactPdf = require("react-pdf/dist/esm/entry.webpack5");
const { Document, Page } = reactPdf;

function Resumecard(props: any) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: any }) {
    setNumPages(numPages);
  }

  return (
    <a
      className="card m-3 hover-zoom ripple shadow-1-strong"
      href={props.file}
      target="_blank"
    >
      <div className="row g-0">
        <div className="col-md-2">
          <div className="img-fluid rounded-start thumbnail-wrapper">
            <Document
              file={{
                url: props.preview,
              }}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                pageNumber={pageNumber}
                height={200}
                renderMode="svg"
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        </div>
        <div className="col-md-10">
          <div className="card-body">
            <h5 className="card-title">{props.name}</h5>
            <p className="card-text text-muted">{props.bio}</p>
          </div>
        </div>
      </div>
    </a>
  );
}

export default Resumecard;
