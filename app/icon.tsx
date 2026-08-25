import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "8px",
          position: "relative",
        }}
      >
        <svg
          width="22"
          height="22"
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
