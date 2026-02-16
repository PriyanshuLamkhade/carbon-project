import React from "react";

export default function PreviewPopup({ visible, onClose, data }:any) {
  if (!visible || !data) return null;

  const { previewData } = data || {};
  const submission = previewData?.submission || {};
  const carbon = previewData?.carbon || {};

  const displayValue = (value:any) =>
    value === null || value === undefined || value === "" ? "—" : String(value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90%] md:w-[650px] bg-white rounded-lg shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-400 text-white px-5 py-3">
          <h2 className="text-lg font-semibold">Submission Preview</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Basic Info */}
          <section>
            <h3 className="text-gray-700 font-semibold mb-2">Basic Info</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <p><span className="font-medium">History ID:</span> {displayValue(previewData?.historyId)}</p>
              <p><span className="font-medium">User ID:</span> {displayValue(previewData?.userId)}</p>
              <p><span className="font-medium">Status:</span> {displayValue(previewData?.status)}</p>
              <p><span className="font-medium">Timestamp:</span> {displayValue(new Date(previewData?.timestamp).toLocaleString())}</p>
            </div>
          </section>

          {/* Carbon Info */}
          <section>
            <h3 className="text-gray-700 font-semibold mb-2">Carbon Info</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <p><span className="font-medium">Cleaned:</span> {displayValue(carbon.cleaned)}</p>
              <p><span className="font-medium">Token Issued:</span> {displayValue(carbon.tokenIssued)}</p>
            </div>
          </section>

          {/* Submission Details */}
          <section>
            <h3 className="text-gray-700 font-semibold mb-2">Submission Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <p><span className="font-medium">Submission ID:</span> {displayValue(submission.submissionId)}</p>
              <p><span className="font-medium">Location:</span> {displayValue(submission.location)}</p>
              <p><span className="font-medium">Longitude:</span> {displayValue(submission.longitude)}</p>
              <p><span className="font-medium">Latitude:</span> {displayValue(submission.latitude)}</p>
              <p><span className="font-medium">Geo Tag:</span> {displayValue(submission.geoTag)}</p>
              <p><span className="font-medium">Area Claim:</span> {displayValue(submission.areaclaim)}</p>

              <p><span className="font-medium">Species 1:</span> {displayValue(submission.species1)}</p>
              <p><span className="font-medium">Species 1 Count:</span> {displayValue(submission.species1_count)}</p>
              <p><span className="font-medium">Species 2:</span> {displayValue(submission.species2)}</p>
              <p><span className="font-medium">Species 2 Count:</span> {displayValue(submission.species2_count)}</p>
              <p><span className="font-medium">Species 3:</span> {displayValue(submission.species3)}</p>
              <p><span className="font-medium">Species 3 Count:</span> {displayValue(submission.species3_count)}</p>

              <p><span className="font-medium">Plantation Date:</span> {displayValue(submission.plantationDate)}</p>
              <p><span className="font-medium">Community Level:</span> {displayValue(submission.CommunityInvolvementLevel)}</p>
              <p><span className="font-medium">MGNREGA Person Days:</span> {displayValue(submission.MGNREGAPersonDays)}</p>
              <p><span className="font-medium">Trained:</span> {displayValue(submission.trained)}</p>
              <p><span className="font-medium">Submission Date:</span> {displayValue(submission.submissionDate ? new Date(submission.submissionDate).toLocaleString() : null)}</p>
            </div>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-gray-700 font-semibold mb-2">Description</h3>
            <p className="text-gray-700 text-sm bg-gray-100 p-3 rounded-md">
              {displayValue(submission.description)}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
