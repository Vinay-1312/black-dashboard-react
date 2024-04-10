import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { backendURL } from 'utils/constant';

const JobTable = () => {
    const info = useSelector((store)=>store?.info);
    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState('');
    function ImageModal({ imageURL, onClose }) {
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="bg-white p-4 max-w-3xl">
            <img src={imageURL} alt="Image" className="mx-auto" />
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      );
    }
    const closeImageModal = () => {
      setShowImage(false);
    };
      
    const toggleImage = () => {
      setShowImage(!showImage);
      fetch(backendURL + 'getImage')
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error('Failed to fetch image');
          }
        })
        .then((blob) => {
          const imageUrl = URL.createObjectURL(blob);
          setImageURL(imageUrl);
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
    
    };  
  return (
    <div className="relative">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Serial Number
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Job Link
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Similarity Score
          </th>
          <th>
            <div>
          <button onClick={toggleImage} className="bg-gray-400 p-2 rounded-lg">Show Skills</button>
         
          </div>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {info?.Links[0]?.map((link, index) => (
            
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">
              {index + 1}
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap">
            {info?.position}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
            <a href={link} target="_blank" className="text-blue-500 hover:text-red-500">Job Link</a>

            </td>
            
            
            <td className="px-6 py-4 whitespace-nowrap">
              
            {info && info.Scores && info.Scores[0] && info.Scores[0][index] !== undefined ? (
  (info.Scores[0][index] * 100).toFixed(2) + "%"
) : (
  "N/A"
)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {showImage && (<ImageModal imageURL={imageURL} onClose={closeImageModal} /> 
      )}
    </div>
  );
};

export default JobTable;
