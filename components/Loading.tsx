export default function Loading() {
  return (
    <div className="loading">
      <div className="loading-logo">
        GARAJ<span>JEANS</span>
      </div>

      <div className="loading-line">
        <div className="loading-progress" />
      </div>

      <style jsx>{`
        .loading {
          width: 100%;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 22px;
        }

        .loading-logo {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .loading-logo span {
          font-weight: 400;
        }

        .loading-line {
          width: 150px;
          height: 2px;
          background: #dedbd4;
          overflow: hidden;
        }

        .loading-progress {
          width: 55%;
          height: 100%;
          background: #111111;
          animation: loadingAnimation 1.1s ease-in-out infinite;
        }

        @keyframes loadingAnimation {
          0% {
            transform: translateX(-110%);
          }

          100% {
            transform: translateX(290%);
          }
        }
      `}</style>
    </div>
  );
}