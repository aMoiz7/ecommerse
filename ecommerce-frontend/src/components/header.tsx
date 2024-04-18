import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useState } from "react";



const header = ({user}:any|null) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler =()=>{
    setIsOpen(false)
  }

  return (
    <nav className="Header">
      <Link onClick={() => setIsOpen(false)} to={"/"}>
        Home
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/cart"}>
        <FaShoppingBag />
      </Link>
      {user?._id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>{" "}
          <dialog open={isOpen}>
            <div>
              {" "}
              {user.role === "admin" && (
                <Link to={"/admin/dashboard"}>Admin</Link>
              )}{" "}
              <Link to="/orders">Orders</Link>{" "}
              <button onClick={logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default header;
