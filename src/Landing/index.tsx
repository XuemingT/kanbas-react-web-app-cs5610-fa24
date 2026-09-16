
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiLayers, FiUsers } from "react-icons/fi";

export default function Landing() {
  return (
    <div className="tf-landing">
      <nav className="tf-nav">
        <Link to="/" className="tf-brand">teamflow<span>.</span></Link>
        <Link to="/Kanbas/Account/Signin" className="btn btn-dark px-4">Sign in</Link>
      </nav>
      <main className="tf-hero">
        <div className="tf-eyebrow">PROJECT OPERATIONS, SIMPLIFIED</div>
        <h1>Keep every team moving in the same direction.</h1>
        <p>TeamFlow brings projects, tasks, ownership, and delivery signals into one focused workspace.</p>
        <div className="d-flex gap-3 flex-wrap">
          <Link to="/Kanbas/Account/Signin" className="btn btn-primary btn-lg px-4">Explore the demo <FiArrowRight className="ms-2" /></Link>
          <a href="#features" className="btn btn-outline-dark btn-lg px-4">See how it works</a>
        </div>
        <div className="tf-demo-note"><FiCheckCircle /> Demo access: <strong>demo.manager</strong> / <strong>Demo!2026</strong></div>
      </main>
      <section id="features" className="tf-feature-grid">
        <article><FiLayers /><h2>Project clarity</h2><p>Turn strategy into visible workstreams, milestones, and tasks.</p></article>
        <article><FiUsers /><h2>Shared ownership</h2><p>Give every task a clear owner and keep the whole team aligned.</p></article>
        <article><FiCheckCircle /><h2>Delivery signals</h2><p>Spot upcoming deadlines and unblock the work that matters.</p></article>
      </section>
    </div>
  );
}
