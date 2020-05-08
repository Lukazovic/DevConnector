import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    owner: { name },
  },
}) => {
  const getFormatedFisrtName = () => {
    const firstName = `${name.trim().split(" ")[0]}`;
    if (firstName.endsWith("s")) return `${firstName}'`;
    return `${firstName}'s`;
  };
  const formatedName = name ? getFormatedFisrtName() : name;

  return (
    <div className="profile-about bg-light p-2">
      {bio && (
        <Fragment>
          <h2 className="text-primary">{formatedName} Bio</h2>
          <p>{bio}</p>
          <div className="line" />
        </Fragment>
      )}

      <h2 className="text-primary">Skill Set</h2>
      <div className="skills">
        {skills.slice(0, 4).map((skill, index) => (
          <div key={index} className="p-1">
            <i className="fa fa-check" /> {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
