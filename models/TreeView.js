const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreeViewSchema = new Schema({
  owner: {
    type: String,
    required: true
  },
  group: {
    type: String, 
  },
  text: {
    type: String,
    required: true
  },
  opened: {
    type: Boolean
  },
  desc: {
    type: String,
  }, 
  children: [
    {
      text: {
        type: String,
        required: true
      },
      selected: {
        type: Boolean
      },
      icon: {
        type: String
      },
      url: {
        type: String
      },
      img_url: {
        type: String
      }, 
      metadata: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('treeview', TreeViewSchema);
