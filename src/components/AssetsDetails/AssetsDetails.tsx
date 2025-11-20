
import React, { useState } from 'react';
import { assetwallpaper1 } from '@/src/assets';


const AssetRequestList = () => {
  // State for managing the asset list
  const [assets, setAssets] = useState([
    {
      id: 1,
      asset: 'DELL INSPIRON 14',
      requestedEmployee: 'Rahul Gandhi',
      approvedBy: 'Narendra Modi',
      status: 'Available',
      requestDate: '2023-06-10',
      receiveDate: '2023-06-12',
    },
  ]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Initial form state
  const initialFormState = {
    asset: '',
    requestedEmployee: '',
    approvedBy: '',
    status: '',
    requestDate: '',
    receiveDate: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  // Handle adding a new asset
  const handleAddAsset = () => {
    setIsEditMode(false);
    setCurrentAsset(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  // Handle editing an asset
  const handleEditAsset = (asset: typeof assets[number]) => {
    setIsEditMode(true);
    setCurrentAsset(asset.id); // Set the current asset ID to identify which asset to update
    setFormData(asset);
    setShowModal(true);
  };

  // Handle deleting an asset
  const handleDeleteAsset = (id: number) => {
    const filteredAssets = assets.filter((asset) => asset.id !== id);
    setAssets(filteredAssets);
  };

  // Handle form submission for both add and edit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditMode && currentAsset !== null) {
      // Update existing asset
      setAssets(
        assets.map((asset) => (asset.id === currentAsset ? { ...asset, ...formData } : asset))
      );
    } else {
      // Add new asset
      setAssets([...assets, { id: assets.length + 1, ...formData }]);
    }
    setShowModal(false);
  };

  return (
    
    <div className="p-6 w-auto h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${assetwallpaper1.src})`,
  
  }}>
      <div className=" mb-6">
        <h2 className="text-3xl font-bold font-serif flex justify-center items-center text-center text-black">Asset Request List</h2>
        <button
          className="bg-green-500 text-white flex justify-end px-5 py-2 rounded-md hover:bg-green-600 transition"
          onClick={handleAddAsset}
        >
          Add Asset
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4">Id</th>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Requested Employee</th>
              <th className="px-6 py-4">Approved By</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Request Date</th>
              <th className="px-6 py-4">Receive Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{asset.id}</td>
                <td className="px-6 py-4 font-medium text-gray-700">{asset.asset}</td>
                <td className="px-6 py-4 text-gray-600">{asset.requestedEmployee}</td>
                <td className="px-6 py-4 text-gray-600">{asset.approvedBy}</td>
                <td className="px-6 py-4">
                  {/* <span
                    className={`${
                      asset.status === 'Available' ? 'bg-green-500' : 'bg-red-500'
                    } text-white text-sm px-3 py-1 rounded-full`}
                  >
                    {asset.status}
                  </span> */}

                <span
                   className={`${
                   asset.status === 'Available'
                   ? 'bg-green-500'
                    : asset.status === 'Approved'
                     ? 'bg-blue-500'
                      : asset.status === 'Pending'
                      ? 'bg-yellow-500'
                       : 'bg-red-500'
                        } text-white text-sm px-3 py-1 rounded-full`}
                        >
                         {asset.status}
                  </span>


                </td>
                <td className="px-6 py-4 text-gray-600">{asset.requestDate}</td>
                <td className="px-6 py-4 text-gray-600">{asset.receiveDate}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => handleEditAsset(asset)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => handleDeleteAsset(asset.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Asset */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {isEditMode ? 'Edit Asset' : 'Add Asset'}
            </h3>            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Asset Name</label>
                <input
                  type="text"
                  name="asset"
                  value={formData.asset}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Requested Employee</label>
                <input
                  type="text"
                  name="requestedEmployee"
                  value={formData.requestedEmployee}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Approved By</label>
                <input
                  type="text"
                  name="approvedBy"
                  value={formData.approvedBy}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                 value={formData.status}
                 onChange={handleChange}
                 className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                 required
                 >
                <option value="disabled">Select Status</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
                <option value="Available">Available</option>
                </select>
                </div>

               <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Request Date</label>
                <input
                  type="date"
                  name="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Receive Date</label>
                <input
                  type="date"
                  name="receiveDate"
                  value={formData.receiveDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
               </div>
               <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition">
                  {isEditMode ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetRequestList;





























