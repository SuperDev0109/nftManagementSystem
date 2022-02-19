const initialState = {
    treeview: [],
    parentNodeID: ''
};
  
  function treeviewReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
        case 'get_treeview':
            return {
            ...state,
            treeview: payload
            }
        case 'setParentNodeID':
            return {
                ...state,
                parentNodeID: payload
            }
      default:
        return state;
    }
  }
  
  export default treeviewReducer;
  