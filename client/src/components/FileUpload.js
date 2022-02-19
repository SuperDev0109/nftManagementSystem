import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { getTreeViewData } from '../actions/treeview';

const FileUpload = () => {
  const dispatch = useDispatch();

  const { parentNodeID } = useSelector(state => state.treeview);
  const [files, setFiles] = useState();
  const [filenames, setFilenames] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState();
  const [message, setMessage] = useState();
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    setFiles(e.target.files);
    let tempFileNames = [];
    for(var i = 0; i < e.target.files.length; i++) {
      tempFileNames.push(e.target.files[i].name+' ');
    }
    setFilenames(tempFileNames);
  };
//   if(!isAuthenticated){
//       return <Navigate to="/login" />
//   }

  const onSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('parentNodeID', parentNodeID);
    for(var i = 0; i < files.length; i++){
      formData.append('files[]', files[i]);
    }

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
          setTimeout(() => setUploadPercentage(0), 100000);
        }
      });

      const { fileNames } = res.data;
      setUploadedFile(fileNames);
      setMessage('File uploaded');

      const data = await dispatch(getTreeViewData());
        $('#jstree_demo').jstree(true).settings.core.data = data;
        $('#jstree_demo').jstree(true).refresh();
    } catch(err) {
      if(err.response.status === 500) {
        setMessage('There was a problem witht he server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  }

  return (
    <Fragment>
        <div className='container' style={{ paddingTop: '20px', marginTop: "100px" }}>
        {/* <h4 style={{textAlign: 'center'}}>Upload File</h4> */}
      { message ? <Message msg={ message } /> : null }
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file" 
            multiple={true}
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filenames}
          </label>
        </div>

        <Progress percentage={ uploadPercentage } />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Link to="/"><button className="btn btn-primary mt-4">Back to Home</button></Link> */}
            <input
            type="submit"
            defaultValue="Upload"
            className="btn btn-primary mt-4"
            />
        </div>
      </form>
      { uploadedFile ? <div className="row mt-5">
        <div className="col-md-6 m-auto"></div>
          {uploadedFile.map((item, i) => {
            return <h5 key={i} className="text-center">{ item }</h5>;
          })}
          {/* <img style={{ width: '100%' }} src={uploadedFile.filePath} alt="" /> */}
        </div> : null }
        </div>
    </Fragment>
  );
};

export default FileUpload;
