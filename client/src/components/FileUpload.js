import React, {Fragment, useState} from 'react';
import Progress from './Progress';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import '../assets/scss/Fileupload.scss';
// import { useNavigate, Navigate } from 'react-router-dom';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import {getTreeViewData} from '../actions/treeview';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//modal
import {
  Card,
  Row,
  Col,
  Button
} from "reactstrap";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText, TextField } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
//modal

const FileUpload = () => {
  const dispatch = useDispatch();

  const {parentNodeID} = useSelector(state => state.treeview);
  const [files, setFiles] = useState();
  const [filenames, setFilenames] = useState('Choose File');
  const [selectedFiles, setSelectedFiles] = useState('Choose File');
  const [uploadedFile,
    setUploadedFile] = useState();
  const [uploadPercentage, setUploadPercentage] = useState(0);

  //modal
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    sampleMetadata: `{
      "name": "Buffalo",
      "description": "It's actually a bison?",
      "attributes": [
        {
          "trait_type": "BackgroundColor",
          "value": "green"
        }
      ]
    }`,
    myMetadata: `{
      "name": "",
      "description": "",
      "attributes": [
        {
          "trait_type": "",
          "value": ""
        }
      ]
    }`
  })

  const { sampleMetadata, myMetadata } = formData;

  const handleClickOpen = () => {
      if (!files) {
        toast.warning(`Please choose file`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        return;
      } else {
        for (var i = 0; i < files.length; i++) {
          let tempFileExt = files[i].name.substring(files[i].name.lastIndexOf('.')+1, files[i].name.length) || files[i].name;
          if (tempFileExt != 'png' && tempFileExt != 'jpg' && tempFileExt != 'gif' && tempFileExt != 'jfif' && tempFileExt != 'jpeg') {
            toast.warning(`Please Choose Correct File 
            Allowed file types 
            (.png, .jpg, .jpeg, .gif, .jfif)`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            return;
          }
        }
      }

      if (parentNodeID == '') {
        toast.warning(`Please Select the Collection`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        return;
      }
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };
  //modal end

  const onChange = e => {
    setFiles(e.target.files);
    let tempFileNames = [];
    for (var i = 0; i < e.target.files.length; i++) {
      tempFileNames.push(e.target.files[i].name + ' ');
    }
    setFilenames(tempFileNames);
    setSelectedFiles(tempFileNames.length+' files Selected')
  };

  const onChangeMetadata = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  //   if(!isAuthenticated){       return <Navigate to="/login" />   }

  const onSubmit = async e => {
    // e.preventDefault();
    try {
      var tempJson = JSON.parse(myMetadata);
      tempJson = myMetadata;
      if (!files) {
        toast.warning(`Please Choose File`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        return;
      } else {
        for (var i = 0; i < files.length; i++) {
          let tempFileExt = files[i].name.substring(files[i].name.lastIndexOf('.')+1, files[i].name.length) || files[i].name;
          if (tempFileExt != 'png' && tempFileExt != 'jpg' && tempFileExt != 'gif' && tempFileExt != 'jfif' && tempFileExt != 'jpeg') {
            toast.warning(`Please Choose Correct File 
            Allowed file types 
            (.png, .jpg, .jpeg, .gif, .jfif)`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            return;
          }
        }
      }
  
      if (parentNodeID == '') {
        toast.warning(`Please Select the Collection`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        return;
      }
  
      const formData = new FormData();
      formData.append('parentNodeID', parentNodeID);
      formData.append('tempJson', tempJson);
      for (var i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
      }
  
      try {
        const res = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': localStorage.getItem('token')
          },
          onUploadProgress: progressEvent => {
            setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
            setTimeout(() => setUploadPercentage(0), 100000);
          }
        });
  
        const {fileNames} = res.data;
        setUploadedFile(fileNames);
        toast.success(`File uploaded`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

        setFiles();
        setSelectedFiles('Choose File');
        
        setFormData({ ...formData, [myMetadata]: '' });;
  
        const data = await dispatch(getTreeViewData());
        $('#jstree_demo').jstree(true).settings.core.data = data;
        $('#jstree_demo').jstree(true).refresh();
      } catch (err) {
        if (err.response.status === 500) {
          toast.error(`There was a problem witht he server`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        } else {
          toast.success(err.response.data.msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      }
      handleClose();
    } catch {
      toast.warning(`JSON format invaild`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  return (
    <Fragment>
      <ToastContainer  />
      <div
        className='container'
        style={{
        paddingTop: '20px',
      }}>
        {/* <form> */}
          <div className="custom-file mb-4">
            <input
              type="file"
              multiple={true}
              className="custom-file-input"
              id="customFile"
              onChange={onChange}/>
            <label className='custom-file-label' htmlFor='customFile'>
              {selectedFiles}
            </label>
          </div>

          <Progress percentage={uploadPercentage}/>
          <div
            style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            {/* <Link to="/"><button className="btn btn-primary mt-4">Back to Home</button></Link> */}
            {/* <input type="submit" defaultValue="Upload" className="btn btn-primary mt-4"/> */}
            <button className="btn btn-primary mt-4" onClick={handleClickOpen}>Upload</button>
          </div>
        {/* </form> */}
        {/* {uploadedFile
          ? <div className="row mt-5">
              <div className="col-md-6 m-auto"></div>
              {uploadedFile.map((item, i) => {
                return <h5 key={i} className="text-center">{item}</h5>;
              })} */}
              {/* <img style={{ width: '100%' }} src={uploadedFile.filePath} alt="" /> */}
            {/* </div>
          : null} */}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
      >
          <DialogTitle style={{color: 'black'}}>
              {"Add a Metadata"}
          </DialogTitle>
          <DialogContent style={{display: 'flex', flexDirection: 'column'}}>
            <TextField
                  name="sampleMetadata"
                  label="Sample Metadata"
                  multiline
                  rows={10}
                  value={sampleMetadata}
                  onChange={onChangeMetadata}
                  variant="standard"
                  style={{marginBottom: '20px'}} 
                  
              />
              <TextField
                  name="myMetadata"
                  label="My Metadata"
                  multiline
                  rows={10}
                  value={myMetadata}
                  onChange={onChangeMetadata}
                  variant="standard"
                  style={{}}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={onSubmit} autoFocus>
                  Upload
              </Button>
          </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default FileUpload;
