// add use session
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();
  return (
    <nav className="nav">
      <div className="nav-left-container">
        <div className="logo">
          <span className="text-primary">L</span>
          <span>M</span>
          <span className="red">S</span>
        </div>
      </div>
      <div className="nav-right-container">
        <div className="deposit">leagues</div>
        <div className="more">fixtures</div>
        <div className="deposit">tables</div>
        <div className="deposit">about</div>
        {/* Only render the sign-in elements if there is no session */}
        {!session && (
          <div className="sign-in-container flex">
            <div className="sign-in-nav">Sign </div>
            <img className="img-move-up" src="/svgs/user-plus.svg" alt="Sign in" />
          </div>
        )}
        {session && (
          <div onClick={() => signOut("google")} className="deposit">
            sign out
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
