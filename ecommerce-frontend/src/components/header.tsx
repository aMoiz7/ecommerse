import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useState } from "react";

const User = {
  _id: "12345",
  role: "admin",
};

const header = () => {
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
      {User?._id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>{" "}
          <dialog open={isOpen}>
            <div>
              {" "}
              {User.role === "admin" && (
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
