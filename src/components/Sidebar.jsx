import downloadIcon from "/assets/icons/dowanload.png";
import avatar from "/assets/about/avatar.png";
import PropTypes from "prop-types";
import {
  FaEnvelopeOpenText,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFacebookF,
  FaDribbble,
  FaLinkedinIn,
  FaGithub
} from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";


const Sidebar = ({ personalInfo }) => {
  return (
    <div className="w-full mb-6 lg:mb-0 mx-auto relative bg-white text-center dark:bg-dark-primary px-6 rounded-[20px] mt-[180px] md:mt-[220px] lg:mt-0">
      {/* <!-- profile image --> */}
      <img
        src={avatar}
        className="w-[240px] absolute left-[50%] transform -translate-x-[50%] h-[240px] drop-shadow-xl mx-auto rounded-[20px] -mt-[140px]"
        alt="about"
      />
      <div className="pt-[100px] pb-8">
        <h2 className="mt-6 mb-1 text-[26px] font-semibold dark:text-white">
          {personalInfo[0].data.information.name}
          <span className="text-lightgray-500 ml-2 text-[14px]">
          {personalInfo[0].data.information.pronouns}
          </span>
        </h2>
        <h3 className="mb-4 text-light-text inline-block dark:bg-dark-mobile-primary px-5 py-1.5 rounded-lg dark:text-main-text">
          {personalInfo[0].data.information.profession}
        </h3>
        <div className="flex justify-center space-x-3">
          {/* <!-- GitHub icon and link - COMMENTED OUT until GH is cleaned up
          <a
            href={personalInfo[0].data.information.socialMedia.gitHub}
            aria-label="GitHub Profile Link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex h-10 w-10 items-center justify-center bg-light-bg-five dark:bg-dark-border transition-all duration-300 ease-in-out rounded-lg hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-secondary hover:text-white text-github-icon">
              <FaGithub />
            </span>
          </a>
          --> */}
          {/* <!-- linkedin icon and link --> */}
          <a
            href={personalInfo[0].data.information.socialMedia.linkedIn}
            aria-label="LinkedIn Profile Link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex h-10 w-10 items-center justify-center bg-light-bg-five dark:bg-dark-border transition-all duration-300 ease-in-out rounded-lg hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-secondary hover:text-white text-linkedin-icon">
              <FaLinkedinIn />
            </span>
          </a>

          {/* <!-- Scholar icon and link --> */}
<a
  href={personalInfo[0].data.information.socialMedia.scholar}
  aria-label="Google Scholar Profile Link"
  target="_blank"
  rel="noopener noreferrer"
>
  <span className="flex h-10 w-10 items-center justify-center bg-light-bg-five dark:bg-dark-border transition-all duration-300 ease-in-out rounded-lg hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-secondary hover:text-white text-scholar-icon">
    <SiGooglescholar />
  </span>
</a>
        </div>

      {/* <!-- personal infomation start --> */}
      <div className="p-7 rounded-2xl mt-7 bg-light-bg-five dark:bg-dark-mobile-primary">
        
        {/* Commented out Phone Section
        <div className="flex border-b border-light-border-two dark:border-dark-border-two pb-2.5">
          <span className="flex h-10 w-10 items-center justify-center transition-all duration-300 ease-in-out rounded-lg hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-secondary hover:text-white bg-white dark:bg-black text-icon-color-one shadow-md">
            <FaMobileAlt />
          </span>
          <div className="text-left ml-2.5">
            <p className="text-xs text-text-primary dark:text-main-text">
              Phone
            </p>
            <p className="dark:text-white">
              {personalInfo[0].data.information.phone}
            </p>
          </div>
        </div>
        */}
      
        <div className="flex border-b border-light-border-two dark:border-dark-border-two py-2.5">
          <span className="flex h-10 w-10 items-center justify-center transition-all duration-300 ease-in-out rounded-lg hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-secondary hover:text-white bg-white dark:bg-black text-icon-color-two shadow-md">
            <FaEnvelopeOpenText />
          </span>
          <div className="text-left ml-2.5">
            <p className="text-xs text-text-primary dark:text-main-text">
              Email
            </p>
            <p className="dark:text-white">
              {personalInfo[0].data.information.email}
            </p>
          </div>
        </div>
        <div className="flex border-b border-light-border-two dark:border-dark-border-two py-2.5">
          <span className="flex h-10 w-10 items-center justify-center transition-all duration-300 ease-in-out rounded-lg hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-secondary hover:text-white bg-white dark:bg-black text-icon-color-three shadow-md">
            <FaMapMarkerAlt />
          </span>
          <div className="text-left ml-2.5">
            <p className="text-xs text-text-primary dark:text-main-text">
              Location
            </p>
            <p className="dark:text-white">
              {personalInfo[0].data.information.location}
            </p>
          </div>
        </div>
      
        {/* Commented out Birthday Section
        <div className="flex py-2.5">
          <span className="flex h-10 w-10 items-center justify-center transition-all duration-300 ease-in-out rounded-lg hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-secondary hover:text-white bg-white dark:bg-black text-icon-color-four shadow-md">
            <FaCalendarAlt />
          </span>
          <div className="text-left ml-2.5">
            <p className="text-xs text-text-primary dark:text-main-text">
              Birthday
            </p>
            <p className="dark:text-white">
              {personalInfo[0].data.information.birthday}
            </p>
          </div>
        </div>
        */}
      
      </div>
      {/* <!-- personal infomation end--> */}

        {/* <!-- dowanload button --> */}
        <button className="flex items-center text-lg text-white transition-all ease-in-out duration-200 mt-6 mx-auto px-8 py-3 rounded-[35px] bg-gradient-to-r from-btn-secondary to-btn-primary hover:bg-gradient-to-r hover:from-btn-primary hover:to-btn-secondary">
          <img className="mr-3" src={downloadIcon} alt="icon" />
          <a href="/Curtis_Murray_Resume.pdf" download aria-label="Download CV">
            {" "}
            Download CV
          </a>
        </button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  personalInfo: PropTypes.array,
};

export default Sidebar;
