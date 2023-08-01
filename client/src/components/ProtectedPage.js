import { message, Layout, Image } from "antd";
import React, { useEffect } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { getLoggedInUserName } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";

function ProtectedPage({ children }) {
  const { currentUser } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Footer } = Layout;
  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetCurrentUser();
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        dispatch(SetCurrentUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    currentUser && (
      <div>
        {/* header */}
        <div className="flex justify-between items-center bg-primary text-white px-5 py-3 rounded-b">
          <div onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-2">
          <Image
              src="https://res.cloudinary.com/dpcpegpsn/image/upload/v1690879600/blood-pressure_nxmp6e.png" // Replace this with the path to your logo image
              alt="BLOODXCHANGE Logo"
              preview={false}
              width={50} 
            />
            <div className="flex flex-col"></div>
            <h1 className="text-2xl">BLOODXCHANGE</h1>
           
          </div>
          <span className="text-s">
              {currentUser.userType.toUpperCase()}
            </span>
          

          <div className="flex items-center gap-1">
          <i class="ri-user-3-fill"></i>
            <div className="flex flex-col">
              <span
                className="mr-5 text-md cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                {getLoggedInUserName(currentUser).toUpperCase()}
              </span>
            </div>

            <i
              className="ri-logout-circle-r-line ml-5 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>
       

        {/* body */}
        <div className="px-5 py-5">{children}</div>
        <Footer style={{ textAlign: 'center', position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#f0f2f5' }}>BloodXChange ©2023 Created by Kumari Astha Rani</Footer>
        
      </div>
      
    )
  );
}

export default ProtectedPage;
