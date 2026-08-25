import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#141416",
          borderRadius: "40px",
        }}
      >
        <svg
          width="112"
          height="112"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 4H28V28H4V4ZM8 8H24V16H14V24H8V8Z"
            fill="#FFFFFF"
          />
          <rect x="17" y="19" width="7" height="5" fill="#E04B28" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
