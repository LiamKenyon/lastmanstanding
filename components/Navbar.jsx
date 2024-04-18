const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-left-container">
        <div className="logo">
          <span className="text-primary">L</span>
          <span>M</span>
          <span className="red">S</span>
        </div>
        <div className="leagues-link">Leagues</div>
        <div className="fixtures">Fixtures</div>
        <div className="live">Live</div>
      </div>
      <div className="nav-right-container">
        <div className="more-container flex">
          <img
            className="img-move-up"
            src="/svgs/nav-arrow-down.svg"
            alt="More"
          />
          <div className="more">More</div>
        </div>
        <div className="deposit">Deposit</div>
        <div className="sign-in-container flex">
          <div className="sign-in-nav">Sign in</div>
          <img className="img-move-up" src="/svgs/user-plus.svg" alt="" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
