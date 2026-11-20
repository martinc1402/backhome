import { ImageResponse } from "next/og";

// Generates the Open Graph share card at build time. This is a branded
// typographic card rather than a photo, so it needs no placeholder asset.
// PLACEHOLDER: swap for a real photographic OG image once brand photography
// is available.

export const alt =
  "BackHome — trusted elder care for your parents back home. Caregivers, home nurses and care homes in Cebu, each checked by our local team.";
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
            Trusted elder care for your parents back home.
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
            Caregivers, home nurses, care homes and support services in Cebu.
            Each one is checked by our local team.
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
          Cebu City · Mandaue · Lapu-Lapu · Talisay
        </div>
      </div>
    ),
    size,
  );
}
