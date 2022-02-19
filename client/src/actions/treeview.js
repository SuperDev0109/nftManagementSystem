import api from '../utils/api';

// Load User
export const createTreeView = () => async dispatch => {
  try {
    const res = await api.post('/treeview');

    dispatch({
      type: 'get_treeview',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'ERROR'
    });
  }
};

export const updateTreeView = (data) => async dispatch => {
    try {
      const res = await api.post('/treeview/update', data);
  
      dispatch({
        type: 'get_treeview',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'ERROR'
      });
    }
  };

  export const deleteTreeView = (data) => async dispatch => {
    try {
      const res = await api.post('/treeview/delete', data);
  
      dispatch({
        type: 'get_treeview',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'ERROR'
      });
    }
  };

export const getTreeViewData = () => async dispatch => {
    try {
        const res = await api.get('/treeview');
        dispatch({
          type: 'get_treeview',
          payload: res.data
        });
        // console.log(res.data);
        var treeViewData = res.data;
        let data = [];
        for (var i = 0; i < treeViewData.length; i++) {
            var rowData = treeViewData[i];
            var tempJson = {id: '', text: '', state: '', children: [], childrenHas: '', parentID: ''};
            tempJson.id = rowData._id;
            tempJson.text = rowData.text;
            console.log(rowData.opened);
            tempJson.state = { "opened": rowData.opened };
            tempJson.childrenHas = true;
            tempJson.parentID = '#';
            for (var j = 0; j < rowData.children.length; j++) {
                tempJson.children.push({
                    "id": rowData.children[j]._id,
                    "parentID": rowData._id,
                    "text": rowData.children[j].text,
                    "state": { "selected": rowData.children[j].selected },
                    "icon": rowData.children[j].icon,
                    "img_url": rowData.children[j].img_url,
                    "childrenHas": false
                });
            }
            data.push(tempJson);
        }
        return data;
      } catch (err) {
            console.log(err);
            dispatch({
                type: 'ERROR'
            });
      }    
};

export const setParentNodeID = (ID) => async dispatch => {
    try {
        dispatch({
          type: 'setParentNodeID',
          payload: ID
        });
      } catch (err) {
            console.log(err);
            dispatch({
                type: 'ERROR'
            });
      }    
};
  