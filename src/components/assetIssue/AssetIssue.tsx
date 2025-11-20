import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import baseUrl from "@/config/baseurl";

// Define the Asset interface
interface Asset {
  assetId: string;
  identifier: string;
  userId: string;
  aadharNumber: string;
  returnable: string;
  issueDate: string;
  returnDueDate: string | null;
  returnDate: string;
}

const AssetManagement = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newAsset, setNewAsset] = useState<Asset>({
    assetId: "",
    identifier: "",
    userId: "",
    aadharNumber: "",
    returnable: "",
    issueDate: "",
    returnDueDate: "",
    returnDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentAssetId, setCurrentAssetId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch assets from the backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Retrieve the access token from storage
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error("Access token not found. Please log in again.");
        }
        console.log("token", token);
  
        // Make the API request
        const response = await axios.get(`${baseUrl}/asset-issue/get`, {
          headers: {
            authorization: `Bearer ${token}`, // Corrected the template string
          },
          withCredentials: true,
        });
  
        // Set the assets state with the response data
        setAssets(response.data.data);
        // console.log("Fetched assets:", response.data);
        
      } catch (error: any) {
        // Handle errors gracefully
        console.error("Error fetching assets:", error.response?.data?.msg || error.message);
      }
    };
  
    fetchAssets();
  }, []); // Added `baseUrl` as a dependency
  

  // Handle input change for the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAsset({
      ...newAsset,
      [name]: value,
    });
  };

  // Handle form submission to add or edit an asset
  const handleAddAsset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = Cookies.get('accessToken');
      const formattedAsset = {
        ...newAsset,
        issueDate: newAsset.issueDate,
        returnDueDate: newAsset.returnDueDate || null,
      };

      if (isEditing && currentAssetId) {
        // Update existing asset
        await axios.put(`${baseUrl}/asset-issue/update/${currentAssetId}`, formattedAsset, {
          headers: {
            authorization: `Bearer ${token}`, // Corrected the template string
          },
          withCredentials: true,
        });
        setAssets((prev) =>
          prev.map((asset) =>
            asset.assetId === currentAssetId ? { ...asset, ...formattedAsset } : asset
          )
        );
        console.log("Updated asset:", formattedAsset);
      } else {
        // Add new asset
        const response = await axios.post(`${baseUrl}/asset-issue/create`, formattedAsset, {
          headers: {
            authorization: `Bearer ${token}`, // Corrected the template string
          },
          withCredentials: true,
        });
        setAssets((prev) => [...prev, response.data.response]);
        // console.log("Added asset:", response.data.response);
      }

      handleDialogClose();
    } catch (error: any) {
      console.error("Error adding/editing asset:", error.response?.data?.msg || error.message);
    }
  };

  // Handle edit asset
  const handleEditAsset = (assetId: string) => {
    const assetToEdit = assets.find((asset) => asset.assetId === assetId);
    if (assetToEdit) {
      setNewAsset(assetToEdit);
      setIsEditing(true);
      setCurrentAssetId(assetId);
      setIsDialogOpen(true);
    }
  };

  // Handle dialog open and close
  const handleDialogOpen = () => {
    setNewAsset({
      assetId: "",
      identifier: "",
      userId: "",
      aadharNumber: "",
      returnable: "",
      issueDate: "",
      returnDueDate: "",
      returnDate: "",
    });
    setIsEditing(false);
    setCurrentAssetId(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="h-screen items-center w-full overflow-scroll">
      <h1 className="text-3xl font-semibold mb-5 text-center font-serif">Asset Issued List</h1>

      <div className="bg-white p-5 rounded-lg shadow-lg mb-10 w-auto">
        <h2 className="text-xl font-semibold mb-4">Assets to Employee</h2>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Add New Asset
        </Button>
        <table className="table-auto w-full text-left mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Asset ID</th>
              <th className="px-4 py-2">Identifier</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Aadhar Number</th>
              <th className="px-4 py-2">Returnable</th>
              <th className="px-4 py-2">Issue Date</th>
              <th className="px-4 py-2">Return Due Date</th>
              <th className="px-4 py-2">Return Date</th>
            </tr>
          </thead>
          <tbody>
            {assets?.map((asset) => (
              <tr key={asset.assetId} className="border-t">
                <td className="px-4 py-2">{asset.assetId}</td>
                <td className="px-4 py-2">{asset.identifier}</td>
                <td className="px-4 py-2">{asset.userId}</td>
                <td className="px-4 py-2">{asset.aadharNumber}</td>
                <td className="px-4 py-2">{asset.returnable}</td>
                <td className="px-4 py-2">{asset.issueDate}</td>
                <td className="px-4 py-2">{asset.returnDueDate}</td>
                <td className="px-4 py-2">{asset.returnDate}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditAsset(asset.assetId)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isEditing ? "Edit Asset" : "Add New Asset"}</DialogTitle>
        <form onSubmit={handleAddAsset}>
          <DialogContent>
            <TextField
              label="Asset ID"
              name="assetId"
              value={newAsset.assetId}
              onChange={handleInputChange}
              fullWidth
              required
              margin="dense"
            />
            <TextField
              label="Identifier"
              name="identifier"
              value={newAsset.identifier}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="User ID"
              name="userId"
              value={newAsset.userId}
              onChange={handleInputChange}
              fullWidth
              required
              margin="dense"
            />
            <TextField
              label="Aadhar Number"
              name="aadharNumber"
              value={newAsset.aadharNumber}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Returnable"
              name="returnable"
              value={newAsset.returnable}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Issue Date"
              name="issueDate"
              type="date"
              value={newAsset.issueDate}
              onChange={handleInputChange}
              fullWidth
              required
              margin="dense"
            />
            <TextField
              label="Return Due Date"
              name="returnDueDate"
              type="date"
              value={newAsset.returnDueDate}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Return Date"
              name="returnDate"
              type="date"
              value={newAsset.returnDate}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {isEditing ? "Update Asset" : "Add Asset"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AssetManagement;












// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   TextField,
// } from "@mui/material";
// import axios from "axios";
// import baseUrl from "@/config/baseurl";

// interface Asset {
//   id: number;
//   asset_id: string;
//   employee_name: string;
//   asset_name: string;
//   category: string;
//   brand: string;
//   specification: string;
//   model: string;
//   mac_address: string;
//   price: string;
//   owner: string;
//   purchase_date: string;
//   delivery_date: string;
// }

// const AssetManagement = () => {
//   const [assets, setAssets] = useState<Asset[]>([]);
//   const [newAsset, setNewAsset] = useState<Asset>({
//     id: 0,
//     asset_id: "",
//     employee_name: "",
//     asset_name: "",
//     category: "",
//     brand: "",
//     specification: "",
//     model: "",
//     mac_address: "",
//     price: "",
//     owner: "",
//     purchase_date: "",
//     delivery_date: "",
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [currentAssetId, setCurrentAssetId] = useState<number | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   // Fetch assets from the backend
//   useEffect(() => {
//     const fetchAssets = async () => {
//       try {
//         const response = await axios.get(`${baseUrl}/tbassettype/get`);
//         setAssets(response.data);
//       } catch (error) {
//         console.error("Error fetching assets:", error);
//       }
//     };
//     fetchAssets();
//   }, [newAsset]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewAsset({
//       ...newAsset,
//       [name]: value,
//     });
//   };

//   const handleAddAsset = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       if (isEditing && currentAssetId !== null) {
//         await axios.put(`${baseUrl}/tbassettype/update/${currentAssetId}`, newAsset);
//         setAssets(
//           assets.map((asset) =>
//             asset.id === currentAssetId ? { ...asset, ...newAsset } : asset
//           )
//         );
//       } else {
//         const response = await axios.post(`${baseUrl}/tbassettype/create`, newAsset);
//         setAssets([...assets, response.data]);
//       }

//       setNewAsset({
//         id: 0,
//         asset_id: "",
//         employee_name: "",
//         asset_name: "",
//         category: "",
//         brand: "",
//         specification: "",
//         model: "",
//         mac_address: "",
//         price: "",
//         owner: "",
//         purchase_date: "",
//         delivery_date: "",
//       });
//       setIsEditing(false);
//       setCurrentAssetId(null);
//       setIsDialogOpen(false);
//     } catch (error) {
//       console.error("Error adding/editing asset:", error);
//     }
//   };

//   const handleDeleteAsset = async (id: number) => {
//     try {
//       await axios.delete(`${baseUrl}/tbassettype/delete/${id}`);
//       setAssets(assets.filter((asset) => asset.id !== id));
//     } catch (error) {
//       console.error("Error deleting asset:", error);
//     }
//   };

//   const handleEditAsset = (id: number) => {
//     const assetToEdit = assets.find((asset) => asset.id === id);
//     if (assetToEdit) {
//       setNewAsset({
//         ...assetToEdit,
//         purchase_date: assetToEdit.purchase_date.slice(0, 10),
//         delivery_date: assetToEdit.delivery_date.slice(0, 10),
//       });
//       setIsEditing(true);
//       setCurrentAssetId(id);
//       setIsDialogOpen(true);
//     }
//   };

//   const handleDialogOpen = () => {
//     setIsEditing(false);
//     setCurrentAssetId(null);
//     setIsDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center">
//       <div className="max-w-screen-lg w-full p-5">
//         <h1 className="text-3xl font-semibold mb-5 text-center font-serif">
//           Asset Issued List
//         </h1>

//         {/* Asset List */}
//         <div className="bg-white p-5 rounded-lg shadow-lg">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Assets to Employee</h2>
//             <Button variant="contained" color="primary" onClick={handleDialogOpen}>
//               Add New Asset
//             </Button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="table-auto w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="px-4 py-2">ID</th>
//                   <th className="px-4 py-2">AssetID</th>
//                   <th className="px-4 py-2">Employees</th>
//                   <th className="px-4 py-2">AssetName</th>
//                   <th className="px-4 py-2">Category</th>
//                   <th className="px-4 py-2">Brand</th>
//                   <th className="px-4 py-2">Specification</th>
//                   <th className="px-4 py-2">Model</th>
//                   <th className="px-4 py-2">Macaddress</th>
//                   <th className="px-4 py-2">Price (₹)</th>
//                   <th className="px-4 py-2">Owner</th>
//                   <th className="px-4 py-2">Purchase Date</th>
//                   <th className="px-4 py-2">Delivery Date</th>
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {assets.map((asset) => (
//                   <tr key={asset.id} className="border-t">
//                     <td className="px-4 py-2">{asset.id}</td>
//                     <td className="px-4 py-2">{asset.asset_id}</td>
//                     <td className="px-4 py-2">{asset.employee_name}</td>
//                     <td className="px-4 py-2">{asset.asset_name}</td>
//                     <td className="px-4 py-2">{asset.category}</td>
//                     <td className="px-4 py-2">{asset.brand}</td>
//                     <td className="px-4 py-2">{asset.specification}</td>
//                     <td className="px-4 py-2">{asset.model}</td>
//                     <td className="px-4 py-2">{asset.mac_address}</td>
//                     <td className="px-4 py-2">₹ {asset.price}</td>
//                     <td className="px-4 py-2">{asset.owner}</td>
//                     <td className="px-4 py-2">{asset.purchase_date}</td>
//                     <td className="px-4 py-2">{asset.delivery_date}</td>
//                     <td className="px-4 py-2">
//                       <div className="flex flex-col space-y-2">
//                         <Button
//                           variant="outlined"
//                           color="primary"
//                           onClick={() => handleEditAsset(asset.id)}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="outlined"
//                           color="secondary"
//                           onClick={() => handleDeleteAsset(asset.id)}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Add or Edit Asset Dialog */}
//       <Dialog open={isDialogOpen} onClose={handleDialogClose}>
//         <DialogTitle>{isEditing ? "Edit Asset" : "Add New Asset"}</DialogTitle>
//         <form onSubmit={handleAddAsset}>
//           <DialogContent>
//             {/* Form fields */}
//             <TextField
//               label="Asset ID"
//               name="asset_id"
//               value={newAsset.asset_id}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               margin="dense"
//             />
//             {/* Other fields */}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDialogClose} color="secondary">
//               Cancel
//             </Button>
//             <Button type="submit" color="primary">
//               {isEditing ? "Update Asset" : "Add Asset"}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </div>
//   );
// };

// export default AssetManagement;


