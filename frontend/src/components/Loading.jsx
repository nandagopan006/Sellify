export default function Loading({ text = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
}