
import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { backendURL } from 'utils/constant';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

function Tables() {
  const info = useSelector((store)=>store?.info);
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState('');
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th> Serial Number</th>
                      <th>Title</th>
                      <th>Job Link</th>
                      <th className="text-center">Similarity Score</th>
                    </tr>
                  </thead>
                  <tbody>
        {info?.Links[0]?.map((link, index) => (
            
          <tr key={index}>
            <td>
              {index + 1}
            </td>
            
            <td>
            {info?.position}
            </td>
            <td>
            <a href={link} target="_blank" className="text-blue-500 hover:text-red-500">Job Link</a>

            </td>
            
            
            <td>
              
            {info && info.Scores && info.Scores[0] && info.Scores[0][index] !== undefined ? (
  (info.Scores[0][index] * 100).toFixed(2) + "%"
) : (
  "N/A"
)}
            </td>
          </tr>
        ))}
      </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
      </div>
    </>
  );
}

export default Tables;
