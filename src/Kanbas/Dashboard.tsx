import { Link, useLocation } from "react-router-dom";
import { FiArrowRight, FiCheck, FiChevronRight, FiClock, FiHash, FiPlus } from "react-icons/fi";

const summaries: Record<string, string> = {
  RS101: "Improve activation with a clearer first-run experience.",
  RS102: "Coordinate the release across product and go-to-market.",
  RS103: "Make product decisions with trusted metrics.",
};

export default function Dashboard({ courses, course, setCourse, addNewCourse }: any) {
  const isProjects = useLocation().pathname.endsWith("/Projects");
  return <div className="tf-page tf-home-page">
    <header className="tf-page-header"><div><p className="tf-eyebrow">NORTHSTAR PRODUCT STUDIO</p><h1>{isProjects ? "Projects" : "Home"}</h1><p>{isProjects ? "Browse every project channel and its delivery status." : "Your shared view of the work happening this week."}</p></div><button onClick={addNewCourse} className="btn btn-primary"><FiPlus className="me-2" />New project</button></header>
    {!isProjects && <section className="tf-home-grid">
      <div className="tf-focus-card"><div className="tf-focus-title"><span>YOUR FOCUS</span><button>View tasks <FiArrowRight /></button></div><h2>3 tasks need your attention</h2><div className="tf-focus-task"><span className="tf-check"><FiCheck /></span><div><b>Finalize onboarding flow</b><p><FiHash /> customer-onboarding</p></div><em>Today</em></div><div className="tf-focus-task"><span className="tf-check"><FiCheck /></span><div><b>Review launch messaging</b><p><FiHash /> q4-product-launch</p></div><em>Tomorrow</em></div></div>
      <div className="tf-next-card"><FiClock /><p>NEXT UP</p><h3>Launch standup</h3><span>Today · 9:30 AM</span><button className="btn btn-sm btn-light mt-3">Join meeting</button></div>
    </section>}
    <section className="tf-project-section"><div className="tf-section-heading"><div><h2>{isProjects ? "All project channels" : "Project channels"}</h2><p>Follow delivery work without losing the conversation.</p></div>{!isProjects && <Link to="/Kanbas/Projects">View all <FiChevronRight /></Link>}</div><div className="tf-project-list">{courses.map((project: any, index: number) => <Link key={project._id} to={`/Kanbas/Courses/${project._id}/Home`} className="tf-project-row"><span className={`tf-project-icon icon-${index % 3}`}>{project.name.slice(0,1)}</span><div className="tf-project-main"><h3><FiHash /> {project.name}</h3><p>{summaries[project._id] || project.description}</p></div><div className="tf-project-progress"><span>{[72,58,84][index % 3]}%</span><div><i style={{width:`${[72,58,84][index % 3]}%`}} /></div></div><FiChevronRight className="tf-row-arrow" /></Link>)}</div></section>
    <div className="d-none"><input value={course.name} onChange={(e) => setCourse({ ...course, name: e.target.value })} /></div>
  </div>;
}
