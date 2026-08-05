import { ImageResponse } from "next/og";

// Generates the Open Graph share card at build time. This is a branded
// typographic card rather than a photo, so it needs no placeholder asset.
// PLACEHOLDER: swap for a real photographic OG image once brand photography
// is available.

export const alt =
  "BackHome — trusted help in Cebu when you can't be there. Preparing a Cebu pilot for overseas Filipino families.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0c310a",
          padding: "72px",
          color: "#fffdf6",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#d5e798",
              display: "flex",
            }}
          />
          <div style={{ fontSize: "34px", letterSpacing: "-0.5px" }}>
            BackHome
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "76px",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              maxWidth: "900px",
            }}
          >
            Trusted help in Cebu when you can&rsquo;t be there
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "30px",
              lineHeight: 1.4,
              color: "#c9d7b4",
              maxWidth: "820px",
              fontFamily: "sans-serif",
            }}
          >
            Practical support for parents, relatives and property, coordinated
            locally for families living overseas.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#d5e798",
            fontFamily: "sans-serif",
          }}
        >
          Cebu pilot · Now inviting interest
        </div>
      </div>
    ),
    size,
  );
}
