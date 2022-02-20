const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const TreeView = require('../../models/TreeView');
const fs = require('fs');

const auth = require('../../middleware/auth');

router.get("/", auth, async (req, res) => {
  try {
    const data = await TreeView.find({ owner: req.user.id }).sort({date: 1});
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", auth,async (req, res) => {
    try {
        treeview = new TreeView({
            owner: req.user.id,
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
    var data = req.body.data;

    for(var i = 0; i < data.length; i++) {
      var node = data[i];
      var parentID = node.parentID;
      if (parentID == '#') {
          try {
              var root = await TreeView.findById(node.id);
              if (root.children.length != 0) {
                for (var j = 0; j < root.children.length; j++) {
                  // fs.unlinkSync(root.children[j].url);
                }
              }
              await TreeView.findOneAndRemove({ _id: node.id });
              // return res.json("success");
          } catch (err) {
              console.error(err.message);
              return res.status(500).send('Server Error');
          }
      } else {
          try {
              var root = await TreeView.findById(node.parentID);

              if (root) {
                var deleteIndex = -1;
                for(var j = 0; j < root.children.length; j++) {
                    if(root.children[j]._id == node.id) {
                        deleteIndex = j;
                        break;
                    }
                }
                
                await fs.unlinkSync(root.children[deleteIndex].url);
                root.children.splice(deleteIndex, 1);
                await root.save();
              }

              // return res.json("success");

            } catch (err) {
              console.error(err.message);
              res.status(500).send('Server Error');
            }
      }
    }

    return res.json("success");
  });

module.exports = router;
