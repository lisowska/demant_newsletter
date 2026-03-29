import { FormDataDTO } from "models/FormDataDTO";
import { FunctionComponent } from "react";

interface Props {
  data: Partial<FormDataDTO>;
}

const DataPreview: FunctionComponent<Props> = ({ data }) => {
  return (
    <div
      id="form-data-preview"
      className="w-full max-w-[600px] min-w-0 rounded-6 bg-white p-6 sm:p-8 md:p-12"
    >
      <div className="mb-6 text-balance text-head-3 font-medium sm:mb-8">
        Form data preview ania
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 sm:gap-y-6">
        <span className="font-medium text-grey-0100">Email:</span>
        <span className="min-w-0 break-words text-grey-0100 sm:break-normal">
          {data.email?.trim() ? data.email : "—"}
        </span>
        <span className="font-medium text-grey-0100">Clinic:</span>
        <ul className="min-w-0 list-none pl-0">
          {data.clinic && data.clinic.length > 0 ? (
            data.clinic.map((line, index) => (
              <li
                key={`clinic-line-${index}`}
                className="mb-4 break-words leading-none last:mb-0"
              >
                {line || "—"}
              </li>
            ))
          ) : (
            <li className="leading-none text-grey-0500">—</li>
          )}
        </ul>
        <span className="font-medium text-grey-0100">Accepted terms:</span>
        <span className="text-grey-0100">
          {data.acceptedTerms ? "Yes" : "No"}
        </span>
      </div>
    </div>
  );
};

export default DataPreview;
