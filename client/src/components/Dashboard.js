import React, { Fragment, useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import '../assets/scss/Dashboard.scss';
import $ from 'jquery';
import '../assets/dist/jstree';
import { useSelector, useDispatch } from 'react-redux';
import { getTreeViewData, createTreeView, updateTreeView, deleteTreeView, setParentNodeID } from '../actions/treeview';
import { Link, Navigate } from 'react-router-dom';
import { logout } from '../actions/auth';

const Dashboard = () => {
    let deletedItems = [];
    let tempSelectedItems = [];
    const dispatch = useDispatch();
    const { treeview } = useSelector(state => state.treeview);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const { name } = useSelector((state) => state.auth.user)

    const [displayContent, setDisplayContent] = useState("Empty NFT");

    useEffect(async () => {
        setTreeviewData( await dispatch(getTreeViewData()));
    }, []);



    const setTreeviewData = async (data) => {
        $('#jstree_demo').jstree({
            "core": {
                "animation": 0,
                "check_callback": true,
                "themes": { "stripes": true },
                'data': data
            },
            "types": {
                "#": {
                    "max_children": 1,
                    "max_depth": 2,
                    "valid_children": ["root"],
                    "icon": "glyphicon glyphicon-file",
                },
                "root": {
                    "icon": "/static/3.3.12/assets/images/tree_icon.png",
                    "valid_children": ["default"]
                },
                "default": {
                    "valid_children": ["default", "file"]
                },
                "file": {
                    "icon": "glyphicon glyphicon-file",
                    "valid_children": []
                }
            },
            "plugins": [
                "contextmenu", "dnd", "search",
                "state", "types", "wholerow","changed"
            ]
        }).on('rename_node.jstree', async function(e, data) {
            onUpdateTreeview({ id: data.node.original.id, text: data.node.text, is_child: data.node.original.childrenHas, parentID:  data.node.original.parentID});
            
        }).on('delete_node.jstree', function(e, data) {
            var len = $('#jstree_demo').jstree('get_selected');
            onDeleteTreeview({ id: data.node.original.id, text: data.node.text, is_child: data.node.original.childrenHas, parentID:  data.node.original.parentID, length: len.length });
        }).on('select_node.jstree', function(e, data) {
            if (data.node.original.parentID == '#') {
                onSetParentNodeID(data.node.original.id);
                displayImg(data.node.original.id);
            } else {
                onSetParentNodeID(data.node.original.parentID);
                displayImg(data.node.original.parentID);
            }
        });
    }

    const onCreateTreeview = async () => {
        await dispatch(createTreeView());
        onRefresh();
    }

    const onUpdateTreeview = async (data) => {
        await dispatch(updateTreeView(data));
        data.is_child ? displayImg(data.id): displayImg(data.parentID);
        // onRefresh();
    }

    const onDeleteTreeview = async (data) => {
        // console.log(data);
        tempSelectedItems.push(data.length);
        deletedItems.push(data);

        if (tempSelectedItems[0]+1 == deletedItems.length) {
            onDeleteTreeviewAction(deletedItems);
            tempSelectedItems = [];
            deletedItems = [];
        }
    }

    const onDeleteTreeviewAction = async (data) => {
        // console.log(data);
        await dispatch(deleteTreeView(data));
        data[0].is_child ? displayImg(data[0].id): displayImg(data[0].parentID);
        if (data.length == 1 && data[0].parentID == '#') {
            await dispatch(setParentNodeID(''));
        } else {
            if (data[0].is_child) {
                await dispatch(setParentNodeID(data[0].id));
            } else {
                await dispatch(setParentNodeID(data[0].parentID));
            }
        }
    }

    const onSetParentNodeID = async (data) => {
        await dispatch(setParentNodeID(data));
    }

    const onRefresh = async () => {
        const data = await dispatch(getTreeViewData());
        $('#jstree_demo').jstree(true).settings.core.data = data;
        $('#jstree_demo').jstree(true).refresh();
    }

    const displayImg = async (parentID) => {
        // console.log(parentID);
        const data = await dispatch(getTreeViewData());
        let selectedIndex = -1, tempData;
        for(var i = 0; i < data.length; i++) {
            if (data[i].id == parentID) {
                selectedIndex = i;
                break;
            }
        }
        if (selectedIndex == -1) {
            tempData = <p>Empty NFT</p>
        } else {
            tempData = data[selectedIndex].children.map((item, index) => (
                <div className='col-md-3' key={item.id} style={{ marginBottom: '10px' }}>
                    <div className='card'>
                        <img src={`upload/${item.img_url}`} width="100%" height="250px" />
                        <p>{ item.text }</p>
                    </div>
                </div>
            ))
        }

        setDisplayContent(tempData);
    }

    const onLogout = () => {
        dispatch(logout());
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <Fragment>
            <div className='dash_section'>
                <div style={{ padding: '0 50px 50px' }}>
                    {/* header logo */}
                    <div className='row header_panel'>
                        <div className='col-md-3 header_left_panel'>
                            <img src='assets/img/photonicNFT.png' width="100%" />
                        </div>
                        <div className='col-md-9 header_right_panel'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <svg className='searchIcon' focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
                                    <input type="text" className='form-control inputCustom' placeholder='Search' width="100%" />
                                </div>
                                <div className='col-md-6'>
                                    <select className="form-select">
                                        <option value="1">Name</option>
                                        <option value="2">Collection</option>
                                        <option value="3">Date (ASC)</option>
                                        <option value="3">Date (DESC)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* header logo end */}

                    {/* login panel start */}
                    <div className='row login_panel'>
                        <div className='col-md-3 login_left_panel' style={{ paddingLeft: '25px' }}>
                            { isAuthenticated ? (
                                <>
                                    <p>{ name } | &nbsp;</p>
                                    <p onClick={onLogout} style={{ textDecoration: 'none', color: '#000', cursor: 'pointer' }} className='title1'>Logout </p>&nbsp; 
                                </>
                            ) : (
                                <><Link to="/login" style={{ textDecoration: 'none', color: '#000' }}><p className='title1'>Login </p></Link>&nbsp; | &nbsp;
                                <Link to="/register" style={{ textDecoration: 'none', color: '#000' }}><p className='title1'>Sign Up </p></Link>&nbsp; | &nbsp;</>
                            )}
                            
                            {/* <p className='title1'>Jason | &nbsp;</p>
                            <p className='title1'>Logout  </p> */}
                        </div>
                        {/* <div className='col-md-9 login_right_panel'>
                            <p className='title2'>Your files &gt; &nbsp;</p>
                            <p className='title2'>CONTACTAP_TEMPLATES</p>
                        </div> */}
                    </div>
                    {/* login panel end */}

                    <div className='main_panel'>
                        <div className='col-md-3'>
                            <div className='row tree_panel'>
                                <div id="jstree_demo" className="demo"></div>
                                <button type="button" className="btn btn-primary" onClick={onCreateTreeview} style={{ width: '95%', marginTop: '20px' }}>Create</button>
                            </div>
                            <div className='row upload_panel'>
                                <FileUpload />
                            </div>
                        </div>
                        <div className='col-md-9'>
                            <div className='row metacard_panel'>
                                {/* <div className='col-md-3'>
                                    <div className='card'>
                                        <img src='upload/Screenshot_4.png' width="100%" height="250px" />
                                        <p>CONTACTAP TEMPLATES</p>
                                    </div>
                                </div> */}
                                { displayContent }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment >
    )
}

export default Dashboard;