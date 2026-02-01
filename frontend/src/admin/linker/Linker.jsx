import { NavLink } from "react-router-dom";
import "./linker.css";

const Linker = () => {
  return (
    <div className="linker">
      <NavLink
        to="all"
        className={({ isActive }) => isActive ? "active" : ""}
      >
        All
      </NavLink>

      <NavLink
        to="create"
        className={({ isActive }) => isActive ? "active" : ""}
      >
        Create
      </NavLink>
    </div>
  );
};

export default Linker;
