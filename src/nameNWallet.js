import React from "react";

export default function BoilingVerdict(props) {
  const [wallet, setWallet] = React.useState({ ...props.wallet });

  React.useEffect(() => {
    setWallet(props.wallet);
  }, [props.wallet]);

  function menuWalletClick() {
    document.getElementById("overlay").classList.remove("d-none");
    document.getElementById("menu").classList.remove("d-none");
  }

  function menuBackClick() {
    document.getElementById("overlay").classList.add("d-none");
    document.getElementById("menu").classList.add("d-none");
  }

  function logOut() {
    menuBackClick();
    props.logOut("Hello from child");
  }

  return (
    <div>
      <div
        className="pt-3 d-flex justify-content-between"
        style={{ fontSize: "18px" }}
      >
        <div onClick={() => window.location.reload(false)}>
          <h3 style={{ color: "#F92672", textAlign: "left" }}>
            unhuma<span style={{ letterSpacing: ".3em" }}>n</span>
            <span style={{ color: "#FFFFFF", letterSpacing: ".2em" }}>(</span>
            <span style={{ color: "#66D9EF" }}>
              composition<span style={{ letterSpacing: ".2em" }}>s</span>
            </span>
            <span style={{ color: "#FFFFFF", letterSpacing: ".2em" }}>)</span>{" "}
          </h3>
        </div>
        <div>
          <h3
            onClick={menuWalletClick}
            style={{
              color: "#F92672",
              textAlign: "left",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div className={wallet !== "" ? "d-inline" : "d-none"}>
              <span style={{ color: "#A6E22E" }}>[</span>
              <span style={{ color: "#FFFFFF" }}>{props.wallet}</span>
              <span style={{ color: "#A6E22E" }}>]</span>
            </div>
          </h3>
          <div id="menu" className="d-none">
            <h3
              onClick={logOut}
              style={{
                position: "absolute",
                right: "20px",
                top: "50px",
                zIndex: 10,
                textAlign: "left",
              }}
            >
              <span style={{ color: "#A6E22E" }}>[</span>
              <span style={{ color: "#FFFFFF" }}>Logout</span>
              <span style={{ color: "#A6E22E" }}>]</span>
            </h3>
            <h3
              onClick={menuBackClick}
              style={{
                position: "absolute",
                right: "20px",
                top: "80px",
                zIndex: 10,
                textAlign: "left",
              }}
            >
              <span style={{ color: "#A6E22E" }}>[</span>
              <span style={{ color: "#FFFFFF" }}>Back</span>
              <span style={{ color: "#A6E22E" }}>]</span>
            </h3>
          </div>
        </div>
      </div>
      <div
        id="overlay"
        className="d-none z-9"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.76)",
          width: "430%",
          height: "420%",
          left: "-10px",
          top: "-15px",
          position: "fixed",
        }}
      ></div>
    </div>
  );
}
