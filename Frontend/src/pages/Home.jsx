import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";

const Home = () => {
  const [isSideBarOpen , setIsSideBarOpen] = useState(false);
  const [selectedComponent , setSelectedComponent ] = useState("");

  const {user , isAuthenticated} = useSelector((state) => state.auth);

  if(!isAuthenticated){
    return  <Navigate to = {"/login"} />;
  }
  return <>
  
  
  </>;
};

export default Home;
