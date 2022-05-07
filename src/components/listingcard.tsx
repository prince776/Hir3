import React, { useState } from "react";

function Listingcard(props: any) {
  return (
    <a href={props.uploadLink}>
      <div className="card text-white bg-primary m-3 position-fixed hover-shadow">
        <div className="card-header">Want to get listed?</div>
        <div className="card-body">
          <h5 className="card-title">Upload your updated resume!</h5>
          <p className="card-text">
            Recruiters keep scrolling different resumes to choose the right
            candidate for the job.
          </p>
        </div>
      </div>
    </a>
  );
}

export default Listingcard;
