import React, { useState,useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { backendURL } from 'utils/constant';
import { useDispatch } from "react-redux";
import { addLinks,addScores,addTitle,addSkills } from '../utils/infoSlice';

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    backgroundColor: '#f5f5f5',
    border: '2px solid #ddd',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    width: '300px',
  },
  input: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
}));

const InputPage = () => {
  const classes = useStyles();
  //const [file, setFile] = useState(null);
  const [textValue, setTextValue] = useState('');
  const navigate = useNavigate();
  const file = useRef(null)
  const descriptionsF = []
  const linksF = []
  const title = useRef(null)
  const dispatch = useDispatch()




  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };
  
   
 
    const processData = async(mainResponse) =>
    {
      const parser = new DOMParser();
      const descriptions = [];
      const fullUrLs = []
      const mainHtml = await mainResponse.text();
      const mainDoc = parser.parseFromString(mainHtml, 'text/html');
  
      // Extract links with data-qa="job-card-title"
      const jobLinks = Array.from(mainDoc.querySelectorAll('a[data-qa="job-card-title"]'));
      
      // Create an array of promises for the inner fetch operations
      const jobFetchPromises = jobLinks.map(async (link) => {
        let retries = 3; // Maximum number of retries
        while (retries > 0) {
            try {
                const href = link.getAttribute('href');
                const fullUrl = new URL(href, 'https://www.reed.co.uk/jobs').href;
                //console.log(fullUrl);
                fullUrLs.push(fullUrl);
      
                const jobResponse = await fetch(fullUrl);
                if (!jobResponse.ok) {
                    if (jobResponse.status === 429) {
                        // If rate limited, retry after a delay
                        await new Promise(resolve => setTimeout(resolve, 5000 * (4 - retries))); // Exponential backoff
                        retries--;
                        continue; // Retry the request
                    } else {
                        throw new Error('Network response was not ok');
                    }
                }
      
                const jobPageHtml = await jobResponse.text();
                const jobPage = new DOMParser().parseFromString(jobPageHtml, 'text/html');
                const descriptionElement = jobPage.querySelector('span[itemprop="description"]');
      
                if (descriptionElement) {
                    let description = descriptionElement.textContent;
                    descriptions.push(description);
                }
                break; // Break the loop if successful
            } catch (error) {
                console.error('Error fetching job description:', error);
                retries--;
                if (retries === 0) {
                    console.error('Maximum retries reached. Unable to fetch job description.');
                }
            }
        }
    });
    
    // Wait for all job fetch promises to resolve
    try {
        await Promise.all(jobFetchPromises);
        console.log('All job descriptions fetched successfully:', descriptions);
    } catch (error) {
        console.error('Error fetching job descriptions:', error);
    }
  
      //console.log("here");
      for (const item of descriptions) {
        descriptionsF.push(item); // Add each item from list2 to list1
      }
      
      for (const item of fullUrLs) {
        linksF.push(item); // Add each item from list2 to list1
      }
     
      

    }



    const sendFileRequest = async (e) =>
    {
      const formData = new FormData();
      
      formData.append('pdfFile', file?.current?.childNodes[0]?.childNodes[0]?.files[0]);
      console.log(formData);
      const response = await fetch(backendURL + 'GetFile', {
        method: 'POST',
        
        body: formData,
      });
  
      
      

    }
    
    const handleSubmit = async (e) => {
     
      
      e.preventDefault();
      //console.log(file);
      console.log(title);
      console.log(title?.current?.childNodes[0]?.childNodes[0]?.value);
      const titleUpdated =  title?.current?.childNodes[0]?.childNodes[0]?.value.replace(/ /g, '-');
      dispatch(addTitle(title?.current?.childNodes[0]?.childNodes[0]?.value ))
    
      try {
        // Fetch the main page
        const url1 = "https://www.reed.co.uk/jobs/"+titleUpdated+"-jobs-in-united-kingdom"
        const url2 = "https://www.reed.co.uk/jobs/"+titleUpdated+"-jobs-in-united-kingdom?pageno=2"
        //const url3 = "https://www.reed.co.uk/jobs/"+titleUpdated+"-jobs-in-united-kingdom?pageno=3"
        const response1 = await fetch(url1);
        const response2 = await fetch(url2);
       // const response3 = await fetch(url3);
      
        //const mainResponse = await fetch('https://www.reed.co.uk/jobs/software-developer-jobs-in-united-kingdom');
        if (response1.ok) {
          await processData(response1)
        }
        if (response2.ok) {
          await processData(response2)
        }
        //if (response3.ok) {
         /// await processData(response3)
        //}
   
        const data = { "descriptions": descriptionsF};
      const response = await fetch(backendURL + 'process_descriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const responseData = await response.json();
      //console.log(responseData);
      
      //console.log(responseData?.message);
     
   
      dispatch(addLinks(linksF));
    dispatch(addScores(responseData?.message))
    dispatch(addSkills(responseData?.skills))
    navigate('/admin/dashboard');
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
      

  return (
    <div className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <InputLabel className={classes.label}>Upload File</InputLabel>
        <TextField
          type="file"
          onChange={sendFileRequest}
          className={classes.input}
          ref={file}
          required
        />
        <InputLabel className={classes.label}>Enter Text</InputLabel>
        <TextField
          type="text"
          value={textValue}
          onChange={handleTextChange}
          placeholder="Enter some text"
          ref = {title}
          className={classes.input}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit" // Set type to "submit" to trigger the onSubmit event
        
        >
          Upload
        </Button>
      </form>
    </div>
  );
};

export default InputPage;
