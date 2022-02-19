const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const TreeView = require('../../models/TreeView');
const fs = require('fs');

router.get("/", async (req, res) => {
  try {
    const data = await TreeView.find();
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res) => {
    try {
        treeview = new TreeView({
            text: 'New Collection',
            opened: false,
            children: [],
        });
          
        treeview.save();
      const data = await TreeView.find();
      res.json(data);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });


  router.post("/update", async (req, res) => {
    var parentID = req.body.parentID;
    if (parentID == '#') {
        try {
            // Using upsert option (creates new doc if no match is found):
            let root = await TreeView.findOneAndUpdate(
                { _id: req.body.id },
                { $set: { text: req.body.text } },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            return res.json(root);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    } else {
        try {
            const root = await TreeView.findById(req.body.parentID);
        
            var updateIndex = '';
            for(var i = 0; i < root.children.length; i++) {
                if(root.children[i]._id == req.body.id) {
                    updateIndex = i;
                    break;
                }
            }
            root.children[updateIndex].text = req.body.text;
            await root.save();
            return res.json(root);

          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
          }
    }
  });

  router.post("/delete", async (req, res) => {
    var parentID = req.body.parentID;
    if (parentID == '#') {
        try {
            const root = await TreeView.findById(req.body.id);
            
            for (var i = 0; i < root.children.length; i++) {
                fs.unlinkSync(root.children[i].url);
            }
            await TreeView.findOneAndRemove({ _id: req.body.id });
            return res.json("success");
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    } else {
        try {
            const root = await TreeView.findById(req.body.parentID);

            var deleteIndex = 0;
            
            for(var i = 0; i < root.children.length; i++) {
                if(root.children[i]._id == req.body.id) {
                    deleteIndex = i;
                    
                    break;
                }
            }
            
            fs.unlinkSync(root.children[deleteIndex].url);

            root.children.splice(deleteIndex, 1);
            // console.log(deleteIndex);
            // console.log(root.children);
            
            // console.log(root.children);

            // root.children = root.children.filter(
            //     (child) => child._id.toString() !== req.body.id
            //   );
          
            root.save();
            return res.json("success");
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
          }
    }
  });

module.exports = router;
