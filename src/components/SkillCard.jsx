import PropTypes from "prop-types";
import { FaRobot, FaDiagramProject, FaBrain, FaCircleNodes } from "react-icons/fa6";

const iconMap = {
  FaRobot,
  FaDiagramProject,
  FaBrain,
  FaCircleNodes,
};

const SkillCard = ({ skill }) => {
  const Icon = iconMap[skill.data.icon];
  return (
    <div
      className={`flex gap-4 rounded-xl p-6 border-dark-border dark:border-2 ${skill.data.bgColor} dark:bg-transparent`}
    >
      {Icon ? (
        <Icon className="w-10 h-10 text-btn-primary shrink-0" />
      ) : (
        <img
          className="w-10 h-10 object-contain block"
          src={skill.data.img}
          alt="icon"
        />
      )}
      <div className="space-y-2">
        <h3 className="dark:text-white text-[22px] font-semibold">
          {skill.data.skill}
        </h3>
        <p className="leading-8 text-text-primary dark:text-main-text">
          {skill.data.about}
        </p>
      </div>
    </div>
  );
};

SkillCard.propTypes = {
  skill: PropTypes.object,
};

export default SkillCard;
