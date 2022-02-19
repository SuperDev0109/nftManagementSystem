const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');
const TreeView = require('./models/TreeView');

const bodyParser = require('body-parser');

const app = express();
app.use(fileUpload());

const corsOption = {
    origin: '*', 
    optionsSuccessStatus: 200
}

//Connect Database
connectDB();

app.use(cors(corsOption));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Init Middleware
app.use(express.json());

app.post('/upload', async (req, res) => {
    var parentID = req.body.parentNodeID;
    if(req.files === null) {
      return res.status(400).json({msg: 'No file was uploaded'});
    }
    var uploadedFileNames = [];
    
    var files = [].concat(req.files['files[]']);
  
    for(var i = 0; i < files.length; i++){
      var file = files[i];
      //Treeview file add
      try {
        const root = await TreeView.findById(parentID);
  
        root.children.unshift(
          {
            text: file.name,
            selected: false,
            icon: 'jstree-file',
            url: `${__dirname}/client/public/upload/${file.name}`,
            img_url: `${file.name}`
          },
        );
      await root.save();
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
      //Treeview file add end
      file.mv(`${__dirname}/client/public/upload/${file.name}`, err => {
        if(err) {
          console.error(err);
          return res.status(500).send(err);
        }
      });
      uploadedFileNames.push(file.name);
    }
    // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    res.json({ fileNames: uploadedFileNames });
  });
//Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/treeview', require('./routes/api/treeview'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));