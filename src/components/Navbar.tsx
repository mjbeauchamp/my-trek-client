import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem" }}>
      <Link to="/">Home</Link> | <Link to="/gear">Gear</Link>
    </nav>
  );
}       