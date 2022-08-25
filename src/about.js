import React from "react";
import Info from "./info";

const contract = "0x99f0501f97a2ad7dc5d8c99b56ea5ffbfbb60121";
const link = `https://etherscan.io/address/${contract}`;

export default function about(props) {
  return (
    <div>
      <div className="container-fluid text-left wrap">
        <div class="d-flex justify-content-between">
          <h3
            onClick={() => props.parentMethod("Hello from child")}
            className="lh32 pt-2"
            style={{ color: "#FFFFFF" }}
          >
            [Back]
          </h3>

          <div className={props.wallet != null ? "d-inline" : "d-none"}>
            <h3
              className={props.section === 1 ? "lh32 pt-2" : "d-none"}
              style={{ color: "#FFFFFF" }}
            >
              <span style={{ color: "#A6E22E" }}>[</span>
              {props.wallet}
              <span style={{ color: "#A6E22E" }}>]</span>
            </h3>
          </div>
        </div>

        <h3 className="lh32 pt-3" style={{ color: "#66D9EF" }}>
          What is Unhuman Compositions?{"\n"}
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
            –{" "}
            {props.canMint
              ? "each generated when you take a photo with the camera of your smartphone. Each NFT is fully stored and rendered on chain."
              : "each generated when you take a photo with the camera of your smartphone. Each NFT is fully stored and rendered on chain."}
          </span>
        </h3>

        <h3 className="lh32 pt-3" style={{ color: "#A6E22E" }}>
          How does it work?{"\n"}
          <span style={{ color: "#75715E" }}>
            {props.canMint
              ? "First you take a photo. An object detection algorithm analyses the image. The detected objects become the backbone for a generated composition. Once you find a composition you like, you can press mint, and confirm it in your mobile wallet, to start the process of minting your Unhuman Composition NFT."
              : "First you take a photo. An object detection algorithm analyses the image. The detected objects become the backbone for a generated composition. Once you find a composition you like, you can press mint, and confirm it in your mobile wallet, to start the process of minting your Unhuman Composition NFT."}
          </span>
        </h3>

        <h3 className="lh32 pt-3" style={{ color: "#AE81FF" }}>
          What is the price of an Unhuman Composition?{"\n"}
          <span style={{ color: "#75715E" }}>The cost to mint is 0.1 ETH.</span>
        </h3>
        <h3 className="lh32 pt-3" style={{ color: "#E6DB74" }}>
          More about the work:{"\n"}
          <span style={{ color: "#75715E" }}>
            "Unhuman Composition" is a participatory generative photography
            artwork. People are invited to explore the abstraction of our
            physical world through a generative algorithm. Each captured photo
            will be translated into a geometric arrangement of vivid colors on
            black. These compositions are based on an algorithm detecting
            objects within the photograph. The reduction of information creates
            an abstraction that reveals a synthetic structure underlying our
            natural surroundings.
          </span>
        </h3>

        <h3 className="lh32 pt-3" style={{ color: "#FD971F" }}>
          Does this work on desktop?{"\n"}
          <span style={{ color: "#75715E" }}>No.</span>
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

        <h3 className="pt-3" style={{ color: "#FFFFFF" }}>
          <a target="_blank" rel="noopener noreferrer" href={link}>
            [Contract]
          </a>
        </h3>
        <h3 className="pt-1" style={{ color: "#FFFFFF" }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={Info.collection}
            //className="disabled"
          >
            [OpenSea]
          </a>
        </h3>
        <h3 className="pt-1" style={{ color: "#FFFFFF" }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/Damjanski"
          >
            [Twitter]
          </a>
        </h3>
        <h3
          onClick={() => props.parentMethod("Hello from child")}
          className="pt-4 pb-4"
          style={{ color: "#FFFFFF" }}
        >
          [Back]
        </h3>
      </div>
    </div>
  );
}
