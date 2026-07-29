import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MT Capital — Comprar bem começa antes do lance";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#192332",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          color: "#F5F1EA",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            color: "#C4A275",
            textTransform: "uppercase",
          }}
        >
          Assessoria em leilão de imóveis e terrenos
        </div>
        <div style={{ fontSize: 76, marginTop: 28, lineHeight: 1.05 }}>
          Comprar bem começa antes do lance.
        </div>
        <div
          style={{
            fontSize: 26,
            marginTop: 40,
            letterSpacing: 4,
            color: "#A88458",
            textTransform: "uppercase",
          }}
        >
          MT Capital
        </div>
      </div>
    ),
    size,
  );
}
