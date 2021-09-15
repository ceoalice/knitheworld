import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import CircularProgress from '@material-ui/core/CircularProgress';

import NavBar from "../../containers/navbar.js";
import Modals from "../modals/modals.js";

import styles from "./users.scss";

import ImageAPI from "../../lib/image-api";

const useStyles = makeStyles((theme) => ({

  imageList: {
    width: "100%",
    height: "100%",
    // paddingTop : 20,
    // paddingBottom : 20
  },
}));

function random() {
 return 1;
}

const UserViewComponent = props => {
    const classes = useStyles();
    const [urls, setUrls ] = useState({});

    // basically componentDidUpdate but only for props.projects 
    useEffect(() => {
      for( const project of props.projects) {
        ImageAPI.getProjectImageURL(project.creator, project.id).then((res => {
          let url = res.data;
          setUrls(urls => ({...urls, [project.id] : url}) );
        }));
      }
    }, [props.projects]);

    return (
      <React.Fragment>
        <NavBar vm={props.vm} />
        <Modals vm={props.vm} />

        <div className={styles.container}> 
          <div className={styles.userCard}>
            <h1> {props.user.username} </h1>
          </div>
          {props.projects.length
            ?   
            <div className={styles.projectsCard}>          
              <ImageList  className={classes.imageList} cols={1}>
                {props.projects.map((project,i) => (
                  
                  <ImageListItem key={i}   cols={random() || 1} >
                    <img 
                      alt={project.name} 
                      src={urls[project.id] || "/static/images/placeholder-image.png"} 
                      style={{cursor: "pointer"}} 
                      onClick={()=>window.location.assign(`/projects/${project.id}`)}
                      loading="lazy"
                    />
                    <ImageListItemBar title={project.name} />
                  </ImageListItem>
                ))}
              </ImageList>
            </div>
            :
            <div className={styles.loading}> 
              <CircularProgress  /> 
            </div>
          }
        </div>
      </React.Fragment>
    );
};

UserViewComponent.propTypes = {
  user : PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired, 

  projects : PropTypes.arrayOf( 
    PropTypes.shape({
      creator : PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      xml: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      timestamp: PropTypes.object.isRequired,
    })
  ).isRequired
}

export default UserViewComponent;