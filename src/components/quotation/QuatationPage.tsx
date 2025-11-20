import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CancelIcon from "@mui/icons-material/Cancel";
import Cookies from "js-cookie";
import baseUrl from "@/config/baseurl";

interface CostDetail {
  costHead: string;
  particulars: string | null;
  securityGuardSemiSkilled: number | null;
  securitySupervisorSkilled: number | null;
}

interface CompanyHours {
  title: string;
  costDetails: CostDetail[];
}

interface QuotationProps {
  companyDName: string;
  companyHours: CompanyHours;
  note: string[];
}

interface QuotationModalProps {
  closeModal: () => void;
  data: any[];
  rows: any;
  // id: any;
}

const Quotation: React.FC<QuotationModalProps> = ({
  closeModal,
  data,
  rows,
  // id,
}) => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [quotationData, setQuotationData] = useState<QuotationProps | null>(
    null
  );
  const printRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState<boolean>(false);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get(
          `${baseUrl}/quotation/pdf`,{
            headers: {
              authorization: `Bearer ${token}`, // Corrected the template string
            },
            withCredentials: true,
          }
        );
        setCompanies(Object.keys(response.data));
        console.log(response.data, "companies");
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setSelectedService("");
    setQuotationData(null);
    if (company === "ZPlusSecurity") {
      setAvailableServices(["8h", "12h"]);
    } else if (company === "MrCorporate") {
      setAvailableServices(["12h"]);
    } else if (company === "UtkalFacility") {
      setAvailableServices(["8h"]);
    } else {
      setAvailableServices([]);
    }
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };
  const handleClose = () => {
    console.log("Close modal triggered");
    closeModal();
  };

  const handleSendEmail = async () => {
    try {
      const compid = "";

      if (!compid) {
        alert("Company ID is missing!"); // Alert if compid is not found
        return;
      }

      // Filter the data based on selected rows
      const selectedData = data.filter((item) => rows.has(item.sl));
      alert(`Selected Rows Count: ${selectedData.length}`); // Alert showing how many rows are selected

      if (selectedData.length === 0) {
        alert("No rows selected!"); // Alert if no rows are selected
        return;
      }

      // Loop through each selected row and send an API request
      await Promise.all(
        selectedData.map(async (data) => {
          if (!data.username || !data.email || !data.number) {
            alert(`Missing required fields for: ${data.username}`); // Alert if required fields are missing
            console.error("Missing required fields:", data);
            return;
          }

          alert(`Sending email for: ${data.username}`); // Alert to show data that is being sent

          // Send the API request
          try {
            const token = Cookies.get('accessToken');
            await axios.post(
             `${baseUrl}/quotations/create`,{
                headers: {
                  authorization: `Bearer ${token}`, // Corrected the template string
                },
                withCredentials: true,
              },
              { ...data, compid },
            );
            alert(`Quotation Created for: ${data.username}`); // Success alert for each customer
          } catch (err) {
            alert(`Error sending quotation for: ${data.username}`); // Alert for any error during API request
            console.error("Error creating quotation:", err);
          }
        })
      );
    } catch (error) {
      alert("An error occurred while sending selected rows."); // General error alert
      console.error("Error sending selected rows:", error);
    }
  };

  const generatePdf = async () => {
    if (!selectedCompany) return;

    try {
      const servicesToFetch =
        selectedService === "All Services" ? ["8h", "12h"] : [selectedService];
      const fetchedQuotationData: QuotationProps = {
        companyDName: selectedCompany,
        companyHours: { title: "", costDetails: [] },
        note: [],
      };

      for (const service of servicesToFetch) {
        const token = Cookies.get('accessToken');
        const response = await axios.post(
          `${baseUrl}/quotation/pdf`,
          {
            companyName: selectedCompany,
            hours: service,
          },{
            headers: {
              authorization: `Bearer ${token}`, // Corrected the template string
            },
            withCredentials: true,
          }
        );
        console.log("Fetched response for service:", service, response.data);
        const companyData = response.data;
        fetchedQuotationData.companyDName = companyData.companyDName;
        fetchedQuotationData.companyHours = companyData.companyHours;
        fetchedQuotationData.note = response.data.note;
      }

      setQuotationData(fetchedQuotationData);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDownload = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 190; // Adjust to your needs
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`${selectedCompany}_Quotation.pdf`);
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg border z-30 relative">
        {/* Close icon */}
        <CancelIcon
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          fontSize="large"
        />

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Company</h2>
          {companies.map((company) => (
            <button
              key={company}
              onClick={() => handleCompanySelect(company)}
              className={`mx-2 mb-2 p-2 border ${
                selectedCompany === company
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              } rounded`}
            >
              {company}
            </button>
          ))}
        </div>

        {selectedCompany && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Services for {selectedCompany}
            </h2>
            {availableServices.map((service) => (
              <button
                key={service}
                onClick={() => handleServiceSelect(service)}
                className={`mx-2 mb-2 p-2 border ${
                  selectedService === service
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300"
                } rounded`}
              >
                {service}
              </button>
            ))}
          </div>
        )}

        {selectedService && (
          <button
            onClick={generatePdf}
            className=" p-2 bg-blue-500 text-white rounded"
          >
            Generate PDF
          </button>
        )}

        {quotationData && (
          <div ref={printRef} className="bg-white p-2 rounded shadow-md mt-2">
            <h1 className="text-4xl font-bold py-2 text-center">
              {quotationData?.companyDName}
            </h1>

            <div className="mb-4">
              <h3 className="font-bold text-center py-2 mb-4 text-2xl">
                {quotationData?.companyHours?.title}
              </h3>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">
                      Cost Head
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Particulars
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Security Guard (Semi-Skilled)
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Security Supervisor (Skilled)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quotationData?.companyHours?.costDetails.map(
                    (detail, indexa) => (
                      <tr key={indexa}>
                        <td className="border border-gray-300 p-2">
                          {detail.costHead}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {detail.particulars || "N/A"}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {detail?.securityGuardSemiSkilled !== null
                            ? detail?.securityGuardSemiSkilled
                            : "N/A"}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {detail?.securitySupervisorSkilled !== null
                            ? detail?.securitySupervisorSkilled
                            : "N/A"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 border-t border-gray-300">
              <h2 className="text-xl font-semibold">Terms and Conditions:</h2>
              <p className="text-sm mt-2">
                GST 18% extra applicable as per Govt notification. The Billing
                rate will be revised according to the Govt. notification. Above
                quoted rate includes statutory compliances.
              </p>
            </div>
          </div>
        )}
      </div>

      {quotationData && (
        <div>
          <div className="absolute top-1 right-[14%] z-40">
            {quotationData && (
              <CancelIcon
                onClick={handleClose}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                fontSize="large"
              />
            )}
          </div>
          <div className="absolute bottom-24 right-[4%] z-40 ">
            <button
              className="bg-blue-950 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
              onClick={handleDownload}
            >
              <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              Download
            </button>
          </div>
          <div
            className="absolute bottom-8 right-[3%] z-40 "
            onClick={handleSendEmail}
          >
            <button className="bg-blue-950 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
              <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              Send to Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotation;













































// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import CancelIcon from "@mui/icons-material/Cancel";
// import Cookies from "js-cookie";
// import baseUrl from "@/config/baseurl";

// interface CostDetail {
//   costHead: string;
//   particulars: string | null;
//   securityGuardSemiSkilled: number | null;
//   securitySupervisorSkilled: number | null;
// }

// interface CompanyHours {
//   title: string;
//   costDetails: CostDetail[];
// }

// interface QuotationProps {
//   companyDName: string;
//   companyHours: CompanyHours;
//   note: string[];
// }

// interface QuotationModalProps {
//   closeModal: () => void;
//   data: any[];
//   rows: any;
//   // id: any;
// }

// const QuotationPage: React.FC<QuotationModalProps> = ({
//   closeModal,
//   data,
//   rows,
  
// }:any) => {
//   const [companies, setCompanies] = useState<string[]>([]);
//   const [selectedCompany, setSelectedCompany] = useState<string>("");
//   const [selectedService, setSelectedService] = useState<string>("");
//   const [quotationData, setQuotationData] = useState<QuotationProps | null>(
//     null
//   );
//   const printRef = useRef<HTMLDivElement>(null);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [showPDFPreview, setShowPDFPreview] = useState<boolean>(false);
//   const [availableServices, setAvailableServices] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const token = Cookies.get('accessToken');
//         const response = await axios.get(
//           `${baseUrl}/quotation/pdf`
//         );
//         setCompanies(Object.keys(response.data));
//         console.log(response.data, "companies");
//       } catch (error) {
//         console.error("Error fetching companies:", error);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   const handleCompanySelect = (company: string) => {
//     setSelectedCompany(company);
//     setSelectedService("");
//     setQuotationData(null);
//     if (company === "ZPlusSecurity") {
//       setAvailableServices(["8h", "12h"]);
//     } else if (company === "MrCorporate") {
//       setAvailableServices(["12h"]);
//     } else if (company === "UtkalFacility") {
//       setAvailableServices(["8h"]);
//     } else {
//       setAvailableServices([]);
//     }
//   };


//   useEffect(()=>{
//     const getData = async()=>{
//       const token = Cookies.get('accessToken');
//       const responce= await axios.get(`${baseUrl}/quotation/get?companyName=MrCorporate&hours=12`, {
//         headers: {
//           authorization: `Bearer ${token}`, // Corrected the template string
//         },
//         withCredentials: true,
//       })
//         console.log(responce.data, "get data from")
//     }
//     getData()
//   })


//   const handleServiceSelect = (service: string) => {
//     setSelectedService(service);
//   };

//   const handleSendEmail = async () => {
//     try {
//       const compid = "";

//       if (!compid) {
//         alert("Company ID is missing!"); // Alert if compid is not found
//         return;
//       }

//       // Filter the data based on selected rows
//       const selectedData = data.filter((item:any) => rows.has(item.sl));
//       alert(`Selected Rows Count: ${selectedData.length}`); // Alert showing how many rows are selected

//       if (selectedData.length === 0) {
//         alert("No rows selected!"); // Alert if no rows are selected
//         return;
//       }

//       // Loop through each selected row and send an API request
//       await Promise.all(
//         selectedData.map(async (data:any) => {
//           if (!data.username || !data.email || !data.number) {
//             alert(`Missing required fields for: ${data.username}`); // Alert if required fields are missing
//             console.error("Missing required fields:", data);
//             return;
//           }

//           alert(`Sending email for: ${data.username}`); // Alert to show data that is being sent

//           // Send the API request
//           try {
//             const token = Cookies.get('accessToken');
//             await axios.post(
//               `${baseUrl}/quotations/create`,
//               { ...data, compid },
//               {
//                 headers: {
//                   authorization: `Bearer ${token}`, // Corrected the template string
//                 },
//                 withCredentials: true,
//               }
//             );
//             alert(`Quotation Created for: ${data.username}`); // Success alert for each customer
//           } catch (err) {
//             alert(`Error sending quotation for: ${data.username}`); // Alert for any error during API request
//             console.error("Error creating quotation:", err);
//           }
//         })
//       );
//     } catch (error) {
//       alert("An error occurred while sending selected rows."); // General error alert
//       console.error("Error sending selected rows:", error);
//     }
//   };

//   const generatePdf = async () => {
//     if (!selectedCompany) return;

//     try {
//       const servicesToFetch =
//         selectedService === "All Services" ? ["8h", "12h"] : [selectedService];
//       const fetchedQuotationData: QuotationProps = {
//         companyDName: selectedCompany,
//         companyHours: { title: "", costDetails: [] },
//         note: [],
//       };

//       for (const service of servicesToFetch) {
//         const token = Cookies.get('accessToken');
//         const response = await axios.post(
//           `${baseUrl}/quotation/pdf`,
//           {
//             companyName: selectedCompany,
//             hours: service,
//           }, {
//             headers: {
//               authorization: `Bearer ${token}`, // Corrected the template string
//             },
//             withCredentials: true,
//           }
//         );
//         console.log("Fetched response for service:", service, response.data);
//         const companyData = response.data;
//         fetchedQuotationData.companyDName = companyData.companyDName;
//         fetchedQuotationData.companyHours = companyData.companyHours;
//         fetchedQuotationData.note = response.data.note;
//       }

//       setQuotationData(fetchedQuotationData);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     }
//   };

//   const handleDownload = async () => {
//     if (!printRef.current) return;

//     const canvas = await html2canvas(printRef.current);
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF();
//     const imgWidth = 190; // Adjust to your needs
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
//     pdf.save(`${selectedCompany}_Quotation.pdf`);
//   };

//   return (
//     <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 ">
//       <div className="bg-white p-6 rounded-lg shadow-lg border z-30 relative">
//         {/* Close icon */}
//         <CancelIcon
//           onClick={closeModal}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//           fontSize="large"
//         />

//         <div className="mb-4">
//           <h2 className="text-xl font-semibold mb-2">Select Company</h2>
//           {companies.map((company) => (
//             <button
//               key={company}
//               onClick={() => handleCompanySelect(company)}
//               className={`mx-2 mb-2 p-2 border ${
//                 selectedCompany === company
//                   ? "border-blue-500 bg-blue-100"
//                   : "border-gray-300"
//               } rounded`}
//             >
//               {company}
//             </button>
//           ))}
//         </div>

//         {selectedCompany && (
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">
//               Services for {selectedCompany}
//             </h2>
//             {availableServices.map((service) => (
//               <button
//                 key={service}
//                 onClick={() => handleServiceSelect(service)}
//                 className={`mx-2 mb-2 p-2 border ${
//                   selectedService === service
//                     ? "border-blue-500 bg-blue-100"
//                     : "border-gray-300"
//                 } rounded`}
//               >
//                 {service}
//               </button>
//             ))}
//           </div>
//         )}

//         {selectedService && (
//           <button
//             onClick={generatePdf}
//             className=" p-2 bg-blue-500 text-white rounded"
//           >
//             Generate PDF
//           </button>
//         )}

//         {quotationData && (
//           <div ref={printRef} className="bg-white p-2 rounded shadow-md mt-2">
//             <h1 className="text-4xl font-bold py-2 text-center">
//               {quotationData.companyDName}
//             </h1>

//             <div className="mb-4">
//               <h3 className="font-bold text-center py-2 mb-4 text-2xl">
//                 {quotationData.companyHours.title}
//               </h3>
//               <table className="min-w-full border-collapse border border-gray-300">
//                 <thead>
//                   <tr>
//                     <th className="border border-gray-300 p-2 text-left">
//                       Cost Head
//                     </th>
//                     <th className="border border-gray-300 p-2 text-left">
//                       Particulars
//                     </th>
//                     <th className="border border-gray-300 p-2 text-left">
//                       Security Guard (Semi-Skilled)
//                     </th>
//                     <th className="border border-gray-300 p-2 text-left">
//                       Security Supervisor (Skilled)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {quotationData.companyHours.costDetails.map(
//                     (detail, indexa) => (
//                       <tr key={indexa}>
//                         <td className="border border-gray-300 p-2">
//                           {detail.costHead}
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           {detail.particulars || "N/A"}
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           {detail.securityGuardSemiSkilled !== null
//                             ? detail.securityGuardSemiSkilled
//                             : "N/A"}
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           {detail.securitySupervisorSkilled !== null
//                             ? detail.securitySupervisorSkilled
//                             : "N/A"}
//                         </td>
//                       </tr>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-6 p-4 border-t border-gray-300">
//               <h2 className="text-xl font-semibold">Terms and Conditions:</h2>
//               <p className="text-sm mt-2">
//                 GST 18% extra applicable as per Govt notification. The Billing
//                 rate will be revised according to the Govt. notification. Above
//                 quoted rate includes statutory compliances.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {quotationData && (
//         <div>
//           <div className="absolute top-1 right-[14%] z-40">
//             {quotationData && (
//               <CancelIcon
//                 onClick={closeModal}
//                 className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                 fontSize="large"
//               />
//             )}
//           </div>
//           <div className="absolute bottom-24 right-[4%] z-40 ">
//             <button
//               className="bg-blue-950 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
//               onClick={handleDownload}
//             >
//               <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
//               Download
//             </button>
//           </div>
//           <div
//             className="absolute bottom-8 right-[3%] z-40 "
//             onClick={handleSendEmail}
//           >
//             <button className="bg-blue-950 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
//               <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
//               Send to Email
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuotationPage;
