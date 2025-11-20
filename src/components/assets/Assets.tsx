

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '@/config/baseurl';
import Cookies from 'js-cookie';

type Asset = {
  assetId: string;
  assetName: string;
  assetType: string;
  assetCatagory: string;
  assetBrand: string;
  identifier: string;
  model: string;
  specification: string;
  warrantyPeriod: string;
  warrantyExpirydate: string;
  purchaseDate: string;
  deliveryDate: string;
  assetValue: string;
};

const AssetForm = () => {
  const [formData, setFormData] = useState<Asset>({
    assetId: '',
    assetName: '',
    assetType: '',
    assetCatagory: '',
    assetBrand: '',
    identifier: '',
    model: '',
    specification: '',
    warrantyPeriod:'',
    warrantyExpirydate: '',
    purchaseDate: '',
    deliveryDate: '',
    assetValue: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const addAsset = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setFormData({
      assetId: '',
      assetName: '',
      assetType: '',
      assetCatagory: '',
      assetBrand: '',
      identifier: '',
      model: '',
      specification: '',
      warrantyPeriod:'',
      warrantyExpirydate: '',
      purchaseDate: '',
      deliveryDate: '',
      assetValue: '',
    });
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get(`${baseUrl}/asset/get`, {
          headers: {
            authorization: `Bearer ${token}`, // Corrected the template string
          },
          withCredentials: true,
        });
        setAssetList(response.data.data); 
        // console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, [addAsset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let tempErrors: { [key: string]: string } = {};
    if (!formData.assetId) tempErrors.assetId = 'Asset ID is required';
    if (!formData.assetName) tempErrors.assetName = 'Asset name is required';
    if (!formData.assetType) tempErrors.assetType = 'Asset type is required';
    if (!formData.assetCatagory) tempErrors.assetCatagory = 'Asset catagory is required';
    if (!formData.assetBrand) tempErrors.assetBrand = 'Asset brand is required';
    if (!formData.identifier) tempErrors.identifier = 'Identifier is required';
    if (!formData.model) tempErrors.model = 'Model is required';
    if (!formData.specification) tempErrors.specification = 'Specification is required';
    if (!formData.warrantyPeriod || isNaN(parseFloat(formData.warrantyPeriod))) {
      tempErrors.warrantyPeriod = 'Warranty period must be a valid number';
    }
    if (!formData.warrantyExpirydate) tempErrors.warrantyExpirydate = 'Warranty expiry date is required';
    if (!formData.purchaseDate) tempErrors.purchaseDate = 'Purchase date is required';
    if (!formData.deliveryDate) tempErrors.deliveryDate = 'Delivery date is required';
    if (!formData.assetValue || isNaN(parseFloat(formData.assetValue))) {
      tempErrors.assetValue = 'Asset value must be a valid number';
    }
    return tempErrors;
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    console.log('Form Data (Create):', formData);  // Log form data before validation
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        const token = Cookies.get('accessToken');
        console.log('Token (Create):', token); // Log the token
  
        const response = await axios.post(`${baseUrl}/asset/create`, formData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
  
        const newAsset = { ...formData, assetId: response.data.assetId };
        console.log('New asset created:', newAsset);  // Log newly created asset
  
        setAssetList([...assetList, newAsset]);
  
        // Reset form
        setFormData({
          assetId: '',
          assetName: '',
          assetType: '',
          assetCatagory: '',
          assetBrand: '',
          identifier: '',
          model: '',
          specification: '',
          warrantyPeriod: '',
          warrantyExpirydate: '',
          purchaseDate: '',
          deliveryDate: '',
          assetValue: '',
        });
        setErrors({});
        setIsModalOpen(false);
  
      } catch (error) {
        console.error('Error creating asset:', error);
      }
    } else {
      console.log('Validation errors (Create):', validationErrors);  // Log validation errors
      setErrors(validationErrors);
    }
  };
  
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    console.log('Form Data (Update):', formData);  // Log form data before validation
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        const token = Cookies.get('accessToken');
        console.log('Token (Update):', token);  // Log the token
  
        await axios.put(`${baseUrl}/asset/update/${editId}`, formData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
  
        const updatedAssets = assetList.map((asset) =>
          asset.assetId === editId ? { ...formData, assetId: editId } : asset
        );
  
        console.log('Updated asset list:', updatedAssets);  // Log updated asset list
        setAssetList(updatedAssets);
  
        // Reset form
        setIsEditing(false);
        setEditId(null);
        setFormData({
          assetId: '',
          assetName: '',
          assetType: '',
          assetCatagory: '',
          assetBrand: '',
          identifier: '',
          model: '',
          specification: '',
          warrantyPeriod: '',
          warrantyExpirydate: '',
          purchaseDate: '',
          deliveryDate: '',
          assetValue: '',
        });
        setErrors({});
        setIsModalOpen(false);
  
      } catch (error) {
        console.error('Error updating asset:', error);
      }
    } else {
      console.log('Validation errors (Update):', validationErrors);  // Log validation errors
      setErrors(validationErrors);
    }
  };
  

  const handleDelete = async (assetId: string) => {
    try {
      await axios.delete(`${baseUrl}/asset/delete/${assetId}`);
      const updatedAssets = assetList.filter((asset) => asset.assetId !== assetId);
      setAssetList(updatedAssets);
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleEdit = (assetId: string) => {
    const assetToEdit = assetList.find((asset) => asset.assetId === assetId);
    if (assetToEdit) {
      setFormData(assetToEdit);
      setIsEditing(true);
      setEditId(assetId);
      setIsModalOpen(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAssets = assetList?.filter((asset) =>
    asset?.assetId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`w-full mx-auto p-5 bg-gray-300`} >
      <h1 className="text-4xl font-serif font-semibold py-4">Asset Management</h1>
      
      <button
        onClick={addAsset}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg mb-5"
      >
        Add Asset
      </button>

      <div className="mb-5">
        <h2 className="text-2xl font-semibold py-2">Search Assets</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by asset ID"
          className="w-full p-2 rounded-lg border border-gray-300"
        />
      </div>

      <h2 className="text-2xl font-semibold py-2">Asset Purchase List</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Asset ID</th>
            <th className="border p-2">Asset Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Catagory</th>
            <th className="border p-2">Brand</th>
            <th className="border p-2">Identifier</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Specification</th>
            <th className="border p-2">Warranty Period</th>
            <th className="border p-2">Expiry Date</th>
            <th className="border p-2">Purchase Date</th>
            <th className="border p-2">Delivery Date</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <tr key={asset.assetId}>
                <td className="border p-2">{asset.assetId}</td>
                <td className="border p-2">{asset.assetName}</td>
                <td className="border p-2">{asset.assetType}</td>
                <td className="border p-2">{asset.assetCatagory}</td>
                <td className="border p-2">{asset.assetBrand}</td>
                <td className="border p-2">{asset.identifier}</td>
                <td className="border p-2">{asset.model}</td>
                <td className="border p-2">{asset.specification}</td>
                <td className="border p-2">{asset.warrantyPeriod}</td>
                <td className="border p-2">{asset.warrantyExpirydate}</td>
                <td className="border p-2">{asset.purchaseDate}</td>
                <td className="border p-2">{asset.deliveryDate}</td>
                <td className="border p-2">₹{asset.assetValue}</td>
                <td className="border p-2">
                  {/* <button onClick={() => handleEdit(asset.assetId)} className="text-blue-500 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(asset.assetId)} className="text-red-500">
                    Assign
                  </button> */}
                  <button
  onClick={() => handleEdit(asset.assetId)}
  className="px-1  py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-1"
>
  Edit
</button>
<button
  onClick={() => handleDelete(asset.assetId)}
  className="px-1 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
>
  Assign
</button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-2 text-gray-500">No assets found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  <div className="bg-white p-5 rounded-lg w-1/3 h-4/5 overflow-y-auto">
            <h2 className="text-2xl mb-4">{isEditing ? 'Edit Asset' : 'Add Asset'}</h2>
            <form onSubmit={ isEditing? handleUpdateSubmit : handleCreateSubmit}>
              <div className="mb-4">
                <label className="block">Asset ID:</label>
                <input
                  type="text"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  // readOnly={isEditing} 
                />
                {errors.assetId && <span className="text-red-500">{errors.assetId}</span>}
              </div>

              <div className="mb-4">
                <label className="block">Asset Name:</label>
                <input
                  type="text"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.assetName && <span className="text-red-500">{errors.assetName}</span>}
              </div>

              <div className="mb-4">
                <label className="block">Asset Type:</label>
                <select
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Type</option>
                  <option value="tangible">Tangible</option>
                  <option value="intangible">Intangible</option>
                  <option value="financial">Financial</option>
                  <option value="other">Other</option>
                </select>
                {errors.assetType && <span className="text-red-500">{errors.assetType}</span>}
              </div>

              <div className="mb-4">
                <label className="block">Asset Catagory:</label>
                <select
                  name="assetCatagory"
                  value={formData.assetCatagory}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Catagory</option>
                  <option value="electronics">Electronics</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="furniture">Furniture</option>
                  <option value="stationary">Stationary</option>
                  <option value="uniform">Uniform</option>
                  <option value="other">Other</option>
                </select>
                {errors.assetType && <span className="text-red-500">{errors.assetCatagory}</span>}
              </div>
              
              {/* <div className="mb-4">
                <label className="block">Asset Catagory:</label>
                <input
                  type="text"
                  name="assetCatagory"
                  value={formData.assetCatagory}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.assetCatagory && <span className="text-red-500">{errors.assetCatagory}</span>}

              </div> */}
               
              <div className="mb-4">
                <label className="block">Asset Brand:</label>
                <input
                  type="text"
                  name="assetBrand"
                  value={formData.assetBrand}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.assetBrand && <span className="text-red-500">{errors.assetBrand}</span>}

              </div>

              <div className="mb-4">
                <label className="block">Identifier:</label>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.identifier && <span className="text-red-500">{errors.identifier}</span>}

              </div>

              <div className="mb-4">
                <label className="block">Model:</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.model && <span className="text-red-500">{errors.model}</span>}

              </div>
                
              <div className="mb-4">
                <label className="block">Specification:</label>
                <input
                  type="text"
                  name="specification"
                  value={formData.specification}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.specification && <span className="text-red-500">{errors.specification}</span>}

              </div>

              <div className="mb-4">
                <label className="block">Warranty Period:</label>
                <input
                  type="text"
                  name="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.warrantyPeriod && <span className="text-red-500">{errors.warrantyPeriod}</span>}
              </div>

              <div className="mb-4">
                <label className="block">Warranty Expiry Date:</label>
                <input
                  type="date"
                  name="warrantyExpirydate"
                  value={formData.warrantyExpirydate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.warrantyExpirydate && <span className="text-red-500">{errors.warrantyExpirydate}</span>}

              </div>

              <div className="mb-4">
                <label className="block">Purchase Date:</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.purchaseDate && <span className="text-red-500">{errors.purchaseDate}</span>}
              </div>

              <div className="mb-4">
                <label className="block">Delivery Date:</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.deliveryDate && <span className="text-red-500">{errors.deliveryDate}</span>}

              </div>

              <div className="mb-4">
                <label className="block">Asset Value (₹):</label>
                <input
                  type="text"
                  name="assetValue"
                  value={formData.assetValue}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {errors.assetValue && <span className="text-red-500">{errors.assetValue}</span>}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  {isEditing ? 'Update Asset' : 'Add Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetForm;
