export const Button = ({ label, onClick, style }) => (
  <button className="scoreBtn" style={style} onClick={onClick}>
    {label}
  </button>
);
