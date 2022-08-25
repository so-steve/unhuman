import React, { useState, useEffect, useLayoutEffect } from "react";
import image from "./demo.png";
import base64 from "base-64";
import Moralis from "moralis";
import yolo from "tfjs-yolo";
import ReactDOM from "react-dom";
import Webcam from "react-webcam";
import NameNWallet from "./nameNWallet";
import NFTContract from "./contracts/NFTContract";
import Info from "./info";
import Web3 from "web3";
import axios from "axios";
import About from "./about";
import "./App.css";

const contractAddress = Info.address;

const web3ForCalls = new Web3(
  new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/*********")
);

const contractForCalls = new web3ForCalls.eth.Contract(
  NFTContract,
  contractAddress
);

//fill the credentials
Moralis.initialize("*********");
Moralis.serverURL = "https://sv3qzr5k8p8n.usemoralis.com:2053/server";

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

let metaColors = [];
let numberOfAllObjects;

const colors = [
  "Red",
  "Magenta",
  "Lime",
  "Yellow",
  "Blue",
  "Cyan",
  "Orangered",
  "Purple",
];

const availableColors = [
  "Red",
  "Magenta",
  "Lime",
  "Yellow",
  "Blue",
  "Cyan",
  "Orangered",
  "Purple",
];

let model;

function App() {
  document.body.style = "background: #272822;";
  const [currentWallet, setWallet] = useState(null);
  const [web33, setWeb33] = useState(null);

  const [coordies, setCoordies] = useState(null);
  const [colori, setColori] = useState(null);
  const [section, setSection] = useState(1);
  const [mintedTokenId, setMintedTokenId] = useState("???");
  const [allMinted, setAllMinted] = useState("???");
  const [canMint, setCanMint] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [desktop, setDesktop] = useState(false);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  useLayoutEffect(async () => {
    loadRandomImage();
    const userLogged = localStorage.getItem("loggedin");
    console.log(userLogged);

    if (userLogged === 1) {
      giveProvider();
    }
  }, []);

  useEffect(async () => {
    document.getElementsByTagName("html")[0].style.overflow = "hidden";

    if (
      navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|Blackberry/i)
    ) {
      setDesktop(false);
    } else {
      setDesktop(true);
      document.getElementsByTagName("html")[0].style["overflow-y"] = "scroll";
    }

    await console.log("yo");
  }, []);

  function hello() {
    const img = document.getElementById("img");
    var c = document.getElementById("file-preview");
    console.log(img);
    var ctx = c.getContext("2d");

    img.onload = function () {
      ctx.drawImage(
        img,
        img.width * 0.1,
        -1 * (img.height / 4),
        img.width * 2,
        img.height * 1.8
      );
      console.log(c.toDataURL());
    };
  }

  const webcamRef = React.useRef(null);

  function encode(input) {
    var keyStr =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
      chr1 = input[i++];
      chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
      chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output +=
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
    }
    return output;
  }

  async function giveProvider() {
    const web3 = await Moralis.enableWeb3({ provider: "walletconnect" });
    await localStorage.setItem("loggedin", 1);
    await setWeb33(web3);
    await console.log(web3);
    let accounts = await web3.eth.getAccounts();
    await setWallet(accounts[0].substring(0, 7));
  }

  async function authenticate() {
    console.log("auth");
    await giveProvider();
    setSection(5);
  }

  function makeColorArray(colorArray, colorsNumber, length) {
    let newArray = shuffle(colorArray);
    let slicedArray = newArray.slice(0, colorsNumber);
    let newnewArray = slicedArray;
    if (slicedArray.length < length) {
      for (let i = slicedArray.length; i < length; i++) {
        let onlyValidValues = newnewArray.filter(
          (v) => v !== newnewArray[newnewArray.length - 1]
        );
        let color =
          onlyValidValues[Math.floor(Math.random() * onlyValidValues.length)];
        newnewArray.push(color);
      }
    }
    return slicedArray;
  }

  const capture = React.useCallback(async () => {
    const viewportClassList = document
      .getElementById("viewport")
      .classList.toString();
    //turning on the camera
    if (viewportClassList.includes("d-none")) {
      setSection(2);
      setWebcamEnabled(true);
      document.getElementById("minted").classList.add("d-none");
      document.getElementById("info").classList.add("d-none");
      document.getElementById("viewport").classList.remove("d-none");
      document.getElementById("processing").classList.add("d-none");
    } else {
      //taking a picture
      const imageSrc = webcamRef.current.getScreenshot();
      document.getElementById("img").src = imageSrc;
      setSection(3);
      document.getElementById("processing").classList.remove("d-none");
      detect();
    }
  }, [webcamRef]);

  const onImageChange = async (e) => {
    const file = document.getElementById("file").files[0];
    console.log(file.name);
  };

  async function mint() {
    try {
      const web3 = web33;
      let accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      let testo2 = await new web3.eth.Contract(NFTContract, contractAddress);

      //GOOD FOR PRODUCTION
      console.log("MetaString");
      let coordiesLength = coordies.length / 2;
      let coloriLength = countUnique(colori);
      console.log("coordies");
      console.log(coordies);
      console.log("coordiesLength");
      console.log(coordiesLength);
      console.log("coloriLength");
      console.log(coloriLength);
      console.log("colori");
      console.log(colori);
      let magicCordies = "-" + coordies.join().replaceAll(",", "-") + "-";

      let estGas = 510000;

      if (coordiesLength >= 9) {
        estGas = 580000;
      }

      testo2.methods
        .mint(magicCordies, coordiesLength, coloriLength, colori)
        .send({
          from: accounts[0],
          gas: estGas,
          value: web3ForCalls.utils.toWei("0.1", "ether"),
        })
        .once("transactionHash", function (hash) {
          console.log("minting");
          setTransactionHash(hash);
          setSection(8);
        })
        .then(async function (receipt) {
          let generatedToken = receipt.events.Transfer.returnValues.tokenId;

          console.log(receipt);
          console.log(generatedToken);
          setMintedTokenId(generatedToken);
          setAllMinted(generatedToken);
          setSection(6);
        })
        .catch((error) => {
          console.log(error);
          alert(error.toString());
        });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(error.toString());
      console.error(error);
    }
  }

  function mintUI() {
    const userLogged = localStorage.getItem("loggedin");
    console.log(userLogged);
    if (userLogged === 1) {
      giveProvider();
      setSection(5);
    } else {
      setSection(4);
    }
  }

  async function getTotalMinted() {
    let res = await contractForCalls.methods.artBalance(contractAddress).call();
    return 777 - res;
  }

  async function getRandomArt() {
    let number = await getTotalMinted();
    console.log("this");
    console.log(number);

    let resTest = await contractForCalls.methods
      .makeArt(
        "-" +
          [
            [197, 287],
            [112, 59],
            [23, 365],
            [69, 82],
            [10, 10],
            [69, 82],
            [23, 365],
            [69, 82],
            [112, 59],
            [23, 365],
            [197, 287],
            [112, 59],
            [23, 365],
            [197, 287],
            [10, 10],
            [69, 82],
          ]
            .join()
            .replaceAll(",", "-") +
          "-",
        8,
        [0, 5, 3, 1, 4, 5, 6, 7]
      )
      .call();
    console.log("art");
    console.log(resTest);
    setAllMinted(number);
    if (number == 0) {
      ReactDOM.render(
        <img
          width="3000px"
          height="3000px"
          id="artMade"
          className="img-fluid d-none"
          src="/composition0.png"
          alt=""
        />,
        document.getElementById("renderedImage")
      );
      document.getElementById("artMade").addEventListener("load", function () {
        document.getElementById("artMade").classList.remove("d-none");
        document.getElementById("loadingBox").classList.add("d-none");
      });
      setMintedTokenId(0);
    }
    let randomNumber = Math.floor(Math.random() * number + 1);
    let res = await contractForCalls.methods.tokenURI(randomNumber).call();
    setMintedTokenId(randomNumber);
    // number = number + 800;

    setAllMinted(number);
    if (number >= 777) {
      console.log("can't mint more");
      setCanMint(true);
    } else {
      console.log("can mint more");
      setCanMint(false);
    }

    return { id: randomNumber, image: res };
  }

  async function loadRandomImage() {
    let artRes = await getRandomArt();
    console.log("artRes");
    console.log(artRes);
    let art = artRes.image;
    console.log(getRandomArt);
    axios
      .get(art)
      .then(function (response) {
        // handle success
        console.log(response.data.image);
        ReactDOM.render(
          <img
            width="3000px"
            height="3000px"
            id="artMade"
            className="img-fluid d-none"
            src={response.data.image}
            alt=""
          />,
          document.getElementById("renderedImage")
        );
        document
          .getElementById("artMade")
          .addEventListener("load", function () {
            document.getElementById("artMade").classList.remove("d-none");
            document.getElementById("loadingBox").classList.add("d-none");
          });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

  async function testing2() {
    loadRandomImage();
  }

  function compare(a, b) {
    if (a.width * a.height > b.width * b.height) {
      return -1;
    }
    if (a.width * a.height < b.width * b.height) {
      return 1;
    }
    return 0;
  }

  function about() {
    console.log("yeah");
    document.getElementById("mainUI").classList.remove("d-block");
    document.getElementById("mainUI").classList.remove("d-md-none");
    document.getElementById("mainUI").classList.add("d-none");
    document.getElementById("aboutSection").classList.remove("d-none");
    document.getElementsByTagName("html")[0].style.overflow = "scroll";
  }

  function parentMethod(data) {
    document.getElementById("mainUI").classList.remove("d-none");
    document.getElementById("mainUI").classList.add("d-block");
    document.getElementById("mainUI").classList.add("d-md-none");
    document.getElementById("aboutSection").classList.add("d-none");
    window.scrollTo(0, 0);
    document.getElementsByTagName("html")[0].style.overflow = "hidden";
  }

  function back2() {
    console.log("back 2");
    setSection(2);
    setWebcamEnabled(false);
    setWebcamEnabled(true);
    document.getElementById("minted").classList.add("d-none");
    document.getElementById("info").classList.add("d-none");
    document.getElementById("viewport").classList.remove("d-none");
    document.getElementById("processing").classList.add("d-none");
    document.getElementById("processingImgDiv").innerHTML = "";

    ReactDOM.render(
      <div className="square-box">
        <div class="square-content" style={{ backgroundColor: "#000000" }}>
          <div>
            <h3 className="loading" style={{ color: "#66D9EF" }}>
              processing
            </h3>
          </div>
        </div>
      </div>,
      document.getElementById("processingDiv")
    );
  }

  function countUnique(iterable) {
    return new Set(iterable).size;
  }

  function back1() {
    console.log("back 1");
    //setWebcamEnabled(false);
    document.getElementById("minted").classList.remove("d-none");
    document.getElementById("info").classList.remove("d-none");
    document.getElementById("viewport").classList.add("d-none");

    setSection(1);
  }

  const detect = async () => {
    // Check data is available
    console.log("tes");
    hello();
    document.getElementById("info").classList.remove("d-none");
    document.getElementById("viewport").classList.add("d-none");
    document.getElementById("processing").classList.remove("d-none");

    //CHANGE THIS TO CHANGE THE SOURCE OF THE DETECT IMAGE
    //const img = await document.getElementById("img");
    model = await yolo.v2tiny();
    console.log(model);
    const img = await document.getElementById("file-preview");
    console.log("square");
    console.log(img.toDataURL());
    let boxes = await model.predict(img, {
      maxBoxes: 8, // defaults to 20
      scoreThreshold: 0.1, // defaults to .5
      iouThreshold: 0.2, // defaults to .3
      numClasses: 80, // defaults to 80 for yolo v3, tiny yolo v2, v3 and 20 for tiny yolo v1
      inputSize: 416, // defaults to 416
    });

    boxes = await model.predict(img, {
      maxBoxes: 10, // defaults to 20
      scoreThreshold: 0.1, // defaults to .5
      iouThreshold: 0.2, // defaults to .3
      numClasses: 80, // defaults to 80 for yolo v3, tiny yolo v2, v3 and 20 for tiny yolo v1
      inputSize: 416, // defaults to 416
    });

    console.log("this");
    console.log(img);
    const ArrayThis = [];
    const coordWeb3 = [];
    const colorsArray = [];

    let ratio = 500 / img.width;

    let numberColors = getRandomInt(2, colors.length + 1);

    let newColors = makeColorArray(colors, numberColors, 20);

    let boxArrayColors = [];

    numberOfAllObjects = boxes.length;

    boxes.sort(compare);

    boxes.forEach((element) => {
      console.log(element);
      //colorsArray.push(colors.indexOf(newColors[ArrayThis.length]));
      console.log(newColors[ArrayThis.length]);

      ArrayThis.push({
        w: Math.floor(element.width * ratio),
        h: Math.floor(element.height * ratio),
        x: Math.floor(element.left * ratio),
        y: Math.floor(element.top * ratio),
        color: newColors[ArrayThis.length],
      });
      console.log(
        Math.floor(element.left * ratio),
        " ",
        Math.floor(element.top * ratio)
      );
      console.log(
        Math.floor(element.width * ratio),
        " ",
        Math.floor(element.height * ratio)
      );
      coordWeb3.push([
        Math.floor(element.left * ratio),
        Math.floor(element.top * ratio),
      ]);
      coordWeb3.push([
        Math.floor(element.width * ratio),
        Math.floor(element.height * ratio),
      ]);
      boxArrayColors.push(newColors[ArrayThis.length]);
    });

    ArrayThis.forEach((x) => {
      console.log(x.color);
      console.log(availableColors.indexOf(x.color.toString()));
      colorsArray.push(availableColors.indexOf(x.color.toString()));
    });

    console.log(coordWeb3);
    console.log(colorsArray);

    let uniqueColor = boxArrayColors.filter(onlyUnique);
    metaColors = uniqueColor;

    if (coordWeb3.length > 3) {
      mintUI();

      setCoordies(coordWeb3);
      setColori(colorsArray);

      let resTest = await contractForCalls.methods
        .makeArt(
          "-" + coordWeb3.join().replaceAll(",", "-") + "-",
          coordWeb3.length / 2,
          colorsArray
        )
        .call();

      await ReactDOM.render(
        <img
          width="3000px"
          height="3000px"
          id="artGen"
          className="img-fluid d-none"
          src={"data:image/svg+xml;base64," + base64.encode(resTest)}
          alt=""
        />,
        document.getElementById("processingDiv")
      );
      document.getElementById("artGen").addEventListener("load", function () {
        document.getElementById("artGen").classList.remove("d-none");
      });
    } else {
      //no object found
      ReactDOM.render(
        <div className="square-box">
          <div class="square-content" style={{ backgroundColor: "#000000" }}>
            <div>
              <h3 style={{ color: "#F92672" }}>No objects detected :(</h3>
            </div>
          </div>
        </div>,
        document.getElementById("processingDiv")
      );
      setSection(7);
    }
  };

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function moreInfo() {
    console.log("more info");

    document.getElementById("desktop").classList.remove("d-block");
    document.getElementById("desktop").classList.add("d-none");
    document.getElementById("desktopAbout").classList.remove("d-none");
  }

  function desktopMoreBack() {
    document.getElementById("desktop").classList.add("d-block");
    document.getElementById("desktop").classList.remove("d-none");
    document.getElementById("desktopAbout").classList.add("d-none");
  }

  function logOut() {
    localStorage.setItem("loggedin", 0);
    if (section === 5) {
      setSection(4);
    }
    Moralis.User.logOut();
    setWallet(null);
  }

  return (
    <div className="App">
      <div
        id="desktop"
        className={desktop ? "d-block p-4" : "d-none d-md-block p-4"}
      >
        <h3 style={{ color: "#F92672", textAlign: "left" }}>
          unhuma<span style={{ letterSpacing: ".3em" }}>n</span>
          <span style={{ color: "#FFFFFF", letterSpacing: ".2em" }}>(</span>
          <span style={{ color: "#66D9EF" }}>
            composition<span style={{ letterSpacing: ".2em" }}>s</span>
          </span>
          <span style={{ color: "#FFFFFF", letterSpacing: ".2em" }}>)</span>{" "}
        </h3>
        <h3 style={{ color: "#A6E22E", textAlign: "left" }}>
          {("0000" + allMinted).slice(-3)}/777
        </h3>
        {canMint ? (
          <h3
            style={{
              color: "#75715E",
              textAlign: "left",
              lineHeight: "32px",
            }}
          >
            "Unhuman Compositions" is a collection of 777 participatory
            generative photography NFTs by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.damjanski.com"
            >
              [Damjanski]
            </a>{" "}
            – each generated when you take a photo with the camera of your
            smartphone. Each NFT is fully stored and rendered on chain.
          </h3>
        ) : (
          <h3
            style={{
              color: "#75715E",
              textAlign: "left",
              lineHeight: "32px",
            }}
          >
            "Unhuman Compositions" is a collection of 777 participatory
            generative photography NFTs by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.damjanski.com"
            >
              [Damjanski]
            </a>{" "}
            – each generated when you take a photo with the camera of your
            smartphone. Each NFT is fully stored and rendered on chain.
          </h3>
        )}

        <h3
          className="pt-5"
          style={{
            color: "#FD971F",
            textAlign: "left",
            lineHeight: "32px",
          }}
        >
          {canMint
            ? "All 777 have been minted."
            : "This doesn’t work on desktop."}
        </h3>
        <h3
          style={{
            color: "#75715E",
            textAlign: "left",
            lineHeight: "32px",
          }}
        >
          {canMint
            ? "Check OpenSea to see the full collection."
            : "No. Visit unhuman.xyz on your phone to start your minting process."}
        </h3>
        <h3
          onClick={moreInfo}
          className="pt-5 text-left clickable"
          style={{ color: "#FFFFFF" }}
        >
          [More Info]
        </h3>
        <h3 className="text-left" style={{ color: "#FFFFFF" }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={Info.collection}
            //className="disabled"
          >
            [OpenSea]
          </a>
        </h3>
        <h3 className="text-left" style={{ color: "#FFFFFF" }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://etherscan.io/address/${contractAddress.toLocaleLowerCase()}`}
          >
            [Contract]
          </a>
        </h3>
        <h3 className="text-left" style={{ color: "#FFFFFF" }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/Damjanski"
          >
            [Twitter]
          </a>
        </h3>
      </div>
      <div id="desktopAbout" className="d-none p-4">
        <h3
          onClick={desktopMoreBack}
          className="clickable"
          style={{
            color: "#ffffff",
            textAlign: "left",
            lineHeight: "32px",
          }}
        >
          [Back]
        </h3>
        <h3 className="lh32 pt-3" style={{ color: "#66D9EF" }}>
          What is Unhuman Compositions?{"\n"}
          <span style={{ color: "#75715E" }}>
            "Unhuman Composition" is a participatory generative photography
            artwork by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.damjanski.com"
            >
              [Damjanski]
            </a>
            . People are invited to explore the abstraction of our physical
            world through a generative algorithm. Each captured photo will be
            translated into a geometric arrangement of vivid colors on black.
            These compositions are based on an algorithm detecting objects
            within the photograph. The reduction of information creates an
            abstraction that reveals a synthetic structure underlying our
            natural surroundings.
          </span>
        </h3>

        <h3 className="lh32 pt-3" style={{ color: "#A6E22E" }}>
          How does it work?{"\n"}
          <span style={{ color: "#75715E" }}>
            First you take a photo. An object detection algorithm analyses the
            image. The detected objects become the backbone for a generated
            composition. Once you find a composition you like, you can press
            mint, and confirm it in your mobile wallet, to start the process of
            minting your Unhuman Composition NFT.
          </span>
        </h3>

        <h3 className="lh32 pt-3" style={{ color: "#AE81FF" }}>
          What is the price of an Unhuman Composition?{"\n"}
          <span style={{ color: "#75715E" }}>The cost to mint is 0.1 ETH.</span>
        </h3>
        <h3 className="lh32 pt-3" style={{ color: "#E6DB74" }}>
          What is the collection?{"\n"}
          <span style={{ color: "#75715E" }}>
            "Unhuman Compositions" is a collection of 777 participatory
            generative photography NFTs by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.damjanski.com"
            >
              [Damjanski]
            </a>{" "}
            – each generated when you take a photo with the camera of your
            smartphone. Each NFT is fully stored and rendered on chain.
          </span>
        </h3>

        <h3 className="lh32 pt-3" style={{ color: "#FD971F" }}>
          Does this work on desktop?{"\n"}
          <span style={{ color: "#75715E" }}>
            No. Visit unhuman.xyz on your phone to start your minting process.
          </span>
        </h3>
        <h3 className="lh32 pt-3" style={{ color: "#66D9EF" }}>
          More about the artist:{"\n"}
          <span style={{ color: "#75715E" }}>
            Damjanski is an artist living in a browser. Concerned with themes of
            power, poetry and participation, he explores the concept of apps as
            artworks. The app "Bye Bye Camera" is the camera for the post-human
            era. Every picture people take automatically removes any person. The
            app "Computer Goggles" let’s people capture the world like a machine
            sees it and the "LongARcat" app creates long cats in AR.{"\n"}In
            2018, he co-founded "MoMAR", an Augmented Reality gallery app aimed
            at democratizing physical exhibition spaces, art institutions and
            curatorial processes within New York’s Museum of Modern Art. WIRED
            covered the launch with the headline "Augmented Reality Is
            Transforming Museums".{"\n"}He created an online space that only
            programs can access. This software performance, called "Humans not
            invited", first hit Reddit’s front page before it was shown at the
            König Galerie in Berlin. His work has appeared internationally,
            including exhibitions at NRW-Forum, König Galerie, Roehrs & Boetsch,
            Pioneer Works, MoCDA, Tropez, Import Projects. Currently Damjanski
            resides in New York.{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.damjanski.com"
            >
              [Artist Website]
            </a>
          </span>
        </h3>
        <h3 className="pt-5 text-left" style={{ color: "#FFFFFF" }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={Info.collection}
            //className="disabled"
          >
            [OpenSea]
          </a>
        </h3>
        <h3 className="text-left" style={{ color: "#FFFFFF" }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://etherscan.io/address/${contractAddress.toLocaleLowerCase()}`}
          >
            [Contract]
          </a>
        </h3>
        <h3 className="text-left" style={{ color: "#FFFFFF" }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/Damjanski"
          >
            [Twitter]
          </a>
        </h3>
        <h3
          onClick={desktopMoreBack}
          className="text-left pt-3 clickable"
          style={{ color: "#FFFFFF" }}
        >
          [Back]
        </h3>
      </div>
      <div id="mainUI" className={!desktop ? "d-block d-md-none" : "d-none"}>
        <picture>
          <img
            style={{
              width: "400px",
              height: "400px",
              backgroundSize: "cover",
              objectFit: "cover",
              backgroundPosition: "center center",
            }}
            id="img"
            className="img-fluid d-none"
            src={image}
            alt=""
          />
          <div id="here"></div>
        </picture>
        <canvas
          width="800"
          height="800"
          className="d-none"
          id="file-preview"
        ></canvas>
        <div className="px-3" id="info">
          <div>
            <NameNWallet
              logOut={(data) => logOut()}
              wallet={currentWallet !== null ? currentWallet : ""}
            />
          </div>
          <div>
            <h3 style={{ color: "#A6E22E", textAlign: "left" }}>
              {("0000" + allMinted).slice(-3)}/777
            </h3>
          </div>
          <div className={section === 1 ? "" : "d-none"}>
            <h3
              style={{
                color: "#75715E",
                textAlign: "left",
                lineHeight: "32px",
              }}
            >
              Take a photo to create a generative NFT stored on chain.
            </h3>
            <div className={canMint ? "" : "d-none"}>
              <h3
                className="pt-4"
                style={{ color: "#FD971F", textAlign: "left" }}
              >
                All 777 have been minted.
              </h3>
              <h3
                style={{
                  color: "#75715E",
                  textAlign: "left",
                  lineHeight: "32px",
                }}
              >
                Check OpenSea to see the full collection.
              </h3>
              <div className="fixed-bottom px-3 mb-5">
                <h3
                  onClick={about}
                  className="text-left pb-1"
                  style={{ fontSize: "18px", color: "#FFFFFF" }}
                >
                  [About]
                </h3>
                <h3
                  className="text-left pb-1"
                  style={{ fontSize: "18px", color: "#FFFFFF" }}
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={Info.collection}
                    //className="disabled"
                  >
                    [Opensea]
                  </a>
                </h3>
                <h3
                  className="text-left pb-1"
                  style={{ fontSize: "18px", color: "#FFFFFF" }}
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://etherscan.io/address/${contractAddress.toLocaleLowerCase()}`}
                  >
                    [Contract]
                  </a>
                </h3>
                <h3
                  className="text-left pb-1"
                  style={{ fontSize: "18px", color: "#FFFFFF" }}
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://twitter.com/Damjanski"
                  >
                    [Twitter]
                  </a>
                </h3>
              </div>
            </div>
          </div>
          <div className={section === 2 || section === 3 ? "" : "d-none"}>
            <h3
              style={{
                color: "#75715E",
                textAlign: "left",
                lineHeight: "32px",
              }}
            >
              Your composition is processing.{"\n"}This can take a second.
            </h3>
          </div>
          <div className={section === 4 ? "" : "d-none"}>
            <h3
              style={{
                color: "#75715E",
                textAlign: "left",
                lineHeight: "32px",
              }}
            >
              This composition is based on the objects detected in your photo.
            </h3>
          </div>
          <div className={section === 5 ? "" : "d-none"}>
            <h3
              style={{
                color: "#75715E",
                textAlign: "left",
                lineHeight: "32px",
              }}
            >
              Wallet connected. You can now mint your Unhuman Composition.
            </h3>
          </div>
          <div className={section === 8 ? "" : "d-none"}>
            <h3
              style={{
                color: "#75715E",
                textAlign: "left",
                lineHeight: "32px",
              }}
            >
              Your NFT is being created.{"\n "}
            </h3>
          </div>
          <div className={section === 6 ? "" : "d-none"}>
            <h3
              style={{
                color: "#75715E",
                textAlign: "left",
                lineHeight: "32px",
              }}
            >
              Congrats, you’ve minted{"\n"}
              Unhuman Composition #{mintedTokenId}
            </h3>
          </div>
          <div className={section === 7 ? "" : "d-none"}>
            <h3
              style={{
                color: "#75715E",
                textAlign: "left",
                lineHeight: "32px",
              }}
            >
              Try to take a photo with a couple of different subjects.
            </h3>
          </div>
        </div>
        <div id="minted" className={canMint ? "d-none" : ""}>
          <div className="px-3" id="randomImageDiv">
            <div class="square-box" id="loadingBox">
              <div class="square-content">
                <div>
                  <h3 className="loading" style={{ color: "#66D9EF" }}>
                    loading
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="px-3">
            <div id="renderedImage"></div>
            <h3
              className="text-left pt-2"
              style={{ fontSize: "14px", color: "#000000" }}
            >
              unhuman composition #{mintedTokenId}
            </h3>
          </div>
        </div>
        <div id="processing" className="px-3 d-none">
          <div id="processingImgDiv"></div>
          <div id="processingDiv">
            <div className="square-box">
              <div
                class="square-content"
                style={{ backgroundColor: "#000000" }}
              >
                <div>
                  <h3 className="loading" style={{ color: "#66D9EF" }}>
                    processing
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="viewport"
          style={{ position: "relative", zIndex: -4 }}
          className="d-none"
        >
          {webcamEnabled ? (
            <div className="d-none d-md-block">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "environment",

                  width: window.screen.height * 1,

                  height: window.screen.width * 1,
                }}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="container"></div>
        <h1
          className="d-none"
          onClick={async () => {
            const web3 = await Moralis.authenticate({
              provider: "walletconnect",
            });
            console.log(Moralis.User.current());
            await setWeb33(web3);
          }}
        >
          auth
        </h1>
        <h1
          className="d-none"
          onClick={async () => {
            await Moralis.User.logOut();
            await setWeb33(null);
          }}
        >
          sign out
        </h1>
        <h1 className="d-none" onClick={mint}>
          mint
        </h1>
        <input
          id="file"
          type="file"
          className="d-none"
          onChange={(e) => {
            onImageChange(e);
          }}
        />
        <canvas
          id="myCanvas"
          className="d-none"
          width="270"
          height="160"
          style={{ border: "1px solid black", backgroundColor: "#00FFFF" }}
        >
          Your browser does not support the &lt;canvas&gt; element.
        </canvas>
        <div
          className="fixed-bottom mt-5"
          style={{ position: "absulute", zIndex: 0 }}
        >
          <div className="container-fluid">
            <div
              className={section === 1 && !canMint ? "row pb-3" : "d-none"}
              id="buttons1"
            >
              <div className="col-4 d-flex">
                <h3
                  className="justify-content-center align-self-center"
                  id="section1"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={Info.collection}
                    //className="disabled"
                  >
                    [Opensea]
                  </a>
                </h3>
              </div>
              <div className="col-4" id="section2Col">
                <img
                  id="captureButton"
                  onClick={capture}
                  className="img-fluid max88 d-done"
                  src="button.png"
                  alt=""
                />
              </div>
              <div id="section3Col" className="col-4 d-flex ">
                <h3
                  onClick={about}
                  id="section3"
                  className="align-self-center justify-content-right toRight"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "right !important",
                    lineHeight: "32px",
                  }}
                >
                  [About]
                </h3>
              </div>
            </div>
            <div
              className={section === 2 ? "row pb-3" : "d-none"}
              id="buttons2"
            >
              <div className="col-4 d-flex">
                <h3
                  onClick={back1}
                  className="justify-content-center align-self-center"
                  id="section1"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  [Back]
                </h3>
              </div>
              <div className="col-4" id="section2Col">
                <img
                  id="captureButton"
                  onClick={capture}
                  className="img-fluid max88 d-done"
                  src="button.png"
                  alt=""
                />
              </div>
            </div>
            <div
              className={section === 3 ? "row pb-3" : "d-none"}
              id="buttons3"
            >
              <div className="col-4 d-flex">
                <h3
                  onClick={back2}
                  className="justify-content-center align-self-center"
                  id="section1"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  [Back]
                </h3>
              </div>
              <div className="col-4" id="section2Col">
                <img
                  id="captureButton"
                  className="img-fluid max88 hide"
                  src="button.png"
                  alt=""
                />
              </div>
            </div>
            <div
              className={section === 4 ? "row pb-3" : "d-none"}
              id="buttons4"
              style={{ marginBottom: "23px" }}
            >
              <div className="col-4 d-flex">
                <h3
                  onClick={back2}
                  className="justify-content-center align-self-center"
                  id="section1"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  [Back]
                </h3>
              </div>
              <div id="section3Col" className="col-8 d-flex ">
                <h3
                  onClick={authenticate}
                  className="align-self-center justify-content-right toRight"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "right !important",
                    lineHeight: "32px",
                  }}
                >
                  [Connect Wallet]
                </h3>
              </div>
            </div>
            <div
              className={section === 5 ? "row pb-3" : "d-none"}
              id="buttons5"
              style={{ marginBottom: "28px" }}
            >
              <div className="col-6">
                <h3
                  onClick={back2}
                  className="justify-content-center align-self-center"
                  id="section1"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  [Back]
                </h3>
              </div>
              <div id="section3Col" className="col-6 ">
                <h3
                  onClick={mint}
                  className="justify-content-center align-self-center"
                  id="mintButton"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "right",
                  }}
                >
                  [Mint]
                </h3>
              </div>
            </div>
            <div
              className={
                section === 6 ? "d-flex justify-content-between pb-3" : "d-none"
              }
              id="buttons6"
              style={{ marginBottom: "23px" }}
            >
              <h3
                onClick={() => window.location.reload(false)}
                id="section1"
                style={{
                  color: "#FFFFFF",
                  textAlign: "left",
                }}
              >
                [Home]
              </h3>
              <h3
                id="section1"
                style={{
                  color: "#FFFFFF",
                  textAlign: "left",
                }}
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://etherscan.io/tx/${transactionHash}`}
                >
                  [Etherscan]
                </a>
              </h3>
              <h3
                style={{
                  color: "#FFFFFF",
                }}
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://opensea.io/assets/${contractAddress.toLowerCase()}/${mintedTokenId}`}
                >
                  [Opensea]
                </a>
              </h3>
            </div>
            <div
              className={section === 7 ? "row pb-3" : "d-none"}
              id="buttons7"
              style={{ marginBottom: "28px" }}
            >
              <div className="col-4 d-flex">
                <h3
                  onClick={() => window.location.reload(false)}
                  className="justify-content-center align-self-center"
                  id="section1"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  [Home]
                </h3>
              </div>
              <div id="section3Col" className="col-8 d-flex ">
                <h3
                  onClick={back2}
                  id="section3"
                  className="align-self-center justify-content-right toRight"
                  style={{
                    color: "#FFFFFF",
                    textAlign: "right !important",
                  }}
                >
                  [Try Again]
                </h3>
              </div>
            </div>
            <div className={section === 8 ? "" : "d-none"}>
              <h3
                style={{
                  color: "#a6e22e",
                  marginBottom: "52px",
                }}
                class="text-center minting"
                id="mint"
              >
                minting
              </h3>
            </div>
            <div className="d-none" onClick={testing2} id="testing2">
              test
            </div>
          </div>
        </div>
      </div>
      <div id="aboutSection" className="d-none">
        <About
          canMint={canMint}
          section={section}
          wallet={currentWallet}
          parentMethod={(data) => parentMethod(data)}
        />
      </div>
    </div>
  );
}

export default App;
