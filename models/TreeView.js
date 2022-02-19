const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreeViewSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  opened: {
    type: Boolean
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
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('treeview', TreeViewSchema);
