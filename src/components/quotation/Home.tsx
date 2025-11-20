import { useEffect, useState } from "react";
import { cardsArr , companiesArr} from "@/src/utils/index";
import axios from "axios";
import baseUrl from '@/config/baseurl';
import CancelIcon from "@mui/icons-material/Cancel";
import CommonCards from "../commonComponents/CommonCards";
import Cookies from "js-cookie";



// import Quotation from "./Quotation";

export default function Home() {
  const [tableOpen, setTableOpen] = useState<number>(0);
  const [allData, setAllData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState<boolean>(false);

  useEffect(() => {
    fetchData(cardsArr[tableOpen]?.path || "inquiry");
    console.log(companiesArr);
  }, [tableOpen]);

  const fetchData = async (path: string) => {
    
    try {
      const response = await axios.get(
        `${baseUrl}/getall`,
        { withCredentials: true }
      );
      setAllData(response.data);
      if (response.data.length > 0) {
        setColumns(Object.keys(response.data[0]));
      }

      const compid = Cookies.get("compid");

      if (compid) {
        console.log("compid from cookie:", compid);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRowClick = (rowData: any) => {
    setSelectedRowData(rowData);
    if (cardsArr[tableOpen]?.path === "quotation" && rowData?.compid) {
      previewPDF(rowData.compid);
    }
  };

  const closeModal = () => {
    setSelectedRowData(null);
    setPdfUrl(null);
    setShowPDFPreview(false);
  };

  const previewPDF = async (compid: string) => {
    try {
      const response = await axios.get(
        `${baseUrl}quotation/pdf/${compid}`,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
      setShowPDFPreview(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDelete = async (path: string, id: number) => {
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      setAllData(allData.filter((item) => item.sl !== id));
      setSelectedRows((prev) => {
        const newSelection = new Set(prev);
        newSelection.delete(id);
        return newSelection;
      });
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCheckboxChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    setSelectedRows((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
      return newSelection;
    });
  };

  const handleSendSelected = async () => {
    try {
      const compid = Cookies.get("compid");
      const selectedData = allData.filter((item) => selectedRows.has(item.sl));
      await Promise.all(
        selectedData.map(async (data) => {
          if (!data.username || !data.email || !data.number) {
            console.error("Missing required fields:", data);
            return;
          }
          await axios.post(
            `${baseUrl}/customer/create`,
            { ...data, compid },
            { withCredentials: true }
          );
          alert("Customer Created");
        })
      );
    } catch (error) {
      console.error("Error sending selected rows:", error);
    }
  };

  return (
    <section className="flex flex-col gap-8 w-full h-full p-4">
      {/* Cards Section */}
      <div className="flex gap-12">
        {cardsArr.map((items: any, index: number) => (
          <div
            key={items.id}
            className="cursor-pointer"
            onClick={() => setTableOpen(index)}
          >
            <CommonCards data={items} />
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div>
        <input
          className="bg-zinc-200 w-full text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-blue-800 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg"
          placeholder="Company Name"
          name="text"
          type="text"
        />
      </div>

      {/* Data Table */}
      <div className="w-full rounded border border-gray-200 bg-white shadow text-gray-600">
        <header className="border-b border-gray-100 px-5 py-4">
          <div className="font-semibold text-gray-800">
            {cardsArr[tableOpen]?.title}
          </div>
        </header>
        <div className="overflow-x-auto p-3">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400">
              <tr>
                {columns.map((col, index) => (
                  <th className="p-2" key={index}>
                    <div className="text-left font-semibold">{col}</div>
                  </th>
                ))}
                <th className="p-2">
                  <div className="text-center font-semibold">Action</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {allData.map((item: any) => (
                <tr
                  key={item.sl}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  {columns.map((col, index) => (
                    <td className="p-2" key={index}>
                      <div className="text-left">{item[col]}</div>
                    </td>
                  ))}
                  <td className="p-2 flex items-center gap-2">
                    {cardsArr[tableOpen]?.path === "quotation" && (
                      <label
                        htmlFor={`checkbox-${item.sl}`} // Unique id for each checkbox
                        className="flex flex-row items-center gap-2.5 dark:text-white light:text-black"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          id={`checkbox-${item.sl}`} // Unique id for each checkbox
                          type="checkbox"
                          className="peer hidden"
                          onChange={(e) => handleCheckboxChange(item.sl, e)}
                          checked={selectedRows.has(item.sl)}
                        />
                        <div className="h-5 w-5 flex rounded-md border border-[#00000033] light:bg-[#e8e8e8] dark:bg-[#212121] peer-checked:bg-[#7152f3] transition">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            className="w-5 h-5 light:stroke-[#e8e8e8] dark:stroke-[#212121]"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 12.6111L8.92308 17.5L20 6.5"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </div>
                      </label>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cardsArr[tableOpen]?.path, item.sl);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Selected Button for Inquiry */}
      {selectedRows.size > 0 && cardsArr[tableOpen]?.path === "quotation" && (
        <div className="flex justify-end">
          <button
            className="overflow-hidden w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group"
            onClick={handleSendSelected}
          >
            Selected
            <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
            <span className="absolute w-36 h-32 -top-8 -left-2 bg-purple-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
            <span className="absolute w-36 h-32 -top-8 -left-2 bg-purple-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
            <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-10 z-10">
              Send
            </span>
          </button>
        </div>
      )}

      {/* Row Details Modal */}
      {selectedRowData &&
        !["quotation", "inquiry"].includes(cardsArr[tableOpen]?.path) && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className=" p-4  shadow-lg max-w-md relative border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.01)] text-white font-nunito  flex justify-center items-left flex-col gap-[0.75em] backdrop-blur-[12px]">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white hover:text-blue-100"
              >
                <CancelIcon />
              </button>
              <h2 className="text-lg font-semibold mb-4">Row Details</h2>
              <ul>
                {columns.map((col, index) => (
                  <li key={index}>
                    <strong>{col}:</strong> {selectedRowData[col]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      {selectedRowData &&
        !["quotation", "customer"].includes(cardsArr[tableOpen]?.path) && (
          <>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <CancelIcon />
            </button>
            {/* <Quotation
              closeModal={closeModal}
              data={allData}
              rows={selectedRows}
              // id={Compid}
            /> */}
          </>
        )}

      {showPDFPreview && pdfUrl && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <CancelIcon />
            </button>
            <h2 className="text-lg font-semibold mb-4">PDF Preview</h2>
            <iframe
              src={pdfUrl}
              className="w-full h-[500px]"
              title="PDF Preview"
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
